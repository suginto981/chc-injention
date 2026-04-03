import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import * as XLSX from 'xlsx';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get('/api/health', async (_req, res) => {
  try {
    const r = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, result: r.rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'db_error' });
  }
});

app.get('/api/dashboard/summary', async (_req, res) => {
  try {
    const client = await pool.connect();
    try {
      const totalRunsQ = await client.query('SELECT COUNT(*)::int AS c FROM production_runs');
      const totalRuns = totalRunsQ.rows[0]?.c ?? 0;

      const lossRunsQ = await client.query(`
        SELECT COUNT(*)::int AS c
        FROM production_runs pr
        WHERE (
          SELECT COALESCE(SUM(d.qty),0)
          FROM defects d
          WHERE d.production_run_id = pr.id
        ) > 20
      `);
      const lossRuns = lossRunsQ.rows[0]?.c ?? 0;

      const avgDefectQ = await client.query(`
        SELECT COALESCE(AVG(total_defects),0)::float AS v
        FROM (
          SELECT COALESCE(SUM(d.qty),0) AS total_defects
          FROM production_runs pr
          LEFT JOIN defects d ON d.production_run_id = pr.id
          GROUP BY pr.id
        ) t
      `);
      const avgDefect = Math.round(avgDefectQ.rows[0]?.v ?? 0);

      const avgDowntimeQ = await client.query(`
        SELECT COALESCE(AVG(minutes),0)::float AS v FROM downtime_events
      `);
      const avgDowntime = Number(((avgDowntimeQ.rows[0]?.v ?? 0) / 60).toFixed(1));

      const avgMaterialQ = await client.query(`
        SELECT COALESCE(AVG(quantity),0)::float AS v FROM material_usage
      `);
      const avgMaterial = Math.round(avgMaterialQ.rows[0]?.v ?? 0);

      const latestQ = await client.query(`
        SELECT pr.run_date::date AS date,
               COALESCE(pr.actual_qty, pr.planned_qty)::int AS qty,
               COALESCE(SUM(d.qty),0)::int AS defects
        FROM production_runs pr
        LEFT JOIN defects d ON d.production_run_id = pr.id
        GROUP BY pr.id
        ORDER BY pr.run_date DESC
        LIMIT 5
      `);
      const latest = latestQ.rows.map(r => ({
        date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
        qty: r.qty,
        defects: r.defects,
      }));

      const trend = await client.query(`
        SELECT pr.run_date::date AS date,
               COALESCE(SUM(d.qty),0)::int AS defects
        FROM production_runs pr
        LEFT JOIN defects d ON d.production_run_id = pr.id
        GROUP BY pr.run_date
        ORDER BY pr.run_date ASC
        LIMIT 100
      `);

      res.json({
        totalProduksi: totalRuns,
        totalKerugian: lossRuns,
        sukses: totalRuns ? ((totalRuns - lossRuns) / totalRuns) * 100 : 0,
        avgDefect,
        avgDowntime,
        avgMaterial,
        latest,
        seriesDefects: trend.rows.map(r => ({
          date: r.date instanceof Date ? r.date.toISOString().slice(5, 10) : String(r.date).slice(5, 10),
          defects: r.defects,
        })),
      });
    } finally {
      client.release();
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: 'summary_failed' });
  }
});

async function getOrCreateMachine(client, code) {
  const sel = await client.query('SELECT id FROM machines WHERE code = $1', [code]);
  if (sel.rowCount) return sel.rows[0].id;
  const ins = await client.query('INSERT INTO machines(code,name) VALUES ($1,$2) RETURNING id', [code, code]);
  return ins.rows[0].id;
}
async function getOrCreateShift(client, name) {
  const sel = await client.query('SELECT id FROM shifts WHERE name = $1', [name]);
  if (sel.rowCount) return sel.rows[0].id;
  const ins = await client.query(
    'INSERT INTO shifts(name,start_time,end_time) VALUES ($1,$2,$3) RETURNING id',
    [name, '00:00', '23:59']
  );
  return ins.rows[0].id;
}
async function getOrCreateOperator(client, fullName) {
  if (!fullName) return null;
  const sel = await client.query('SELECT id FROM operators WHERE full_name = $1', [fullName]);
  if (sel.rowCount) return sel.rows[0].id;
  const ins = await client.query('INSERT INTO operators(full_name) VALUES ($1) RETURNING id', [fullName]);
  return ins.rows[0].id;
}

