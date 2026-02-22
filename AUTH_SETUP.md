# Setup Autentikasi Supabase

## Instalasi Dependencies

Jalankan perintah berikut untuk menginstall Supabase client:

```bash
npm install @supabase/supabase-js
```

## Konfigurasi Environment

1. Copy file `.env.example` ke `.env`
2. File `.env` sudah berisi konfigurasi yang benar untuk project ini

## Fitur Autentikasi

### 1. Registrasi User
- Form registrasi dengan email dan password
- Validasi password minimal 6 karakter
- Konfirmasi password
- Email konfirmasi otomatis dikirim oleh Supabase

### 2. Login User
- Form login dengan email dan password
- Session management otomatis
- Redirect ke dashboard setelah login berhasil

### 3. Protected Routes
- Semua halaman utama dilindungi dengan autentikasi
- User yang belum login akan diarahkan ke halaman auth
- Loading state saat memeriksa status autentikasi

### 4. User Menu
- Avatar dengan inisial user
- Dropdown menu dengan informasi user
- Tombol logout

## Komponen yang Dibuat

### Auth Components
- `LoginForm` - Form login
- `RegisterForm` - Form registrasi  
- `ProtectedRoute` - Wrapper untuk halaman yang memerlukan auth
- `UserMenu` - Menu user di sidebar

### Context & Hooks
- `AuthContext` - Context untuk state management autentikasi
- `useAuth` - Hook untuk mengakses auth context

### Pages
- `AuthPage` - Halaman yang menggabungkan login dan register

## Cara Penggunaan

1. Install dependencies: `npm install @supabase/supabase-js`
2. Jalankan aplikasi: `npm run dev`
3. Buka browser dan akses aplikasi
4. Anda akan diarahkan ke halaman auth jika belum login
5. Daftar akun baru atau login dengan akun existing
6. Setelah login, Anda dapat mengakses semua fitur aplikasi

## Konfigurasi Supabase

Project sudah dikonfigurasi dengan:
- URL: https://bnxgjfjxkexhdxqumywk.supabase.co
- Anon Key: Sudah dikonfigurasi di environment variables

## Catatan Keamanan

- File `.env` sudah ditambahkan ke `.gitignore`
- Menggunakan anon key yang aman untuk client-side
- Session management ditangani otomatis oleh Supabase
- Password di-hash secara otomatis oleh Supabase Auth