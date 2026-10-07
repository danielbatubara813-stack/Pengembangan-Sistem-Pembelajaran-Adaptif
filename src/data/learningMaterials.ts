import { PHPTopic, Recommendation } from '../types';

export interface LearningDetail {
  id: string;
  topic: PHPTopic;
  title: string;
  overview: string;
  keyConcepts: Array<{
    heading: string;
    description: string;
    codeExample?: string;
  }>;
  commonPitfalls: string[];
  bestPractices: string[];
  exercises: Array<{
    title: string;
    prompt: string;
    hint: string;
    solution: string;
  }>;
}

export const TOPIC_RECOMMENDATIONS: Record<PHPTopic, Recommendation[]> = {
  'Dasar PHP': [
    {
      id: 'rec-dasar-1',
      topic: 'Dasar PHP',
      type: 'video',
      title: 'Pemrograman Dasar PHP untuk Pemula & Arsitektur Server Web',
      url: 'https://www.youtube.com/watch?v=l1W2OwV5rgY',
      embedVideoUrl: 'https://www.youtube.com/embed/l1W2OwV5rgY',
      description: 'Memahami cara kerja server PHP, sintaksis standar PSR-12, konstruksi bahasa echo vs print, dan konfigurasi php.ini.',
      publisher: 'Web Programming UNPAS',
      estimatedMinutes: 25
    },
    {
      id: 'rec-dasar-2',
      topic: 'Dasar PHP',
      type: 'dokumentasi',
      title: 'Dokumentasi Resmi PHP: Sintaksis Dasar (Basic Syntax)',
      url: 'https://www.php.net/manual/en/language.basic-syntax.php',
      description: 'Panduan referensi resmi tentang tag PHP, pemisahan instruksi, dan standar penulisan skrip.',
      publisher: 'The PHP Group',
      readTime: '10 menit'
    },
    {
      id: 'rec-dasar-3',
      topic: 'Dasar PHP',
      type: 'artikel',
      title: 'Struktur Program PHP Bersih Berstandar PSR',
      url: 'https://www.php-fig.org/psr/psr-12/',
      description: 'Pedoman pengkodean resmi standar industri untuk konsistensi kode program.',
      publisher: 'PHP-FIG',
      readTime: '15 menit'
    },
    {
      id: 'rec-dasar-4',
      topic: 'Dasar PHP',
      type: 'latihan',
      title: 'Praktik Sintaks Dasar & Output Formatting',
      url: '#exercise',
      description: 'Latihan langsung memformat skrip PHP murni dan memahami mekanisme runtime output buffer.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ],
  'Variabel dan Tipe Data': [
    {
      id: 'rec-var-1',
      topic: 'Variabel dan Tipe Data',
      type: 'video',
      title: 'Kupas Tuntas Tipe Data PHP, Type Juggling & Strict Types',
      url: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
      embedVideoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c',
      description: 'Mendalami perbedaan skalar, konversi tipe otomatis (coercion), dan deklarasi declare(strict_types=1).',
      publisher: 'Programmer Zaman Now',
      estimatedMinutes: 28
    },
    {
      id: 'rec-var-2',
      topic: 'Variabel dan Tipe Data',
      type: 'dokumentasi',
      title: 'PHP Manual: Type System & Type Casting',
      url: 'https://www.php.net/manual/en/language.types.php',
      description: 'Penjelasan mendalam tentang primitive types, union types PHP 8, dan tipe khusus NULL.',
      publisher: 'The PHP Group',
      readTime: '12 menit'
    },
    {
      id: 'rec-var-3',
      topic: 'Variabel dan Tipe Data',
      type: 'jurnal',
      title: 'Analisis Keandalan Tipe Data Dinamis vs Statis pada Bahasa Skrip Web',
      url: 'https://ieeexplore.ieee.org/abstract/document/8457211',
      description: 'Kajian akademik dampak type coercion terhadap reliabilitas dan performa aplikasi web skala enterprise.',
      publisher: 'IEEE Computer Society',
      readTime: '20 menit'
    },
    {
      id: 'rec-var-4',
      topic: 'Variabel dan Tipe Data',
      type: 'latihan',
      title: 'Simulasi Type Juggling & Casting Bug Hunter',
      url: '#exercise',
      description: 'Uji kemampuan memprediksi perilaku tipe data pada operasi logika dan aritmatika non-sejenis.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ],
  'Operator': [
    {
      id: 'rec-op-1',
      topic: 'Operator',
      type: 'video',
      title: 'Operator Modern PHP: Null Coalescing, Spaceship & Nullsafe',
      url: 'https://www.youtube.com/watch?v=fX1dkh8tVpQ',
      embedVideoUrl: 'https://www.youtube.com/embed/fX1dkh8tVpQ',
      description: 'Kuasai operator-operator PHP 7 & 8 yang mempercepat penulisan logika dan menghindari error notice.',
      publisher: 'Traversy Media',
      estimatedMinutes: 22
    },
    {
      id: 'rec-op-2',
      topic: 'Operator',
      type: 'dokumentasi',
      title: 'PHP Manual: Operator Precedence & Comparison Operators',
      url: 'https://www.php.net/manual/en/language.operators.php',
      description: 'Tabel hierarki prioritas eksekusi operator dan aturan strict comparison (===).',
      publisher: 'The PHP Group',
      readTime: '15 menit'
    },
    {
      id: 'rec-op-3',
      topic: 'Operator',
      type: 'website',
      title: 'PHP The Right Way: Comparison & Logical Operators',
      url: 'https://phptherightway.com/',
      description: 'Panduan ringkas best practice penulisan operator perbandingan dan ternary operator.',
      publisher: 'PHP The Right Way',
      readTime: '12 menit'
    },
    {
      id: 'rec-op-4',
      topic: 'Operator',
      type: 'latihan',
      title: 'Tantangan Logika Ekspresi Bitwise & Null coalescing',
      url: '#exercise',
      description: 'Studi kasus pembersihan data input dengan operator ternary dan null coalescing bersarang.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 15
    }
  ],
  'Conditional': [
    {
      id: 'rec-cond-1',
      topic: 'Conditional',
      type: 'video',
      title: 'Struktur Kontrol PHP: If-Else, Switch Case, dan Ekspresi Match PHP 8',
      url: 'https://www.youtube.com/watch?v=243pQhCA4GE',
      embedVideoUrl: 'https://www.youtube.com/embed/243pQhCA4GE',
      description: 'Perbandingan komprehensif antara switch tradisional dengan ekspresi match yang lebih ketat dan aman.',
      publisher: 'Laracasts',
      estimatedMinutes: 24
    },
    {
      id: 'rec-cond-2',
      topic: 'Conditional',
      type: 'dokumentasi',
      title: 'PHP Manual: Match Expression & Control Structures',
      url: 'https://www.php.net/manual/en/control-structures.match.php',
      description: 'Dokumentasi sintaksis match, handling default, dan pattern matching di PHP 8.',
      publisher: 'The PHP Group',
      readTime: '10 menit'
    },
    {
      id: 'rec-cond-3',
      topic: 'Conditional',
      type: 'artikel',
      title: 'Refaktorisasi Kondisional Kompleks Menjadi Guard Clauses',
      url: 'https://refactoring.guru/replace-nested-conditional-with-guard-clauses',
      description: 'Teknik menghindari arrow anti-pattern dan nested if bercabang dengan early return.',
      publisher: 'Refactoring Guru',
      readTime: '15 menit'
    },
    {
      id: 'rec-cond-4',
      topic: 'Conditional',
      type: 'latihan',
      title: 'Refactor Switch Case ke Match Expression',
      url: '#exercise',
      description: 'Latihan mengubah kode status HTTP switch-case lama menjadi ekspresi match modern.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ],
  'Looping': [
    {
      id: 'rec-loop-1',
      topic: 'Looping',
      type: 'video',
      title: 'Perulangan PHP Efisien: Foreach, For, While dan Memory Generators',
      url: 'https://www.youtube.com/watch?v=1SnPKhCdLsU',
      embedVideoUrl: 'https://www.youtube.com/embed/1SnPKhCdLsU',
      description: 'Menguasai manipulasi iterasi array, penggunaan referensi (&), dan yield generator.',
      publisher: 'Web Programming UNPAS',
      estimatedMinutes: 26
    },
    {
      id: 'rec-loop-2',
      topic: 'Looping',
      type: 'dokumentasi',
      title: 'PHP Manual: Control Structures - Foreach & Generators',
      url: 'https://www.php.net/manual/en/control-structures.foreach.php',
      description: 'Panduan lengkap perulangan array dan iterator generator.',
      publisher: 'The PHP Group',
      readTime: '12 menit'
    },
    {
      id: 'rec-loop-3',
      topic: 'Looping',
      type: 'artikel',
      title: 'Optimalisasi Memori dengan Generator dan Yield pada Dataset Besar',
      url: 'https://stitcher.io/blog/php-generators',
      description: 'Cara membaca file log ribuan baris tanpa menyebabkan Memory Exhausted Error.',
      publisher: 'Stitcher.io',
      readTime: '15 menit'
    },
    {
      id: 'rec-loop-4',
      topic: 'Looping',
      type: 'latihan',
      title: 'Iterasi Algoritma dan Manipulasi Referensi Foreach',
      url: '#exercise',
      description: 'Latihan memodifikasi koleksi array multidimensi dengan aman menggunakan foreach referensial.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ],
  'Array': [
    {
      id: 'rec-arr-1',
      topic: 'Array',
      type: 'video',
      title: 'Mastering PHP Array: Array Map, Filter, Reduce & Sort',
      url: 'https://www.youtube.com/watch?v=XzWz2xG4zfc',
      embedVideoUrl: 'https://www.youtube.com/embed/XzWz2xG4zfc',
      description: 'Pelajari functional array programming di PHP untuk menulis kode yang deklaratif dan efisien.',
      publisher: 'FreeCodeCamp PHP',
      estimatedMinutes: 35
    },
    {
      id: 'rec-arr-2',
      topic: 'Array',
      type: 'dokumentasi',
      title: 'PHP Manual: Array Functions Reference',
      url: 'https://www.php.net/manual/en/ref.array.php',
      description: 'Kamus resmi fungsi array PHP: array_merge, array_column, in_array, ksort, dan asort.',
      publisher: 'The PHP Group',
      readTime: '20 menit'
    },
    {
      id: 'rec-arr-3',
      topic: 'Array',
      type: 'artikel',
      title: 'Perbedaan Krusial Array Union (+) vs array_merge()',
      url: 'https://www.php.net/manual/en/language.operators.array.php',
      description: 'Studi kasus duplikasi kunci numerik vs string saat menggabungkan dataset array.',
      publisher: 'PHP Architect',
      readTime: '12 menit'
    },
    {
      id: 'rec-arr-4',
      topic: 'Array',
      type: 'latihan',
      title: 'Pembersihan Data Pelanggan Menggunakan Array Filter & Map',
      url: '#exercise',
      description: 'Tantangan transformasi payload JSON array menjadi format laporan terstruktur.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 25
    }
  ],
  'Function': [
    {
      id: 'rec-func-1',
      topic: 'Function',
      type: 'video',
      title: 'PHP Functions: Type Hints, Closures, Arrow Functions & Named Arguments',
      url: 'https://www.youtube.com/watch?v=hB9i8f70j_U',
      embedVideoUrl: 'https://www.youtube.com/embed/hB9i8f70j_U',
      description: 'Memahami deklarasi fungsi modern, closure dengan keyword use, serta return type yang ketat.',
      publisher: 'Programmer Zaman Now',
      estimatedMinutes: 30
    },
    {
      id: 'rec-func-2',
      topic: 'Function',
      type: 'dokumentasi',
      title: 'PHP Manual: User-defined functions & Anonymous functions',
      url: 'https://www.php.net/manual/en/functions.anonymous.php',
      description: 'Penjelasan closure, scope binding, return type declarations, dan variadic parameters.',
      publisher: 'The PHP Group',
      readTime: '15 menit'
    },
    {
      id: 'rec-func-3',
      topic: 'Function',
      type: 'jurnal',
      title: 'Implementasi Pola Desain Higher-Order Function dalam Pengembangan Layanan Web',
      url: 'https://journal.ittelkom-pwt.ac.id/',
      description: 'Kajian pemanfaatan fungsi anonim dan callback untuk fleksibilitas modularitas perangkat lunak.',
      publisher: 'Jurnal Rekayasa Sistem Informasi',
      readTime: '25 menit'
    },
    {
      id: 'rec-func-4',
      topic: 'Function',
      type: 'latihan',
      title: 'Pembuatan Middleware Pipeline Menggunakan Closures',
      url: '#exercise',
      description: 'Praktik membuat handler request berantai dengan closure dan parameter variadic.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 25
    }
  ],
  'String': [
    {
      id: 'rec-str-1',
      topic: 'String',
      type: 'video',
      title: 'Manipulasi String PHP: Explode, Implode, Regex & Sanitasi Input',
      url: 'https://www.youtube.com/watch?v=0_u6f827j2o',
      embedVideoUrl: 'https://www.youtube.com/embed/0_u6f827j2o',
      description: 'Panduan praktis pengolahan teks, interpolasi heredoc, serta fungsi baru str_contains dan str_starts_with.',
      publisher: 'Web Programming UNPAS',
      estimatedMinutes: 24
    },
    {
      id: 'rec-str-2',
      topic: 'String',
      type: 'dokumentasi',
      title: 'PHP Manual: String Functions Reference',
      url: 'https://www.php.net/manual/en/ref.strings.php',
      description: 'Dokumentasi fungsi substr, strpos, trim, preg_replace, dan htmlspecialchars.',
      publisher: 'The PHP Group',
      readTime: '18 menit'
    },
    {
      id: 'rec-str-3',
      topic: 'String',
      type: 'website',
      title: 'PHP 8 New String Functions Cheat Sheet',
      url: 'https://php.watch/versions/8.0/str_contains',
      description: 'Ringkasan str_contains, str_starts_with, dan str_ends_with menggantikan strpos !== false.',
      publisher: 'PHP.Watch',
      readTime: '8 menit'
    },
    {
      id: 'rec-str-4',
      topic: 'String',
      type: 'latihan',
      title: 'Generator Slug URL dan Pembersih HTML Entity',
      url: '#exercise',
      description: 'Implementasikan fungsi pembersih teks judul artikel menjadi URL slug yang ramah SEO.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ],
  'Object Oriented Programming / OOP': [
    {
      id: 'rec-oop-1',
      topic: 'Object Oriented Programming / OOP',
      type: 'video',
      title: 'Pemrograman Berorientasi Objek (OOP) PHP Lengkap dari Dasar ke Mahir',
      url: 'https://www.youtube.com/watch?v=34wK9H_Wb-U',
      embedVideoUrl: 'https://www.youtube.com/embed/34wK9H_Wb-U',
      description: 'Membahas class, object, constructor promotion, inheritance, encapsulation, abstract class, dan interface.',
      publisher: 'Programmer Zaman Now',
      estimatedMinutes: 45
    },
    {
      id: 'rec-oop-2',
      topic: 'Object Oriented Programming / OOP',
      type: 'dokumentasi',
      title: 'PHP Manual: Classes and Objects',
      url: 'https://www.php.net/manual/en/language.oop5.php',
      description: 'Dokumentasi resmi visibilitas (public, protected, private), magic methods, traits, dan readonly classes.',
      publisher: 'The PHP Group',
      readTime: '30 menit'
    },
    {
      id: 'rec-oop-3',
      topic: 'Object Oriented Programming / OOP',
      type: 'jurnal',
      title: 'Penerapan Prinsip SOLID pada Arsitektur Aplikasi Web Berbasis PHP Modern',
      url: 'https://jurnal.komputasi.org/index.php/solid-php',
      description: 'Analisis empiris efektivitas Single Responsibility, Open/Closed, dan Dependency Inversion dalam maintainability kode.',
      publisher: 'Jurnal Sains & Teknologi Informasi',
      readTime: '25 menit'
    },
    {
      id: 'rec-oop-4',
      topic: 'Object Oriented Programming / OOP',
      type: 'latihan',
      title: 'Membangun Sistem Pembayaran Multi-Gateway dengan Interface',
      url: '#exercise',
      description: 'Rancang class PaymentGateway interface dengan implementasi Midtrans dan Xendit secara polymorphic.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 30
    }
  ],
  'Database / MySQL': [
    {
      id: 'rec-db-1',
      topic: 'Database / MySQL',
      type: 'video',
      title: 'PHP PDO & MySQL: Prepared Statement, Transaksi, & Keamanan Injection',
      url: 'https://www.youtube.com/watch?v=kEW6f7Pilc4',
      embedVideoUrl: 'https://www.youtube.com/embed/kEW6f7Pilc4',
      description: 'Tutorial praktis menghubungkan database MySQL dengan PHP Data Objects (PDO) secara aman dan profesional.',
      publisher: 'Traversy Media',
      estimatedMinutes: 38
    },
    {
      id: 'rec-db-2',
      topic: 'Database / MySQL',
      type: 'dokumentasi',
      title: 'PHP Manual: PHP Data Objects (PDO)',
      url: 'https://www.php.net/manual/en/book.pdo.php',
      description: 'Spesifikasi koneksi PDO DSN, eksekusi query, prepared statement, dan mode fetch data.',
      publisher: 'The PHP Group',
      readTime: '25 menit'
    },
    {
      id: 'rec-db-3',
      topic: 'Database / MySQL',
      type: 'artikel',
      title: 'Panduan Menghindari SQL Injection Secara Tuntas dengan Parameter Binding',
      url: 'https://owasp.org/www-community/attacks/SQL_Injection',
      description: 'Pedoman standar keamanan OWASP untuk pengamanan query basis data relasional.',
      publisher: 'OWASP Foundation',
      readTime: '15 menit'
    },
    {
      id: 'rec-db-4',
      topic: 'Database / MySQL',
      type: 'latihan',
      title: 'Implementasi Database Transaction ACID untuk Transfer Saldo',
      url: '#exercise',
      description: 'Latihan membuat blok try-catch dengan beginTransaction(), execute(), commit(), dan rollBack().',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 30
    }
  ],
  'CRUD': [
    {
      id: 'rec-crud-1',
      topic: 'CRUD',
      type: 'video',
      title: 'Tutorial Lengkap CRUD PHP MySQL dengan Prepared Statements & Validasi',
      url: 'https://www.youtube.com/watch?v=N6Lff4wY6V8',
      embedVideoUrl: 'https://www.youtube.com/embed/N6Lff4wY6V8',
      description: 'Membangun aplikasi manajemen data lengkap (Create, Read, Update, Delete) berstandar keamanan tinggi.',
      publisher: 'Web Programming UNPAS',
      estimatedMinutes: 40
    },
    {
      id: 'rec-crud-2',
      topic: 'CRUD',
      type: 'artikel',
      title: 'Pola Arsitektur PRG (Post-Redirect-Get) untuk Menghindari Resubmit Form',
      url: 'https://en.wikipedia.org/wiki/Post/Redirect/Get',
      description: 'Mekanisme pencegahan duplikasi data saat pengguna me-refresh halaman setelah proses submit formulir.',
      publisher: 'Software Architecture Notes',
      readTime: '10 menit'
    },
    {
      id: 'rec-crud-3',
      topic: 'CRUD',
      type: 'website',
      title: 'OWASP Top 10 Web Application Security Risks: XSS & CSRF Prevention',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
      description: 'Langkah praktis menerapkan Anti-CSRF Token dan sanitasi htmlspecialchars() pada form CRUD.',
      publisher: 'OWASP Cheat Sheet',
      readTime: '20 menit'
    },
    {
      id: 'rec-crud-4',
      topic: 'CRUD',
      type: 'latihan',
      title: 'Perbaikan Celah Keamanan Modul CRUD yang Rentan',
      url: '#exercise',
      description: 'Audit dan perbaiki skrip edit data yang rentan terhadap SQLi dan XSS injection.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 25
    }
  ],
  'Error Handling': [
    {
      id: 'rec-err-1',
      topic: 'Error Handling',
      type: 'video',
      title: 'Modern Exception Handling & Error Reporting di PHP',
      url: 'https://www.youtube.com/watch?v=Qd4K5Q3R06E',
      embedVideoUrl: 'https://www.youtube.com/embed/Qd4K5Q3R06E',
      description: 'Memahami hierarki Throwable, custom exception class, blok try-catch-finally, dan logging aman.',
      publisher: 'Laracasts',
      estimatedMinutes: 28
    },
    {
      id: 'rec-err-2',
      topic: 'Error Handling',
      type: 'dokumentasi',
      title: 'PHP Manual: Exceptions and Error Handling',
      url: 'https://www.php.net/manual/en/language.exceptions.php',
      description: 'Dokumentasi detail interface Throwable, set_exception_handler(), dan error_log().',
      publisher: 'The PHP Group',
      readTime: '20 menit'
    },
    {
      id: 'rec-err-3',
      topic: 'Error Handling',
      type: 'jurnal',
      title: 'Strategi Logging dan Penanganan Kesalahan Berkelanjutan pada Microservices PHP',
      url: 'https://doi.org/10.1145/3341105.3373921',
      description: 'Penerapan standar PSR-3 Logger Interface untuk diagnostik kegagalan sistem otomatis.',
      publisher: 'ACM Digital Library',
      readTime: '22 menit'
    },
    {
      id: 'rec-err-4',
      topic: 'Error Handling',
      type: 'latihan',
      title: 'Pembuatan Custom Business Exception dan Global Handler',
      url: '#exercise',
      description: 'Tantangan membuat class InsufficientBalanceException dan validasi transaksi.',
      publisher: 'Lab Pemrograman',
      estimatedMinutes: 20
    }
  ]
};

export const LEARNING_DETAILS: Record<PHPTopic, LearningDetail> = {
  'Dasar PHP': {
    id: 'learn-dasar',
    topic: 'Dasar PHP',
    title: 'Dasar Pemrograman PHP & Standar Sintaksis Modern',
    overview: 'PHP (Hypertext Preprocessor) adalah bahasa skrip open-source sisi server (server-side) yang dirancang khusus untuk membangun aplikasi web dinamis. Memahami siklus request-response HTTP dan standar PSR-12 merupakan fondasi penting bagi setiap developer.',
    keyConcepts: [
      {
        heading: 'Tag PHP & Penulisan File Murni',
        description: 'Kode PHP diawali dengan tag <?php. Pada file yang hanya memuat script PHP murni (tanpa markup HTML), tag penutup ?> di akhir file SANGAT DIREKOMENDASIKAN untuk DITIADAKAN guna mencegah terkirimnya spasi/baris baru yang tidak disengaja (whitespace output buffer issue).',
        codeExample: `<?php\n// File: config.php murni tanpa tag penutup ?>\n$appName = "Sistem Adaptif PHP";\n$isProduction = false;\n// Jangan beri ?> di akhir file`
      },
      {
        heading: 'Perbedaan echo vs print',
        description: 'echo adalah konstruksi bahasa yang tidak mengembalikan nilai (void) dan dapat mencetak multi-argumen dipisahkan koma. Sementara print selalu mengembalikan nilai integer 1 sehingga dapat berpartisipasi dalam ekspresi matematika.',
        codeExample: `<?php\necho "Halo", " ", "Dunia"; // Valid\n$res = print("Selamat Belajar"); // $res bernilai 1`
      },
      {
        heading: 'Konfigurasi php.ini',
        description: 'File php.ini mengontrol memori maksimal (memory_limit), batas unggah file (upload_max_filesize, post_max_size), pelaporan error (error_reporting, display_errors), dan modul ekstensi (extension=pdo_mysql).'
      }
    ],
    commonPitfalls: [
      'Menuliskan tag pendek <? yang dapat menyebabkan fatal error jika short_open_tag dimatikan di server produksi.',
      'Menyisipkan karakter spasi atau baris kosong sebelum <?php sehingga memicu peringatan "Headers already sent".',
      'Menggunakan echo di dalam fungsi logika yang seharusnya mengembalikan nilai dengan return.'
    ],
    bestPractices: [
      'Patuhi standar PSR-12 (indentasi 4 spasi, baris baru setelah namespace, deklarasi tipe jelas).',
      'Hindari mencampuradukkan business logic dengan tampilan presentasi HTML.',
      'Gunakan file .env untuk konfigurasi rahasia daripada menyimpan hardcoded credential di file PHP.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Skrip Informasi Konfigurasi PHP',
        prompt: 'Tuliskan perintah PHP untuk mengetahui versi PHP yang berjalan dan batas memori yang dialokasikan di php.ini.',
        hint: 'Gunakan fungsi phpversion() dan ini_get("memory_limit").',
        solution: `<?php\necho "Versi PHP: " . phpversion() . "\\n";\necho "Batas Memori: " . ini_get("memory_limit");\n?>`
      }
    ]
  },
  'Variabel dan Tipe Data': {
    id: 'learn-var',
    topic: 'Variabel dan Tipe Data',
    title: 'Sistem Tipe Data, Type Juggling & Strict Types',
    overview: 'PHP adalah bahasa dynamically typed, namun sejak PHP 7 dan PHP 8 telah menyediakan sistem deklarasi tipe skalar (scalar type declarations) yang sangat kuat untuk menjamin integritas data.',
    keyConcepts: [
      {
        heading: 'Type Coercion vs Strict Typing',
        description: 'Secara default PHP mengkonversi tipe data otomatis. Namun dengan menambahkan declare(strict_types=1); di baris paling pertama file, PHP akan melempar TypeError jika parameter fungsi tidak sesuai dengan tipe yang dideklarasikan.',
        codeExample: `<?php\ndeclare(strict_types=1);\n\nfunction hitungDiskon(float $harga, int $persen): float {\n    return $harga * ($persen / 100);\n}\n\n// hitungDiskon("1000", "10"); // Akan melempar fatal TypeError!\necho hitungDiskon(1000.0, 10); // Output: 100`
      },
      {
        heading: 'Union Types & Nullable Types (PHP 8+)',
        description: 'Union types (tipe1|tipe2) memungkinkan parameter atau return type menerima lebih dari satu jenis tipe data. Untuk nullable, gunakan ?Tipe atau Tipe|null.',
        codeExample: `<?php\nfunction cariPengguna(int|string $identifier): ?array {\n    // Boleh menerima ID integer atau username string\n    return null; // Boleh return array atau null\n}`
      }
    ],
    commonPitfalls: [
      'Menganggap string "0" sebagai nilai truthy, padahal PHP mengevaluasinya sebagai falsy.',
      'Membandingkan variabel tanpa memeriksa keberadaannya terlebih dahulu dengan isset().'
    ],
    bestPractices: [
      'Gunakan declare(strict_types=1); di setiap file skrip modern.',
      'Gunakan konversi eksplisit seperti (int)$input atau (float)$input daripada mengandalkan type juggling otomatis.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Validasi Input Pengguna dengan Type Guard',
        prompt: 'Buat fungsi sanitizeScore(mixed $val): int yang mengonversi input string numerik atau float ke integer antara 0 - 100.',
        hint: 'Gunakan filter_var atau type casting (int) dan fungsi max/min.',
        solution: `<?php\nfunction sanitizeScore(mixed $val): int {\n    $num = (int)$val;\n    return max(0, min(100, $num));\n}`
      }
    ]
  },
  'Operator': {
    id: 'learn-op',
    topic: 'Operator',
    title: 'Operator Lanjutan, Null Coalescing & Evaluasi Logika',
    overview: 'Operator PHP modern menyediakan konstruksi ekspresif untuk menangani nilai null, membandingkan koleksi, dan menyusun ekspresi ringkas yang mudah dipelihara.',
    keyConcepts: [
      {
        heading: 'Null Coalescing (??) & Null Coalescing Assignment (??=)',
        description: 'Operator ?? mengecek keberadaan index/properti dan apakah nilainya bukan null. Operator ??= menyetel nilai hanya bila belum ada sebelumnya.',
        codeExample: `<?php\n$theme = $_GET['theme'] ?? 'default';\n$config['cache'] ??= true;`
      },
      {
        heading: 'Spaceship Operator (<=>)',
        description: 'Digunakan dalam fungsi pengurutan (usort). Mengembalikan -1 (kiri < kanan), 0 (sama), atau 1 (kiri > kanan).',
        codeExample: `<?php\nusort($mahasiswa, fn($a, $b) => $a['ipk'] <=> $b['ipk']);`
      },
      {
        heading: 'Nullsafe Operator (?->)',
        description: 'Mencegah error saat memanggil method pada objek yang mungkin bernilai null di PHP 8+.',
        codeExample: `<?php\n$kota = $order?->getCustomer()?->getAddress()?->city;`
      }
    ],
    commonPitfalls: [
      'Menggunakan operator longgar == yang menghasilkan perilaku mengejutkan dibanding ===.',
      'Tertukar antara operator elvis (?:) dan null coalescing (??). Elvis mengecek kebenaran truthy, sedangkan ?? hanya mengecek isset (bukan null).'
    ],
    bestPractices: [
      'Selalu gunakan === dan !== sebagai standar pengecekan nilai dan tipe data.',
      'Gunakan operator nullsafe untuk navigasi rantai objek yang opsional.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Urutkan Array Produk Berdasarkan Harga',
        prompt: 'Gunakan usort dan spaceship operator untuk mengurutkan array produk dari termurah ke termahal.',
        hint: 'Gunakan fn($a, $b) => $a[\'harga\'] <=> $b[\'harga\'].',
        solution: `<?php\n$produk = [\n    ['nama' => 'Buku', 'harga' => 50000],\n    ['nama' => 'Pena', 'harga' => 15000],\n    ['nama' => 'Tas', 'harga' => 120000]\n];\nusort($produk, fn($a, $b) => $a['harga'] <=> $b['harga']);`
      }
    ]
  },
  'Conditional': {
    id: 'learn-cond',
    topic: 'Conditional',
    title: 'Struktur Kondisional, Switch Case & Match Expression PHP 8',
    overview: 'Pemilihan alur kontrol logika yang tepat menghasilkan kode yang mudah diuji dan bebas dari jebakan percabangan berlapis (nested arrow anti-pattern).',
    keyConcepts: [
      {
        heading: 'Ekspresi Match vs Switch',
        description: 'Ekspresi match (PHP 8) menggunakan strict identity (===), mengembalikan nilai langsung, tidak memerlukan statement break, dan melempar UnhandledMatchError jika tidak ada case yang cocok dan tidak ada default.',
        codeExample: `<?php\n$pesan = match($status) {\n    'aktif' => 'Akun Aktif',\n    'pending', 'menunggu' => 'Menunggu Verifikasi',\n    'banned' => 'Akun Ditangguhkan',\n    default => 'Status Tidak Diketahui'\n};`
      },
      {
        heading: 'Guard Clauses (Early Return)',
        description: 'Pola pemrograman dengan memeriksa kondisi gagal terlebih dahulu dan langsung keluar dari fungsi, sehingga alur utama tetap berada pada tingkat indentasi terluar.',
        codeExample: `<?php\nfunction prosesPesanan($order) {\n    if (!$order->isValid()) return false;\n    if (!$order->hasStock()) return false;\n    // Alur utama proses pesanan tanpa nested if\n    return $order->pay();\n}`
      }
    ],
    commonPitfalls: [
      'Lupa menuliskan break pada switch statement sehingga terjadi fall-through yang merusak logika.',
      'Membandingkan kondisi dengan switch yang menggunakan perbandingan longgar (==).'
    ],
    bestPractices: [
      'Prioritaskan match expression untuk pemetaan nilai daripada switch.',
      'Terapkan Guard Clauses untuk menyederhanakan kode fungsi yang rumit.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Konversi Status HTTP ke Kategori Response',
        prompt: 'Buat fungsi kategorikanHttp(int $code): string menggunakan ekspresi match PHP 8.',
        hint: 'Gunakan match ($code) dengan pola range atau match(true).',
        solution: `<?php\nfunction kategorikanHttp(int $code): string {\n    return match (true) {\n        $code >= 200 && $code < 300 => 'Sukses',\n        $code >= 400 && $code < 500 => 'Client Error',\n        $code >= 500 => 'Server Error',\n        default => 'Lainnya'\n    };\n}`
      }
    ]
  },
  'Looping': {
    id: 'learn-loop',
    topic: 'Looping',
    title: 'Struktur Perulangan & Manajemen Memori dengan Generators',
    overview: 'Penggunaan perulangan yang efisien mencegah kebocoran memori (memory leak) dan mempercepat pemrosesan data berjumlah besar pada aplikasi server.',
    keyConcepts: [
      {
        heading: 'Foreach dengan Kunci & Referensi',
        description: 'Foreach adalah cara paling aman dan idiomatik mengiterasi array di PHP. Penggunaan referensi (&) memungkinkan modifikasi elemen secara in-place. Selalu panggil unset() setelah loop berreferensi!',
        codeExample: `<?php\n$daftar = [1, 2, 3];\nforeach ($daftar as &$nilai) {\n    $nilai *= 10;\n}\nunset($nilai); // Wajib di-unset agar tidak menimpa elemen terakhir nanti!`
      },
      {
        heading: 'Generators dan Kata Kunci Yield',
        description: 'Generator memungkinkan pembuatan fungsi iterator tanpa harus mengalokasikan memori untuk seluruh array sekaligus.',
        codeExample: `<?php\nfunction bacaFileBarisPerBaris(string $path) {\n    $handle = fopen($path, 'r');\n    while (($line = fgets($handle)) !== false) {\n        yield $line;\n    }\n    fclose($handle);\n}`
      }
    ],
    commonPitfalls: [
      'Lupa meng-unset variabel referensi setelah perulangan foreach (&), sehingga loop berikutnya tanpa sengaja merusak data elemen terakhir.',
      'Infinite loop pada struktur while akibat lupa menaikkan nilai variabel counter iterasi.'
    ],
    bestPractices: [
      'Gunakan generator (yield) ketika membaca file CSV/log besar atau ribuan baris dari database.',
      'Gunakan break dengan nilai level bila perlu keluar dari perulangan bersarang.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Generator Rentang Angka Genap',
        prompt: 'Tulis generator angkaGenap(int $max) yang menghasilkan angka genap dari 2 sampai $max menggunakan yield.',
        hint: 'Gunakan for ($i = 2; $i <= $max; $i += 2) yield $i;.',
        solution: `<?php\nfunction angkaGenap(int $max) {\n    for ($i = 2; $i <= $max; $i += 2) {\n        yield $i;\n    }\n}`
      }
    ]
  },
  'Array': {
    id: 'learn-arr',
    topic: 'Array',
    title: 'Manipulasi Array Lanjutan & Pemrograman Fungsional',
    overview: 'Array di PHP adalah ordered map yang sangat fleksibel karena dapat difungsikan sebagai list, dictionary, stack, queue, ataupun matriks multidimensi.',
    keyConcepts: [
      {
        heading: 'Fungsi Fungsional: map, filter, reduce',
        description: 'array_map() mentransformasi nilai, array_filter() menyaring elemen berdasarkan predikat boolean, dan array_reduce() mengakumulasi array menjadi satu nilai tunggal.',
        codeExample: `<?php\n$angka = [1, 2, 3, 4, 5];\n$genap = array_filter($angka, fn($n) => $n % 2 === 0);\n$kuadrat = array_map(fn($n) => $n * $n, $genap);\n$total = array_reduce($kuadrat, fn($acc, $n) => $acc + $n, 0); // Output: 20`
      },
      {
        heading: 'Array Union (+) vs array_merge()',
        description: 'Operator + mempertahankan nilai dari array sebelah kiri bila ada kunci yang sama. Sedangkan array_merge() akan menimpa kunci bertipe string dan me-reindex kembali kunci bertipe angka numerik.',
        codeExample: `<?php\n$a = ['id' => 1, 'nama' => 'A'];\n$b = ['id' => 2, 'kota' => 'Bdg'];\n$gabungUnion = $a + $b; // 'id' tetap 1\n$gabungMerge = array_merge($a, $b); // 'id' menjadi 2`
      }
    ],
    commonPitfalls: [
      'Menggunakan in_array() tanpa parameter strict ke-3 ($strict = true), yang dapat memicu celah verifikasi type coercion.',
      'Menggunakan array_merge() di dalam perulangan besar yang menyebabkan kompleksitas kuadratik O(N^2).'
    ],
    bestPractices: [
      'Gunakan array_key_exists() bila ingin memeriksa kunci yang nilainya mungkin bernilai NULL.',
      'Gunakan array_column() untuk mengekstrak kolom data dari koleksi database tanpa perlu looping manual.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Ekstraksi Email Pengguna Aktif',
        prompt: 'Dari array multidimensi pengguna, ambil daftar email hanya untuk pengguna yang memiliki status == "active".',
        hint: 'Kombinasikan array_filter dan array_column.',
        solution: `<?php\n$users = [\n    ['name' => 'Ali', 'email' => 'ali@mail.com', 'status' => 'active'],\n    ['name' => 'Budi', 'email' => 'budi@mail.com', 'status' => 'inactive'],\n    ['name' => 'Citra', 'email' => 'citra@mail.com', 'status' => 'active']\n];\n$activeUsers = array_filter($users, fn($u) => $u['status'] === 'active');\n$emails = array_column($activeUsers, 'email');`
      }
    ]
  },
  'Function': {
    id: 'learn-func',
    topic: 'Function',
    title: 'Fungsi Tingkat Lanjut, Closures, Arrow Functions & Named Args',
    overview: 'Fungsi di PHP mendukung First-Class Callable Syntax, Anonymous Functions (Closures), Arrow Functions ringkas, dan Named Arguments untuk arsitektur aplikasi yang bersih.',
    keyConcepts: [
      {
        heading: 'Closures & Kata Kunci use',
        description: 'Anonymous function di PHP memerlukan keyword use() secara eksplisit untuk mengikat variabel dari scope luar ke dalam body fungsinya.',
        codeExample: `<?php\n$pajak = 0.11;\n$hitungTotal = function(float $harga) use ($pajak): float {\n    return $harga + ($harga * $pajak);\n};`
      },
      {
        heading: 'Arrow Functions (fn() => ...)',
        description: 'Diperkenalkan di PHP 7.4. Variabel dari scope luar ditangkap otomatis secara by-value tanpa butuh keyword use, dan hanya terdiri dari satu baris ekspresi return.',
        codeExample: `<?php\n$pengali = 5;\n$fungsi = fn(int $x) => $x * $pengali;`
      },
      {
        heading: 'Named Arguments (PHP 8+)',
        description: 'Memanggil fungsi dengan menyebutkan nama parameter, memungkinkan melewati parameter opsional di tengah.',
        codeExample: `<?php\nsetcookie(name: 'session_id', value: 'xyz123', secure: true, httponly: true);`
      }
    ],
    commonPitfalls: [
      'Mengharapkan arrow function dapat mengubah variabel luar (karena variabel ditangkap by-value, bukan by-reference).',
      'Mengabaikan return type declarations sehingga tipe balikan tidak terprediksi.'
    ],
    bestPractices: [
      'Beri tipe data ketat pada parameter dan return type semua fungsi.',
      'Gunakan variadic operator (...) untuk fungsi yang menerima argumen dinamis.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Fungsi Pemformat Uang Rupiah',
        prompt: 'Buat fungsi formatRupiah(int $nominal, string $prefix = "Rp "): string.',
        hint: 'Gunakan number_format dengan pemisah ribuan titik.',
        solution: `<?php\nfunction formatRupiah(int $nominal, string $prefix = "Rp "): string {\n    return $prefix . number_format($nominal, 0, ',', '.');\n}`
      }
    ]
  },
  'String': {
    id: 'learn-str',
    topic: 'String',
    title: 'Manipulasi Teks, String Helpers PHP 8 & Keamanan XSS',
    overview: 'PHP menyediakan beragam fungsi pemrosesan teks. Di PHP 8+, hadir fungsi string helper bawaan yang intuitif dan ekspresif.',
    keyConcepts: [
      {
        heading: 'Fungsi String Modern PHP 8',
        description: 'str_contains(), str_starts_with(), dan str_ends_with() mengembalikan boolean langsung tanpa perlu mengecek indeks strpos !== false.',
        codeExample: `<?php\n$email = "mahasiswa@kampus.ac.id";\nif (str_ends_with($email, ".ac.id")) {\n    echo "Email Institusi Terverifikasi";\n}`
      },
      {
        heading: 'Sanitasi Output dengan htmlspecialchars()',
        description: 'Mencegah eksekusi script jahat (XSS) dengan mengonversi karakter <, >, &, dan tanda petik menjadi entitas HTML.',
        codeExample: `<?php\n$inputPengguna = "<script>alert('hack')</script>";\necho htmlspecialchars($inputPengguna, ENT_QUOTES, 'UTF-8');`
      }
    ],
    commonPitfalls: [
      'Menggunakan strpos($str, "kata") tanpa operator identitas ketat !== false (sebab jika kata berada di indeks 0, PHP mengevaluasinya sebagai falsy).',
      'Menggunakan fungsi mb_* yang salah saat menangani teks multibyte UTF-8.'
    ],
    bestPractices: [
      'Gunakan str_contains() daripada strpos() untuk pengecekan keberadaan substring.',
      'Selalu lindungi output dinamis ke HTML dengan htmlspecialchars().'
    ],
    exercises: [
      {
        title: 'Latihan 1: Validasi Domain Email Institusi',
        prompt: 'Tulis fungsi isEduEmail(string $email): bool yang mengecek apakah email berakhiran ".edu" atau ".ac.id".',
        hint: 'Gunakan str_ends_with.',
        solution: `<?php\nfunction isEduEmail(string $email): bool {\n    return str_ends_with($email, '.edu') || str_ends_with($email, '.ac.id');\n}`
      }
    ]
  },
  'Object Oriented Programming / OOP': {
    id: 'learn-oop',
    topic: 'Object Oriented Programming / OOP',
    title: 'Pemrograman Berorientasi Objek (OOP) & PHP Modern',
    overview: 'OOP memfasilitasi modularitas, penggunaan kembali kode, dan rancangan perangkat lunak skala besar melalui konsep encapsulation, inheritance, polymorphism, dan abstraction.',
    keyConcepts: [
      {
        heading: 'Constructor Property Promotion & Readonly',
        description: 'Fitur PHP 8 untuk mempersingkat penulisan deklarasi properti class langsung pada parameter constructor. Ditambah modifier readonly untuk menjamin data immutable.',
        codeExample: `<?php\nclass Mahasiswa {\n    public function __construct(\n        public readonly string $nim,\n        public string $nama,\n        protected float $ipk\n    ) {}\n}`
      },
      {
        heading: 'Interface vs Abstract Class',
        description: 'Interface mendefinisikan kontrak method tanpa implementasi (dapat diimplementasikan banyak sekaligus). Abstract class dapat memuat properti serta method konkret bersama method abstract.',
        codeExample: `<?php\ninterface Notifier {\n    public function send(string $msg): bool;\n}\n\nabstract class BaseService {\n    protected function log(string $msg) { /* logic */ }\n}`
      },
      {
        heading: 'Prinsip Encapsulation & Polymorphism',
        description: 'Menyembunyikan atribut internal di balik protected/private dan mengekspos public API. Polymorphism memungkinkan objek berbeda diperlakukan secara seragam melalui antarmuka yang sama.'
      }
    ],
    commonPitfalls: [
      'Membuat semua atribut bertipe public sehingga melanggar prinsip enkapsulasi data.',
      'Menggunakan inheritance secara berlebihan (deep inheritance tree) daripada memprioritaskan komposisi objek (composition over inheritance).'
    ],
    bestPractices: [
      'Terapkan prinsip SOLID dalam perancangan class.',
      'Gunakan type-hinting interface pada dependensi agar mudah di-mock dalam unit test.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Rancang Class Repository dengan Interface',
        prompt: 'Buat UserRepositoryInterface dengan method findById(int $id): ?array dan implementasikan class MySQLUserRepository.',
        hint: 'Gunakan interface dan class implements.',
        solution: `<?php\ninterface UserRepositoryInterface {\n    public function findById(int $id): ?array;\n}\n\nclass MySQLUserRepository implements UserRepositoryInterface {\n    public function findById(int $id): ?array {\n        // Simulasi query DB\n        return ['id' => $id, 'nama' => 'User ' . $id];\n    }\n}`
      }
    ]
  },
  'Database / MySQL': {
    id: 'learn-db',
    topic: 'Database / MySQL',
    title: 'Integrasi PDO, Prepared Statements & Transaksi Database',
    overview: 'PDO (PHP Data Objects) adalah lapisan abstraksi akses data standar industri di PHP yang aman, fleksibel, dan mendukung prepared statements untuk pencegahan mutlak SQL Injection.',
    keyConcepts: [
      {
        heading: 'Koneksi PDO Aman dengan Exception Mode',
        description: 'Selalu aktifkan PDO::ERRMODE_EXCEPTION dan matikan emulated prepared statements untuk keamanan dan performa maksimal.',
        codeExample: `<?php\n$dsn = "mysql:host=localhost;dbname=elearning;charset=utf8mb4";\n$options = [\n    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n    PDO::ATTR_EMULATE_PREPARES   => false,\n];\n$pdo = new PDO($dsn, "dbuser", "secretpass", $options);`
      },
      {
        heading: 'Prepared Statements dengan Parameter Binding',
        description: 'Parameter query dipisahkan secara terisolasi dari perintah SQL sehingga input penyerang tidak dapat mengubah struktur query.',
        codeExample: `<?php\n$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");\n$stmt->execute([':email' => $userEmail]);\n$user = $stmt->fetch();`
      },
      {
        heading: 'Database Transactions (ACID)',
        description: 'Menjalankan serangkaian query sebagai satu kesatuan atomik. Jika salah satu query gagal, panggil rollBack() agar database tidak berada dalam status rusak.',
        codeExample: `<?php\ntry {\n    $pdo->beginTransaction();\n    $pdo->prepare("UPDATE rekening SET saldo = saldo - 500 WHERE id = 1")->execute();\n    $pdo->prepare("UPDATE rekening SET saldo = saldo + 500 WHERE id = 2")->execute();\n    $pdo->commit();\n} catch (Exception $e) {\n    $pdo->rollBack();\n    throw $e;\n}`
      }
    ],
    commonPitfalls: [
      'Menyambung string variabel langsung ke dalam query ($pdo->query("SELECT * FROM users WHERE id = " . $_GET["id"])).',
      'Tidak menangkap PDOException saat inisialisasi koneksi sehingga kredensial basis data dapat bocor ke layar error.'
    ],
    bestPractices: [
      'Selalu gunakan prepared statement untuk setiap query yang melibatkan data dari luar.',
      'Gunakan UTF8MB4 sebagai charset koneksi untuk mendukung emoji dan karakter internasional.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Query Insert Data Siswa dengan PDO',
        prompt: 'Tulis fungsi insertMahasiswa(PDO $pdo, string $nim, string $nama): bool menggunakan prepared statement.',
        hint: 'Gunakan $pdo->prepare() dan $stmt->execute().',
        solution: `<?php\nfunction insertMahasiswa(PDO $pdo, string $nim, string $nama): bool {\n    $sql = "INSERT INTO mahasiswa (nim, nama) VALUES (:nim, :nama)";\n    $stmt = $pdo->prepare($sql);\n    return $stmt->execute([':nim' => $nim, ':nama' => $nama]);\n}`
      }
    ]
  },
  'CRUD': {
    id: 'learn-crud',
    topic: 'CRUD',
    title: 'Pengembangan Modul CRUD Aman & Pola Post-Redirect-Get',
    overview: 'CRUD (Create, Read, Update, Delete) adalah fungsionalitas inti sebagian besar sistem informasi. Penerapan pola PRG, sanitasi form, dan proteksi CSRF sangat penting dalam produksi.',
    keyConcepts: [
      {
        heading: 'Pola Post-Redirect-Get (PRG)',
        description: 'Setelah formulir POST berhasil memproses manipulasi data (Create/Update/Delete), server segera mengirimkan header HTTP 302/303 redirect. Hal ini mencegah pengiriman ganda (duplicate submission) saat tombol refresh ditekan pengguna.',
        codeExample: `<?php\n// proses_tambah.php\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n    // Simpan ke DB...\n    header("Location: index.php?msg=sukses");\n    exit;\n}`
      },
      {
        heading: 'Proteksi Token CSRF',
        description: 'Mencegah penipuan request lintas situs dengan menyertakan token acak unik di session pengguna dan memverifikasinya pada setiap formulir POST.',
        codeExample: `<?php\n// Pada form view:\n$_SESSION['csrf_token'] = bin2hex(random_bytes(32));\n// Pada proses handler:\nif (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {\n    die("CSRF Token Tidak Valid!");\n}`
      },
      {
        heading: 'Penyimpanan Password Aman',
        description: 'Wajib menggunakan password_hash($password, PASSWORD_BCRYPT) saat membuat user dan password_verify($password, $hash) saat autentikasi login.'
      }
    ],
    commonPitfalls: [
      'Menyediakan link penghapusan data via method HTTP GET (seperti hapus.php?id=12).',
      'Menyimpan kata sandi mentah atau menggunakan enkripsi MD5.'
    ],
    bestPractices: [
      'Gunakan method POST/DELETE untuk seluruh operasi mutasi data.',
      'Sertakan validasi di sisi server (server-side validation) selain validasi HTML5/JavaScript di browser.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Validasi dan Simpan Akun Baru',
        prompt: 'Tulis skrip validasi email dan pembuatan hash password sebelum disimpan ke database.',
        hint: 'Gunakan filter_var($email, FILTER_VALIDATE_EMAIL) dan password_hash().',
        solution: `<?php\nif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {\n    die("Format email tidak valid");\n}\n$hashedPassword = password_hash($password, PASSWORD_DEFAULT);\n// Simpan $email dan $hashedPassword ke DB`
      }
    ]
  },
  'Error Handling': {
    id: 'learn-err',
    topic: 'Error Handling',
    title: 'Penanganan Kesalahan, Hierarki Throwable & Log Server',
    overview: 'Penanganan kesalahan yang tangguh mencegah aplikasi mati tiba-tiba (crash) saat terjadi kegagalan sistem serta melindungi data sensitif arsitektur dari paparan pihak luar.',
    keyConcepts: [
      {
        heading: 'Hierarki Throwable di PHP 7+',
        description: 'Interface Throwable adalah induk dari Exception dan Error (termasuk TypeError, ParseError, ArithmeticError). Menangkap Throwable memungkinkan penanganan seluruh error fatal.',
        codeExample: `<?php\ntry {\n    // Operasi yang berpotensi gagal\n    $hasil = 10 / 0;\n} catch (DivisionByZeroError $e) {\n    echo "Tidak bisa membagi dengan angka nol: " . $e->getMessage();\n} catch (Throwable $e) {\n    error_log($e->getMessage());\n    echo "Terjadi kesalahan internal sistem.";\n} finally {\n    // Selalu dieksekusi\n}`
      },
      {
        heading: 'Pengaturan Produksi: display_errors vs log_errors',
        description: 'Pada lingkungan production, jangan pernah menampilkan error ke layar pengguna (display_errors = Off). Aktifkan logging ke file server (log_errors = On) untuk diaudit tim developer.',
        codeExample: `<?php\nini_set('display_errors', '0');\nini_set('log_errors', '1');\nerror_reporting(E_ALL);`
      }
    ],
    commonPitfalls: [
      'Menangkap exception kosong (empty catch block) tanpa mencatat ke log atau menindaklanjuti kegagalan.',
      'Membiarkan error SQL PDO terpapar langsung ke layar publik.'
    ],
    bestPractices: [
      'Gunakan custom Exception class yang merepresentasikan domain bisnis (misal: InsufficientBalanceException).',
      'Pasang set_exception_handler() global untuk menangani unhandled exceptions secara terpusat.'
    ],
    exercises: [
      {
        title: 'Latihan 1: Custom Exception untuk Validasi Usia',
        prompt: 'Buat class InvalidAgeException extends Exception dan fungsi periksaUsia(int $umur) yang melempar exception jika $umur < 18.',
        hint: 'Gunakan throw new InvalidAgeException(...).',
        solution: `<?php\nclass InvalidAgeException extends Exception {}\n\nfunction periksaUsia(int $umur): void {\n    if ($umur < 18) {\n        throw new InvalidAgeException("Usia minimal harus 18 tahun.");\n    }\n}`
      }
    ]
  }
};
