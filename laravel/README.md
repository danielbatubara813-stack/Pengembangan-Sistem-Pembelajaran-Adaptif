# Laravel API AdaptivePHP

Folder ini adalah backend Laravel aktif untuk aplikasi React di root proyek. React menggunakan API `/api/*` dan session cookie Laravel Sanctum.

---

## Menjalankan backend

1. Jalankan `composer install` dari folder ini.
2. Pertahankan `.env` yang sudah ada. Jika belum ada, salin `.env.example` ke `.env`, lalu atur MySQL ke `pengembangan_pembelajaran_adaptif`.
3. Isi kunci Gemini atau OpenRouter di `.env` Laravel saja.
4. Periksa `php artisan migrate:status`. Jalankan `php artisan migrate` untuk migration yang tertunda setelah memastikan target koneksi benar.
5. Jalankan `php artisan serve --host=127.0.0.1 --port=8000`.

Bank soal 300 butir sudah tersedia, masing-masing 100 untuk Beginner, Intermediate, dan Advanced. Jangan jalankan seeder, `migrate:fresh`, `db:wipe`, atau perintah reset database.

---

## Konfigurasi lingkungan (.env)

Konfigurasi provider hanya berada di `.env` Laravel. Gemini diperlukan untuk pencarian web grounded; OpenRouter opsional untuk penilaian kecocokan sumber dan analisis teks. Kunci tidak dipakai di React:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash
GEMINI_SEARCH_MODEL=gemini-3.8-flash
OPENROUTER_API_KEY=
OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini
LEARNING_SEARCH_CACHE_STORE=file
LEARNING_SEARCH_CACHE_HOURS=24
LEARNING_SEARCH_VALIDATION_HOURS=24
```

Gemini Search mengembalikan citation URL; Laravel mengambil dan memeriksa halaman, metadata, kecocokan isi, lalu status pemutaran video sebelum menyimpan rekomendasi. Hasil pencarian dan validasi di-cache 24 jam secara default. Tautan yang gagal validasi tidak dikirim ke React; saat tidak ada hasil, halaman menampilkan empty state.

Menurut dokumentasi Google yang diperiksa 30 Oktober 2026, Gemini 3+ mencakup 5.000 search requests gratis per bulan, lalu $14 per 1.000 query; batas default tier berbayar yang didokumentasikan ialah 1.500 request per hari per project. Satu prompt kompetensi dapat memicu beberapa query Google, dan biaya token model dapat berlaku terpisah. Lihat [harga Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search) dan [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits). Tanpa `GEMINI_API_KEY`, analisis assessment tetap dapat memakai fallback lokal, tetapi sistem tidak mengarang atau menampilkan tautan rekomendasi.

---

## 4. Struktur Basis Data (MySQL)

Backend memakai tabel relasional berikut serta `users`, `sessions`, dan `user_progress` untuk akun, sesi, dan snapshot progres:
1. `questions`: Menyimpan bank soal CSV per level; assessment awal mengambil 10 soal acak dari tiap level (30 total).
2. `assessments`: Rekaman nilai (0-100), level (Beginner/Intermediate/Advanced), dan analisis AI.
3. `answers`: Jawaban yang dipilih pengguna per butir soal.
4. `skill_gaps`: Topik-topik yang performanya di bawah ambang batas (&lt;70%) dengan prioritas perbaikan.
5. `learning_competencies`: Subkompetensi yang diturunkan dari butir soal, tujuan belajar, contoh kode, dan latihan.
6. `assessment_competency_results`: Skor benar/salah per kompetensi dan tingkat kesulitan pada tes awal maupun retest.
7. `recommendations`: Referensi hasil pencarian dengan metadata URL, domain, query, relevansi, dan status validasi/playback.
8. `user_learning_recommendations`: Riwayat rekomendasi per akun dan percobaan assessment, termasuk status aktif, dikuasai, atau diganti setelah retest.
9. `user_recommendation_progress`: Status centang penyelesaian materi belajar oleh pengguna.
10. `retests`: Hasil pengerjaan maksimal 30 soal retest beserta komparasi peningkatan skor (+/-).
11. `retest_answers`: Rincian jawaban pada sesi retest.

---

## 5. Aturan Penentuan Level & Skill Gap

- **Score &lt; 60** &rarr; `Beginner`
- **60 &le; Score &lt; 80** &rarr; `Intermediate`
- **Score &ge; 80** &rarr; `Advanced`
- **Skill Gap**: Terdeteksi otomatis pada topik dengan akurasi &lt; 70%.