app.post('/api/import/production-json', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ ok: false, error: 'empty' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    for (const it of items) {
      const machineId = await getOrCreateMachine(client, it.machine_code);
      const shiftId = it.shift_name ? await getOrCreateShift(client, it.shift_name) : null;
      const operatorId = it.operator_name ? await getOrCreateOperator(client, it.operator_name) : null;
      await client.query(
        `INSERT INTO production_runs(machine_id,shift_id,run_date,product_code,planned_qty,actual_qty,cycle_time_sec,operator_id,temperature_c,pressure_bar,machine_hours,raw_material_kg)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          machineId,
          shiftId,
          it.run_date,
          it.product_code ?? null,
          it.planned_qty ?? null,
          it.actual_qty ?? null,
          it.cycle_time_sec ?? null,
          operatorId,
          it.temperature_c ?? null,
          it.pressure_bar ?? null,
          it.machine_hours ?? null,
          it.raw_material_kg ?? null,
        ]
      );
      inserted++;
    }
    await client.query('COMMIT');
    res.json({ ok: true, inserted });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: 'import_failed' });
  } finally {
    client.release();
  }
});

app.post('/api/import/predictions-json', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ ok: false, error: 'empty' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let upserted = 0;
    for (const it of items) {
      const m = await client.query('SELECT id FROM machines WHERE code = $1', [it.machine_code]);
      if (!m.rowCount) continue;
      const pr = await client.query(
        `SELECT id FROM production_runs WHERE machine_id = $1 AND run_date = $2 ORDER BY id DESC LIMIT 1`,
        [m.rows[0].id, it.run_date]
      );
      const runId = pr.rowCount ? pr.rows[0].id : null;
      await client.query(
        `INSERT INTO predictions(production_run_id,predicted_loss_qty,predicted_downtime_minutes,model_version)
         VALUES ($1,$2,$3,$4)`,
        [runId, it.predicted_loss_qty ?? null, it.predicted_downtime_minutes ?? null, it.model_version ?? null]
      );
      upserted++;
    }
    await client.query('COMMIT');
    res.json({ ok: true, upserted });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: 'import_failed' });
  } finally {
    client.release();
  }
});

app.post('/api/import/production-xlsx', async (req, res) => {
  const { fileBase64 } = req.body || {};
  if (!fileBase64) return res.status(400).json({ ok: false, error: 'no_file' });
  try {
    const buf = Buffer.from(fileBase64, 'base64');
    const wb = XLSX.read(buf, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const items = rows.map(r => ({
      machine_code: r.machine_code || r.machine || r.MACHINE || r.Machine,
      run_date: r.run_date || r.date || r.RUN_DATE || r.Date,
      shift_name: r.shift_name || r.shift || r.SHIFT || null,
      product_code: r.product_code || r.product || r.PRODUCT || null,
      planned_qty: r.planned_qty || r.planned || r.PLANNED_QTY || null,
      actual_qty: r.actual_qty || r.actual || r.ACTUAL_QTY || null,
      cycle_time_sec: r.cycle_time_sec || r.cycle || r.CYCLE_TIME_SEC || null,
      operator_name: r.operator_name || r.operator || r.OPERATOR || null,
    }));
    req.body = { items };
    return app._router.handle({ ...req, method: 'POST', url: '/api/import/production-json' }, res, () => {});
  } catch {
    return res.status(400).json({ ok: false, error: 'parse_error' });
  }
});

app.get('/api/template/production', (req, res) => {
  const format = req.query.format || 'csv';
  const headers = ['machine_code', 'run_date', 'shift_name', 'product_code', 'planned_qty', 'actual_qty', 'cycle_time_sec', 'operator_name', 'temperature_c', 'pressure_bar', 'machine_hours', 'raw_material_kg'];
  const sample = [['MC01', '2024-03-01', 'Shift 1', 'PRD-A', 1000, 950, 35.5, 'Budi', 185, 120, 8.5, 1250]];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'template');
  
  if (format === 'xlsx') {
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_produksi.xlsx');
    return res.send(buf);
  }
  const csv = XLSX.utils.sheet_to_csv(ws);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=template_produksi.csv');
  return res.send(csv);
});

app.get('/api/template/predictions', (req, res) => {
  const format = req.query.format || 'csv';
  const headers = ['machine_code', 'run_date', 'predicted_loss_qty', 'predicted_downtime_minutes', 'model_version'];
  const sample = [['MC01', '2024-03-01', 5, 10, 'v1.0']];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'template');

  if (format === 'xlsx') {
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_prediksi.xlsx');
    return res.send(buf);
  }
  const csv = XLSX.utils.sheet_to_csv(ws);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=template_prediksi.csv');
  return res.send(csv);
});

app.get('/api/export/production', async (req, res) => {
  const format = (req.query.format || 'csv').toString();
  const client = await pool.connect();
  try {
    const q = await client.query(`
      SELECT pr.run_date::date AS run_date,
             m.code AS machine_code,
             s.name AS shift_name,
             pr.product_code,
             pr.planned_qty::int,
             pr.actual_qty::int,
             pr.cycle_time_sec::float,
             o.full_name AS operator_name
      FROM production_runs pr
      JOIN machines m ON m.id = pr.machine_id
      LEFT JOIN shifts s ON s.id = pr.shift_id
      LEFT JOIN operators o ON o.id = pr.operator_id
      ORDER BY pr.run_date DESC
      LIMIT 1000
    `);
    const rows = q.rows.map(r => ({ ...r, run_date: r.run_date?.toISOString().slice(0, 10) }));
    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'production');
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=production.xlsx');
      return res.send(buf);
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=production.csv');
    return res.send(csv);
  } finally {
    client.release();
  }
});

app.get('/api/export/predictions', async (req, res) => {
  const format = (req.query.format || 'csv').toString();
  const client = await pool.connect();
  try {
    const q = await client.query(`
      SELECT pr.run_date::date AS run_date,
             m.code AS machine_code,
             p.predicted_loss_qty::int,
             p.predicted_downtime_minutes::int,
             p.model_version
      FROM predictions p
      LEFT JOIN production_runs pr ON pr.id = p.production_run_id
      LEFT JOIN machines m ON m.id = pr.machine_id
      ORDER BY pr.run_date DESC NULLS LAST
      LIMIT 1000
    `);
    const rows = q.rows.map(r => ({ ...r, run_date: r.run_date?.toISOString().slice(0, 10) }));
    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'predictions');
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=predictions.xlsx');
      return res.send(buf);
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=predictions.csv');
    return res.send(csv);
  } finally {
    client.release();
  }
});

app.get('/api/production/list', async (_req, res) => {
  const client = await pool.connect();
  try {
    const q = await client.query(`
      SELECT pr.id,
             pr.run_date::date AS run_date,
             pr.raw_material_kg::float,
             pr.machine_hours::float,
             pr.temperature_c::float,
             pr.pressure_bar::float,
             pr.cycle_time_sec::float,
             COALESCE(SUM(d.qty),0)::int AS defect_qty,
             COALESCE(SUM(de.minutes),0)::float AS downtime_minutes
      FROM production_runs pr
      LEFT JOIN defects d ON d.production_run_id = pr.id
      LEFT JOIN downtime_events de ON de.production_run_id = pr.id
      GROUP BY pr.id
      ORDER BY pr.run_date DESC
      LIMIT 100
    `);
    res.json(q.rows.map(r => ({
      ...r,
      run_date: r.run_date instanceof Date ? r.run_date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
      status: r.defect_qty > 20 ? 'Rugi' : 'Aman'
    })));
  } catch (e) {
    res.status(500).json({ ok: false, error: 'fetch_failed' });
  } finally {
    client.release();
  }
});

app.post('/api/ai/predict', async (req, res) => {
  const { 
    temperature_c, 
    pressure_bar, 
    machine_hours, 
    raw_material_kg, 
    cycle_time_sec 
  } = req.body;

  try {
    const prompt = `Analisis data produksi CHC Injection 1600 Ton berikut:
- Suhu: ${temperature_c}°C
- Tekanan: ${pressure_bar} bar
- Jam Operasi Mesin: ${machine_hours} jam
- Bahan Baku: ${raw_material_kg} kg
- Cycle Time: ${cycle_time_sec} detik

Berdasarkan data tersebut, berikan prediksi:
1. Estimasi jumlah defect (unit)
2. Estimasi downtime (menit)
3. Analisis risiko kerugian (Aman/Rugi)
4. Rekomendasi perbaikan setting mesin jika ada risiko.

Berikan respon dalam format JSON: { "predicted_loss_qty": number, "predicted_downtime_minutes": number, "risk_status": "Aman" | "Rugi", "analysis": "string", "recommendation": "string" }`;

    const aiRes = await fetch(`${process.env.AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL_NAME,
        messages: [
          { role: 'system', content: 'Anda adalah ahli AI industri khusus untuk mesin injection molding 1600 Ton. Anda memberikan prediksi teknis yang akurat dalam format JSON.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const aiData = await aiRes.json();
    
    if (!aiData.choices || !aiData.choices[0]) {
      console.error('AI Unexpected Response:', aiData);
      throw new Error('Unexpected AI response format');
    }

    let content = aiData.choices[0].message.content;
    
    // Handle potential code block wrapping from AI
    if (content.includes('```')) {
      content = content.replace(/```json\n?|```/g, '').trim();
    }
    
    const result = JSON.parse(content);
    res.json(result);
  } catch (e) {
    console.error('AI Error:', e);
    res.status(500).json({ ok: false, error: 'ai_prediction_failed' });
  }
});

app.get('/api/predictions/analysis', async (_req, res) => {
  const client = await pool.connect();
  try {
    const q = await client.query(`
      SELECT 
        pr.id,
        pr.run_date::date AS date,
        m.code AS machine_code,
        pr.actual_qty::int AS actual_qty,
        COALESCE((SELECT SUM(qty) FROM defects WHERE production_run_id = pr.id), 0)::int AS actual_loss,
        p.predicted_loss_qty::int AS predicted_loss,
        p.predicted_downtime_minutes::int AS predicted_downtime,
        COALESCE((SELECT SUM(minutes) FROM downtime_events WHERE production_run_id = pr.id), 0)::int AS actual_downtime
      FROM production_runs pr
      JOIN machines m ON m.id = pr.machine_id
      LEFT JOIN predictions p ON p.production_run_id = pr.id
      WHERE p.id IS NOT NULL
      ORDER BY pr.run_date DESC
      LIMIT 50
    `);
    
    res.json(q.rows.map(r => ({
      ...r,
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
      deviation_loss: r.actual_loss - r.predicted_loss,
      accuracy_loss: r.predicted_loss > 0 ? Math.max(0, 100 - (Math.abs(r.actual_loss - r.predicted_loss) / r.predicted_loss * 100)) : 100
    })));
  } catch (e) {
    res.status(500).json({ ok: false, error: 'fetch_failed' });
  } finally {
    client.release();
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;
