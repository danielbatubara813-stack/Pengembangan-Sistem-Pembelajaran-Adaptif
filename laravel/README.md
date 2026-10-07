# Panduan Integrasi Sistem Pembelajaran Adaptif PHP ke Proyek Laravel

Folder `/laravel` ini berisi seluruh struktur kode backend dan database yang telah disiapkan secara rapi dan standar untuk Laravel (Laravel 10, 11, atau 12). Anda dapat langsung menyalin (copy-paste) file-file ini ke folder proyek Laravel Anda.

---

## 1. Pemetaan File ke Proyek Laravel Anda

Salin file dari folder ini ke lokasi proyek Laravel Anda:

| File Sumber di Sini | Salin ke Folder Laravel Anda |
|---------------------|-------------------------------|
| `laravel/app/Models/*` | `app/Models/` |
| `laravel/app/Http/Controllers/*` | `app/Http/Controllers/` |
| `laravel/app/Services/*` | `app/Services/` |
| `laravel/database/migrations/*` | `database/migrations/` |
| `laravel/database/seeders/*` | `database/seeders/` |
| `laravel/routes/web.php` | Gabungkan ke `routes/web.php` |

---

## 2. Langkah Instalasi & Database Migration

Setelah menyalin file ke proyek Laravel Anda, buka terminal dan jalankan:

```bash
# 1. Jalankan migrasi tabel database (8 tabel adaptif)
php artisan migrate

# 2. Isi bank 50 butir soal assessment & retest
php artisan db:seed --class=QuestionSeeder
```

---

## 3. Konfigurasi Lingkungan (.env)

Tambahkan konfigurasi opsional untuk integrasi Gemini AI di file `.env` Laravel Anda:

```env
# Opsional: Jika ingin analisis naratif langsung dari Gemini API
GEMINI_API_KEY="AIzaSy..."
```

*(Catatan: Jika API key tidak diisi, sistem otomatis menggunakan mesin diagnostik adaptif lokal dengan aturan skoring dan pemetaan skill gap yang 100% presisi).*

---

## 4. Struktur Basis Data (MySQL)

Sistem menggunakan 8 tabel relasional yang saling terhubung:
1. `questions`: Menyimpan 50 soal assessment awal dan 50 soal retest beserta kunci dan penjelasannya.
2. `assessments`: Rekaman nilai (0-100), level (Beginner/Intermediate/Advanced), dan analisis AI.
3. `answers`: Jawaban yang dipilih pengguna per butir soal.
4. `skill_gaps`: Topik-topik yang performanya di bawah ambang batas (&lt;70%) dengan prioritas perbaikan.
5. `recommendations`: 6 tipe sumber belajar (Video, Artikel, Dokumentasi, Jurnal, Website, Latihan) terfilter khusus untuk skill gap.
6. `user_recommendation_progress`: Status centang penyelesaian materi belajar oleh pengguna.
7. `retests`: Hasil pengerjaan 50 soal retest beserta komparasi peningkatan skor (+/-).
8. `retest_answers`: Rincian jawaban pada sesi retest.

---

## 5. Aturan Penentuan Level & Skill Gap

- **Score &lt; 60** &rarr; `Beginner`
- **60 &le; Score &lt; 80** &rarr; `Intermediate`
- **Score &ge; 80** &rarr; `Advanced`
- **Skill Gap**: Terdeteksi otomatis pada topik dengan akurasi &lt; 70%.
