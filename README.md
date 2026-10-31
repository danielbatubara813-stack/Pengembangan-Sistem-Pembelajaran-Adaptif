<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d987a06c-d316-4859-87f9-803b700f3016

## Menjalankan lokal

React berjalan melalui Vite di root proyek. Laravel adalah satu-satunya backend API; Vite meneruskan `/api` dan `/sanctum` ke Laravel.

1. Pastikan PHP 8.3+, Composer, Node.js, dan MySQL tersedia.
2. Di `laravel/`, pasang dependensi Composer. Buat `laravel/.env` dari `laravel/.env.example` hanya jika file tersebut belum ada. Atur koneksi MySQL ke `pengembangan_pembelajaran_adaptif` dan isi kunci Gemini atau OpenRouter hanya di `.env` Laravel.
3. Jalankan `php artisan key:generate` hanya untuk instalasi Laravel baru yang belum memiliki `APP_KEY`.
4. Periksa `php artisan migrate:status`, lalu jalankan `php artisan migrate` untuk migration yang tertunda. Bank soal 300 butir sudah ada; jangan jalankan seeder atau reset database.
5. Jalankan Laravel dengan `php artisan serve --host=127.0.0.1 --port=8000`.
6. Dari root proyek, jalankan `npm install`, lalu `npm run dev`.

Sanctum memakai session cookie dan CSRF. Untuk frontend production pada domain terpisah, atur `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, dan `VITE_LARAVEL_API_URL`; frontend dan API harus berbagi domain cookie yang sesuai.

Pencarian referensi belajar menggunakan Google Search grounding dari Gemini melalui Laravel. Kunci Gemini/OpenRouter hanya disimpan di `laravel/.env`. Laravel menyimpan subkompetensi, hasil validasi referensi, dan riwayat rekomendasi di MySQL; URL yang tidak lolos pemeriksaan tidak ditampilkan. Lihat pengaturan model, cache, serta kuota/harga di [dokumentasi backend](laravel/README.md).

## Verifikasi

- Dari `laravel/`, jalankan `php artisan route:list --path=api` untuk memeriksa endpoint.
- Jalankan `php artisan test` untuk uji API. Uji memakai transaksi MySQL dan membatalkan data uji setelah selesai.
- Dari root, jalankan `npm run lint` dan `npm run build`.

Jangan commit file `.env`, `laravel/vendor/`, atau hasil build lokal.
