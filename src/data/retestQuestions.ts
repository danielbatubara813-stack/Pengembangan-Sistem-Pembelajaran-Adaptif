import { Question } from '../types';

export const RETEST_QUESTIONS: Question[] = [
  // --- 1. Dasar PHP (Soal 1 - 4) ---
  {
    id: 101,
    question: "Manakah cara menyisipkan kode PHP ke dalam dokumen HTML yang benar menggunakan tag short echo bawaan?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "<?= $nama; ?>" },
      { key: "B", text: "<% $nama %>" },
      { key: "C", text: "{? $nama ?}" },
      { key: "D", text: "<!php echo $nama !>" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Tag <?= $nama; ?> adalah kependekan resmi dari <?php echo $nama; ?> dan selalu aktif secara default di PHP 5.4+ tanpa terpengaruh setting short_open_tag."
  },
  {
    id: 102,
    question: "Apa output dari script PHP yang menggunakan fungsi var_export() berikut?",
    codeSnippet: `<?php\n$active = false;\nvar_export($active);\n?>`,
    options: [
      { key: "A", text: "0" },
      { key: "B", text: "false" },
      { key: "C", text: "bool(false)" },
      { key: "D", text: "null" }
    ],
    correct_answer: "B",
    category: "Dasar PHP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "var_export() menghasilkan representasi kode PHP yang valid dari suatu variabel. Untuk boolean false, ia mencetak string 'false'."
  },
  {
    id: 103,
    question: "Perintah apakah yang dapat digunakan untuk langsung menghentikan eksekusi script PHP saat itu juga sambil menampilkan pesan tertentu?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "stop()" },
      { key: "B", text: "terminate()" },
      { key: "C", text: "die() atau exit()" },
      { key: "D", text: "break_all()" }
    ],
    correct_answer: "C",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Fungsi die() atau exit() langsung menghentikan proses eksekusi script PHP dan opsional menampilkan argumen pesan yang dioperkan."
  },
  {
    id: 104,
    question: "Apakah file konfigurasi utama yang mengatur seluruh konfigurasi runtime dan ekstensi modul pada server PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "php.json" },
      { key: "B", text: "php.ini" },
      { key: "C", text: "config.php" },
      { key: "D", text: ".env.php" }
    ],
    correct_answer: "B",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "File php.ini adalah file konfigurasi sentral yang dibaca setiap kali runtime PHP diinisialisasi pada server."
  },

  // --- 2. Variabel dan Tipe Data (Soal 5 - 8) ---
  {
    id: 105,
    question: "Apa output dari potongan kode type casting berikut?",
    codeSnippet: `<?php\n$str = "42 Mahasiswa Berprestasi";\n$num = (int)$str;\necho $num;\n?>`,
    options: [
      { key: "A", text: "0" },
      { key: "B", text: "42" },
      { key: "C", text: "Fatal Error: Invalid Cast" },
      { key: "D", text: "420" }
    ],
    correct_answer: "B",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Type casting string ke integer pada PHP mengekstrak angka di awal string hingga bertemu karakter non-numerik pertama, sehingga menghasilkan 42."
  },
  {
    id: 106,
    question: "Bagaimana cara memeriksa apakah sebuah variabel telah dideklarasikan dan bernilai BUKAN NULL di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "is_null($var)" },
      { key: "B", text: "isset($var)" },
      { key: "C", text: "empty($var)" },
      { key: "D", text: "defined($var)" }
    ],
    correct_answer: "B",
    category: "Variabel dan Tipe Data",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "isset() mengembalikan true jika variabel sudah diset dan nilainya tidak sama dengan NULL."
  },
  {
    id: 107,
    question: "Tipe data gabungan (Union Types) diperkenalkan secara resmi di PHP 8.0. Manakah deklarasi union type yang valid?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "function hitung(int|float $angka): int|float" },
      { key: "B", text: "function hitung(int OR float $angka)" },
      { key: "C", text: "function hitung(union<int, float> $angka)" },
      { key: "D", text: "function hitung([int, float] $angka)" }
    ],
    correct_answer: "A",
    category: "Variabel dan Tipe Data",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Union types di PHP 8 menggunakan karakter pipa (|) untuk memisahkan tipe data yang diperbolehkan."
  },
  {
    id: 108,
    question: "Apakah hasil yang dikembalikan oleh fungsi empty() terhadap string \"0\"?",
    codeSnippet: `<?php\n$str = "0";\nvar_dump(empty($str));\n?>`,
    options: [
      { key: "A", text: "bool(false)" },
      { key: "B", text: "bool(true)" },
      { key: "C", text: "int(0)" },
      { key: "D", text: "null" }
    ],
    correct_answer: "B",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Di PHP, string '0' dianggap sebagai nilai kosong (empty) oleh fungsi empty() dan mengembalikan bool(true)."
  },

  // --- 3. Operator (Soal 9 - 12) ---
  {
    id: 109,
    question: "Perhatikan penggunaan Nullsafe Operator (?->) yang diperkenalkan di PHP 8.0 berikut:",
    codeSnippet: `<?php\n$country = $session?->user?->getAddress()?->country;\n?>`,
    options: [
      { key: "A", text: "Jika salah satu properti/method bernilai null, script melempar fatal exception" },
      { key: "B", text: "Jika salah satu elemen rantai bernilai null, seluruh ekspresi langsung mengembalikan null tanpa error" },
      { key: "C", text: "Hanya bekerja jika database mengaktifkan mode strict" },
      { key: "D", text: "Merupakan operator logika ternary yang salah penulisan" }
    ],
    correct_answer: "B",
    category: "Operator",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Nullsafe operator (?->) menghentikan rantai pemanggilan dan mengembalikan null seketika jika objek di sebelah kirinya bernilai null, mencegah Null Pointer Exception."
  },
  {
    id: 110,
    question: "Apa output dari operasi operator logika XOR berikut?",
    codeSnippet: `<?php\n$p = true;\n$q = true;\nvar_dump($p xor $q);\n?>`,
    options: [
      { key: "A", text: "bool(true)" },
      { key: "B", text: "bool(false)" },
      { key: "C", text: "int(1)" },
      { key: "D", text: "NULL" }
    ],
    correct_answer: "B",
    category: "Operator",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator xor (exclusive OR) bernilai true hanya jika SALAH SATU bernilai true, namun BUKAN KEDUANYA. Karena keduanya true, hasilnya false."
  },
  {
    id: 111,
    question: "Apa hasil dari operator penugasan Null Coalescing Assignment (??=) berikut?",
    codeSnippet: `<?php\n$setting = ['theme' => 'dark'];\n$setting['theme'] ??= 'light';\n$setting['fontSize'] ??= 14;\necho $setting['theme'] . "-" . $setting['fontSize'];\n?>`,
    options: [
      { key: "A", text: "light-14" },
      { key: "B", text: "dark-14" },
      { key: "C", text: "dark-null" },
      { key: "D", text: "Notice undefined key" }
    ],
    correct_answer: "B",
    category: "Operator",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator ??= hanya memberikan nilai jika variabel sebelah kiri belum diset atau bernilai null. Karena 'theme' sudah ada ('dark'), nilainya tetap 'dark'. 'fontSize' baru diset 14."
  },
  {
    id: 112,
    question: "Mengapa perbandingan berikut bernilai true di PHP versi lama sebelum PHP 8, namun bernilai false di PHP 8+?",
    codeSnippet: `<?php\nvar_dump(0 == "admin");\n?>`,
    options: [
      { key: "A", text: "Di PHP 8, perbandingan angka 0 dengan string non-numerik mengkonversi angka ke string (\"0\" == \"admin\"), bukan sebaliknya" },
      { key: "B", text: "String 'admin' tidak lagi diizinkan di PHP" },
      { key: "C", text: "Operator == sudah tidak berlaku di PHP 8" },
      { key: "D", text: "Karena PHP 8 memaksa semua string menjadi array" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Di PHP 8, logika perbandingan non-strict diubah: saat membandingkan angka dengan string non-numerik, angka diubah menjadi string sehingga '0' == 'admin' adalah false."
  },

  // --- 4. Conditional (Soal 13 - 16) ---
  {
    id: 113,
    question: "Perhatikan ekspresi match PHP 8 berikut. Apa nilai variabel $message?",
    codeSnippet: `<?php\n$statusCode = 404;\n$message = match ($statusCode) {\n    200, 201 => 'Sukses',\n    400, 404 => 'Klien Error',\n    500 => 'Server Error',\n    default => 'Status Tidak Dikenal'\n};\necho $message;\n?>`,
    options: [
      { key: "A", text: "Sukses" },
      { key: "B", text: "Klien Error" },
      { key: "C", text: "Status Tidak Dikenal" },
      { key: "D", text: "Syntax Error" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Ekspresi match mencocokkan nilai 404 pada branch '400, 404' dan mengembalikan string 'Klien Error'."
  },
  {
    id: 114,
    question: "Apa output dari pengecekan kondisi dengan operator elvis (?:) berikut?",
    codeSnippet: `<?php\n$input = 0;\n$hasil = $input ?: 100;\necho $hasil;\n?>`,
    options: [
      { key: "A", text: "0" },
      { key: "B", text: "100" },
      { key: "C", text: "null" },
      { key: "D", text: "false" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator elvis (expr1 ?: expr2) mengembalikan expr1 jika truthy, atau expr2 jika expr1 bernilai falsy. Karena integer 0 adalah falsy, ekspresi mengembalikan 100."
  },
  {
    id: 115,
    question: "Kapan sintaks blok alternatif kontrol 'endif;' biasa digunakan?",
    codeSnippet: `<?php if ($isLoggedIn): ?>\n    <p>Selamat Datang!</p>\n<?php endif; ?>`,
    options: [
      { key: "A", text: "Hanya saat menggunakan framework Laravel" },
      { key: "B", text: "Saat menyisipkan struktur kondisi PHP di dalam template HTML untuk meningkatkan keterbacaan" },
      { key: "C", text: "Ketika if memiliki lebih dari 10 kondisi" },
      { key: "D", text: "Sintaks tersebut tidak valid di PHP" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Sintaks alternatif (if: ... endif;) sangat populer dan dianjurkan ketika memadukan kode logika PHP dengan markup HTML agar lebih mudah dibaca daripada kurung kurawal."
  },
  {
    id: 116,
    question: "Apa nilai dari $grade setelah script berikut dieksekusi?",
    codeSnippet: `<?php\n$score = 65;\nif ($score >= 80) {\n    $grade = 'A';\n} elseif ($score >= 60) {\n    $grade = 'B';\n} else {\n    $grade = 'C';\n}\necho $grade;\n?>`,
    options: [
      { key: "A", text: "A" },
      { key: "B", text: "B" },
      { key: "C", text: "C" },
      { key: "D", text: "null" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Kondisi pertama (65 >= 80) false, sedangkan kondisi elseif (65 >= 60) true, sehingga $grade diisi 'B'."
  },

  // --- 5. Looping (Soal 17 - 20) ---
  {
    id: 117,
    question: "Perhatikan nested loop berikut. Berapa total baris teks yang akan dicetak?",
    codeSnippet: `<?php\nfor ($i = 0; $i < 3; $i++) {\n    for ($j = 0; $j < 2; $j++) {\n        echo "*";\n    }\n}\n?>`,
    options: [
      { key: "A", text: "5" },
      { key: "B", text: "6" },
      { key: "C", text: "9" },
      { key: "D", text: "3" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Loop luar berjalan 3 kali, dan untuk setiap iterasinya, loop dalam berjalan 2 kali. Maka total pencetakan adalah 3 * 2 = 6 kali."
  },
  {
    id: 118,
    question: "Apa output dari script perulangan while berikut?",
    codeSnippet: `<?php\n$n = 1;\nwhile ($n < 10) {\n    $n *= 2;\n}\necho $n;\n?>`,
    options: [
      { key: "A", text: "8" },
      { key: "B", text: "16" },
      { key: "C", text: "10" },
      { key: "D", text: "32" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Iterasi: $n = 1 -> 2 -> 4 -> 8. Ketika 8 < 10 (true), $n dikali 2 menjadi 16. Lalu 16 < 10 (false), loop berhenti dan $n bernilai 16."
  },
  {
    id: 119,
    question: "Fungsi generator PHP dengan kata kunci 'yield' berguna untuk apa?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menghasilkan perulangan tanpa harus memuat seluruh kumpulan data besar ke dalam memori sekaligus" },
      { key: "B", text: "Menghitung kecepatan CPU server" },
      { key: "C", text: "Menggantikan seluruh fungsi recursive" },
      { key: "D", text: "Mengirimkan data ke database secara otomatis" }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Fungsi generator menggunakan 'yield' untuk mengalirkan data satu per satu saat di-loop, sangat hemat memori (RAM) untuk menangani dataset berukuran besar."
  },
  {
    id: 120,
    question: "Apa output dari perulangan foreach array asosiatif berikut?",
    codeSnippet: `<?php\n$mhs = ['nama' => 'Budi', 'umur' => 20];\nforeach ($mhs as $key => $val) {\n    echo "$key:$val ";\n}\n?>`,
    options: [
      { key: "A", text: "nama:Budi umur:20 " },
      { key: "B", text: "0:Budi 1:20 " },
      { key: "C", text: "Budi 20 " },
      { key: "D", text: "nama umur " }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Sintaks foreach ($array as $key => $val) mengekstrak kunci asosiatif ('nama', 'umur') dan nilainya masing-masing."
  },

  // --- 6. Array (Soal 21 - 25) ---
  {
    id: 121,
    question: "Fungsi manakah yang menyortir elemen array asosiatif berdasarkan NILAI (value) secara ascending sambil MEMPERTAHANKAN asosiasi kunci (key)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "sort()" },
      { key: "B", text: "asort()" },
      { key: "C", text: "ksort()" },
      { key: "D", text: "rsort()" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "asort() mengurutkan array berdasarkan nilai secara menaik (ascending) dan tetap mempertahankan relasi key-value."
  },
  {
    id: 122,
    question: "Perhatikan penggunaan array_reduce() berikut. Apa keluaran dari kode ini?",
    codeSnippet: `<?php\n$prices = [10, 20, 30];\n$total = array_reduce($prices, fn($carry, $item) => $carry + $item, 5);\necho $total;\n?>`,
    options: [
      { key: "A", text: "60" },
      { key: "B", text: "65" },
      { key: "C", text: "55" },
      { key: "D", text: "30" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "array_reduce mereduksi array ke satu nilai. Nilai awal $carry diset 5, lalu ditambah 10 + 20 + 30 = 65."
  },
  {
    id: 123,
    question: "Bagaimanakah cara menambahkan satu atau lebih elemen baru ke BAGIAN AKHIR sebuah array di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "array_unshift()" },
      { key: "B", text: "array_push() atau $arr[] = $val;" },
      { key: "C", text: "array_shift()" },
      { key: "D", text: "array_pop()" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "array_push() atau notasi kurung siku $arr[] = $val menambahkan item ke indeks paling belakang array."
  },
  {
    id: 124,
    question: "Perhatikan penggunaan fungsi array_column() berikut. Apa outputnya?",
    codeSnippet: `<?php\n$users = [\n    ['id' => 1, 'username' => 'alex'],\n    ['id' => 2, 'username' => 'siti']\n];\n$names = array_column($users, 'username');\necho implode(', ', $names);\n?>`,
    options: [
      { key: "A", text: "alex, siti" },
      { key: "B", text: "1, 2" },
      { key: "C", text: "username, username" },
      { key: "D", text: "Array" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "array_column() mengambil seluruh nilai dari satu kolom spesifik ('username') pada multidimensional array dan mengembalikannya sebagai array satu dimensi."
  },
  {
    id: 125,
    question: "Apakah fungsi bawaan untuk memeriksa keberadaan suatu NILAI di dalam array?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "in_array()" },
      { key: "B", text: "array_key_exists()" },
      { key: "C", text: "isset()" },
      { key: "D", text: "array_has()" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "in_array($needle, $haystack) mencari apakah nilai $needle ada di dalam array $haystack."
  },

  // --- 7. Function (Soal 26 - 29) ---
  {
    id: 126,
    question: "Bagaimanakah sintaks penulisan Arrow Functions (fn) yang diperkenalkan di PHP 7.4?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "fn($x) => $x * 2" },
      { key: "B", text: "($x) -> $x * 2" },
      { key: "C", text: "def($x) => return $x * 2" },
      { key: "D", text: "arrow($x) { $x * 2 }" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Arrow functions di PHP menggunakan keyword 'fn', parameter di dalam kurung, operator '=>', dan langsung mengembalikan satu ekspresi (implicit return) dengan binding variabel otomatis dari scope luar."
  },
  {
    id: 127,
    question: "Perhatikan Named Arguments (argumen bernama) pada PHP 8 berikut:",
    codeSnippet: `<?php\nfunction profile(string $name, int $age, string $role = 'User') {\n    return "$name ($role)";\n}\necho profile(role: 'Admin', name: 'Rina', age: 22);\n?>`,
    options: [
      { key: "A", text: "Rina (Admin)" },
      { key: "B", text: "Fatal Error: Parameter urutan salah" },
      { key: "C", text: "Admin (Rina)" },
      { key: "D", text: "Notice undefined argument" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Fitur Named Arguments pada PHP 8 memungkinkan pengiriman argumen ke fungsi berdasarkan nama parameter, sehingga urutannya bebas dan nilai default parameter yang tidak disebutkan tetap berlaku."
  },
  {
    id: 128,
    question: "Bagaimana cara mendeklarasikan parameter fungsi agar dapat dimodifikasi nilainya langsung ke variabel aslinya (pass-by-reference)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menambahkan tanda & sebelum nama parameter (contoh: function edit(&$var))" },
      { key: "B", text: "Menambahkan tanda * sebelum nama parameter" },
      { key: "C", text: "Menuliskan keyword ref di depan tipe data" },
      { key: "D", text: "Mengembalikan variabel dengan return reference" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Simbol ampersand (&) pada deklarasi parameter fungsi menentukan bahwa argumen dilewatkan secara referensi (pass-by-reference)."
  },
  {
    id: 129,
    question: "Manakah return type hint yang menandakan bahwa fungsi PASTI tidak akan pernah mengembalikan kontrol ke pemanggilnya (selalu melempar exception atau memanggil exit)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "void" },
      { key: "B", text: "never" },
      { key: "C", text: "null" },
      { key: "D", text: "noreturn" }
    ],
    correct_answer: "B",
    category: "Function",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Tipe pengembalian 'never' (diperkenalkan di PHP 8.1) mengindikasikan fungsi tersebut tidak pernah selesai secara normal (selalu exit(), die(), atau throw Exception)."
  },

  // --- 8. String (Soal 30 - 33) ---
  {
    id: 130,
    question: "Fungsi bawaan PHP 8 apakah yang menyederhanakan pemeriksaan apakah suatu string diawali dengan substring tertentu?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "str_starts_with()" },
      { key: "B", text: "str_begins()" },
      { key: "C", text: "starts_with()" },
      { key: "D", text: "has_prefix()" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "str_starts_with($haystack, $needle) adalah fungsi resmi di PHP 8 yang mengembalikan nilai boolean true jika string diawali kata kunci yang ditentukan."
  },
  {
    id: 131,
    question: "Apa output dari str_replace berikut?",
    codeSnippet: `<?php\n$text = "Kucing belang makan ikan";\necho str_replace("belang", "putih", $text);\n?>`,
    options: [
      { key: "A", text: "Kucing putih makan ikan" },
      { key: "B", text: "Kucing belang makan ikan" },
      { key: "C", text: "putih" },
      { key: "D", text: "ikan makan Kucing" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "str_replace(search, replace, subject) mengganti seluruh kemunculan string 'belang' dengan 'putih'."
  },
  {
    id: 132,
    question: "Fungsi apakah yang digunakan untuk menghilangkan spasi putih atau karakter tak terlihat di awal dan di akhir sebuah string?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "strip()" },
      { key: "B", text: "trim()" },
      { key: "C", text: "clean()" },
      { key: "D", text: "chop_all()" }
    ],
    correct_answer: "B",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Fungsi trim() memotong whitespace atau karakter kontrol di kedua ujung string."
  },
  {
    id: 133,
    question: "Perhatikan heredoc sintaks PHP berikut. Manakah pernyataan yang BENAR?",
    codeSnippet: `<?php\n$nama = "Budi";\n$html = <<<EOD\n<div>\n    <h1>Halo $nama</h1>\n</div>\nEOD;\n?>`,
    options: [
      { key: "A", text: "Heredoc bekerja mirip string petik tunggal tanpa evaluasi variabel" },
      { key: "B", text: "Heredoc memperbolehkan penulisan string multi-baris dan tetap mengevaluasi variabel di dalamnya" },
      { key: "C", text: "Sintaks EOD dilarang di PHP modern" },
      { key: "D", text: "Heredoc hanya bisa digunakan untuk JSON" }
    ],
    correct_answer: "B",
    category: "String",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Heredoc (<<<IDENTIFIER) memungkinkan deklarasi string multi-baris yang kompleks dan tetap mem-parsing ekspresi variabel di dalamnya, mirip dengan string berpetik ganda."
  },

  // --- 9. Object Oriented Programming / OOP (Soal 34 - 39) ---
  {
    id: 134,
    question: "Fitur 'Constructor Property Promotion' pada PHP 8.0 memungkinkan:",
    codeSnippet: `<?php\nclass User {\n    public function __construct(\n        public string $name,\n        private int $age\n    ) {}\n}\n?>`,
    options: [
      { key: "A", text: "Mendeklarasikan sekaligus menginisialisasi properti class langsung di parameter constructor tanpa boilerplate assignment" },
      { key: "B", text: "Menghapus kebutuhan class constructor" },
      { key: "C", text: "Membuat semua properti menjadi public" },
      { key: "D", text: "Mempercepat koneksi basis data" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Constructor Property Promotion menyingkat penulisan deklarasi variabel properti dan $this->prop = $prop di dalam body constructor."
  },
  {
    id: 135,
    question: "Perbedaan mendasar antara 'Interface' dan 'Abstract Class' di PHP adalah:",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Satu class dapat mengimplementasikan banyak (multiple) Interface, tetapi hanya bisa meng-extend satu parent class" },
      { key: "B", text: "Interface boleh memiliki method private, sedangkan abstract class tidak" },
      { key: "C", text: "Interface bisa memiliki property reguler dengan nilai awal" },
      { key: "D", text: "Abstract class tidak boleh memiliki constructor" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "PHP hanya mendukung single inheritance untuk class/abstract class, namun sebuah class dapat mengimplementasikan banyak Interface sekaligus (multiple interface implementation)."
  },
  {
    id: 136,
    question: "Magic method apa yang dipicu di PHP ketika kode mencoba memanggil method yang tidak dapat diakses atau tidak ada pada sebuah objek?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "__get()" },
      { key: "B", text: "__call()" },
      { key: "C", text: "__invoke()" },
      { key: "D", text: "__set()" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "__call($name, $arguments) dieksekusi ketika memanggil method instans yang tidak dapat diakses atau belum didefinisikan."
  },
  {
    id: 137,
    question: "Apa fungsi dari keyword 'readonly' pada properti class yang diperkenalkan di PHP 8.1?",
    codeSnippet: `<?php\nclass Article {\n    public function __construct(\n        public readonly string $slug\n    ) {}\n}\n?>`,
    options: [
      { key: "A", text: "Properti hanya dapat diinisialisasi satu kali dan nilainya tidak dapat dimodifikasi lagi setelahnya" },
      { key: "B", text: "Properti tidak bisa dibaca oleh publik" },
      { key: "C", text: "Properti otomatis disimpan ke session" },
      { key: "D", text: "Properti hanya menerima angka integer" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Properti dengan modifier readonly menjamin immutabilitas: properti tersebut hanya bisa ditulis sekali selama proses inisialisasi dan tidak bisa diubah nilainya kemudian."
  },
  {
    id: 138,
    question: "Prinsip OOP apakah yang menyembunyikan detail implementasi internal dan hanya mengekspos antarmuka publik yang diperlukan melalui getter/setter?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Polymorphism" },
      { key: "B", text: "Encapsulation (Enkapsulasi)" },
      { key: "C", text: "Inheritance (Pewarisan)" },
      { key: "D", text: "Method Chaining" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Enkapsulasi membungkus data (properti) dan kode (method) ke dalam satu kesatuan sambil membatasi akses langsung dari pihak luar menggunakan visibilitas private/protected."
  },
  {
    id: 139,
    question: "Apa kegunaan dari standar PSR-4 dalam ekosistem PHP modern dan Composer?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Standar aturan indentasi dan tanda kurung" },
      { key: "B", text: "Standar spesifikasi Autoloading class berdasarkan struktur namespace dan direktori file" },
      { key: "C", text: "Standar pengamanan SQL Injection" },
      { key: "D", text: "Standar konfigurasi web server Nginx" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "PSR-4 mendefinisikan pedoman resmi autoloading class dari path file yang dipetakan secara terstruktur dari namespace class tersebut."
  },

  // --- 10. Database / MySQL (Soal 40 - 44) ---
  {
    id: 140,
    question: "Perhatikan prepared statement dengan Named Parameter berikut. Baris manakah yang tepat untuk mengeksekusi query?",
    codeSnippet: `<?php\n$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND status = :status");\n?>`,
    options: [
      { key: "A", text: "$stmt->execute([':email' => $email, ':status' => 1]);" },
      { key: "B", text: "$stmt->run($email, 1);" },
      { key: "C", text: "$pdo->query($stmt);" },
      { key: "D", text: "$stmt->fetchAll($email, 1);" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Prepared statement PDO dieksekusi dengan memanggil method execute() dan mengoperkan array asosiatif pasangan parameter query ke nilainya."
  },
  {
    id: 141,
    question: "Bagaimanakah cara mendapatkan ID baris terakhir yang baru saja di-insert dengan fitur AUTO_INCREMENT di PDO?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$pdo->lastInsertId()" },
      { key: "B", text: "$pdo->getInsertedId()" },
      { key: "C", text: "mysql_insert_id()" },
      { key: "D", text: "$stmt->lastRowId()" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "$pdo->lastInsertId() mengembalikan ID atau nilai sequence dari baris terakhir yang dimasukkan ke dalam database."
  },
  {
    id: 142,
    question: "Apa tujuan utama penggunaan Database Transaction ($pdo->beginTransaction() dan $pdo->commit())?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Meningkatkan kecepatan loading CSS web" },
      { key: "B", text: "Menjamin prinsip ACID sehingga rangkaian query dieksekusi secara utuh, atau dibatalkan sama sekali jika ada langkah yang gagal" },
      { key: "C", text: "Mengompresi ukuran tabel di disk" },
      { key: "D", text: "Mengganti password root MySQL secara otomatis" }
    ],
    correct_answer: "B",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Transaksi database menjamin integritas data (prinsip atomisitas): jika terjadi error di tengah proses transfer rekening misalnya, semua query di-rollback sehingga tidak ada data yang inkonsisten."
  },
  {
    id: 143,
    question: "Method PDOStatement manakah yang digunakan untuk mengambil SEMUA baris hasil query sekaligus ke dalam array?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$stmt->fetch()" },
      { key: "B", text: "$stmt->fetchAll()" },
      { key: "C", text: "$stmt->getAll()" },
      { key: "D", text: "$stmt->readEntire()" }
    ],
    correct_answer: "B",
    category: "Database / MySQL",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "fetchAll() mengambil seluruh baris sisa dari result set dan mengumpulkannya ke dalam array multidimensi."
  },
  {
    id: 144,
    question: "Mengapa password pengguna TIDAK BOLEH disimpan menggunakan algoritma hashing lawas seperti MD5 atau SHA1?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Karena MD5 dan SHA1 cepat dieksekusi sehingga sangat rentan terhadap serangan brute-force dan rainbow table lookup" },
      { key: "B", text: "Karena PHP sudah tidak memiliki fungsi md5()" },
      { key: "C", text: "Karena string hasil MD5 terlalu panjang untuk kolom MySQL" },
      { key: "D", text: "Karena MD5 hanya bisa meng-enkripsi huruf besar" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Algoritma hash cepat seperti MD5 sangat rentan dibobol menggunakan GPU cluster dan rainbow table. Gunakan password_hash() dengan algoritma bcrypt/Argon2id."
  },

  // --- 11. CRUD (Soal 45 - 48) ---
  {
    id: 145,
    question: "Fungsi bawaan PHP modern manakah yang paling aman dan direkomendasikan untuk melakukan hashing kata sandi pengguna?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "crypt_sha256()" },
      { key: "B", text: "password_hash($password, PASSWORD_BCRYPT)" },
      { key: "C", text: "hash('sha512', $password)" },
      { key: "D", text: "base64_encode($password)" }
    ],
    correct_answer: "B",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "password_hash() secara otomatis menghasilkan salt acak kriptografis yang aman dan menerapkan algoritma hashing lambat (slow hashing) seperti Bcrypt atau Argon2."
  },
  {
    id: 146,
    question: "Fungsi pasangan apakah yang digunakan untuk memverifikasi kecocokan antara password plaintext dengan hash yang tersimpan di database?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "password_verify($password, $hash)" },
      { key: "B", text: "password_check($password, $hash)" },
      { key: "C", text: "compare_hash($password, $hash)" },
      { key: "D", text: "password_match($password, $hash)" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "password_verify() membandingkan string password mentah dengan string hash secara aman dari serangan timing attack."
  },
  {
    id: 147,
    question: "Bagaimanakah mekanisme perlindungan standar terhadap serangan CSRF (Cross-Site Request Forgery) pada form modul CRUD PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menyertakan token acak unik rahasia yang disimpan di $_SESSION dan diverifikasi di server saat form disubmit via POST" },
      { key: "B", text: "Mengubah semua form method menjadi GET" },
      { key: "C", text: "Mematikan koneksi internet pengguna" },
      { key: "D", text: "Menggunakan enkripsi SSL saja sudah cukup tanpa kode tambahan" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Pola Anti-CSRF Token melibatkan penyimpanan token kriptografis di session pengguna dan membandingkannya dengan input hidden field token yang dikirim form."
  },
  {
    id: 148,
    question: "Dalam modul hapus data (Delete), mengapa menghapus data secara langsung via URL parameter GET (contoh: hapus.php?id=5) sangat TIDAK DIANJURKAN?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Karena request GET bersifat aman dan idempoten; penghapusan data harus melalui request POST/DELETE dengan proteksi CSRF token" },
      { key: "B", text: "Karena PHP tidak bisa membaca query string di URL" },
      { key: "C", text: "Karena browser akan otomatis memblokir URL yang mengandung kata hapus" },
      { key: "D", text: "Karena database MySQL menolak request GET" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Tindakan yang mengubah status data (seperti DELETE) tidak boleh diakses via metode GET karena web crawler atau prefetching link dapat memicu penghapusan tanpa sengaja serta rentan CSRF."
  },

  // --- 12. Error Handling (Soal 49 - 50) ---
  {
    id: 149,
    question: "Sejak PHP 7+, antarmuka (interface) dasar apakah yang menjadi induk tertinggi dari Exception dan TypeError/Error lainnya?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Throwable" },
      { key: "B", text: "BaseError" },
      { key: "C", text: "RootException" },
      { key: "D", text: "SystemFault" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Throwable adalah antarmuka akar (root interface) di PHP yang diimplementasikan oleh kelas Exception dan kelas Error, memungkinkan penangkapan seluruh jenis kesalahan fatal."
  },
  {
    id: 150,
    question: "Dalam lingkungan produksi (production server), manakah kombinasi konfigurasi php.ini yang paling aman terkait penanganan pesan kesalahan?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "display_errors = Off dan log_errors = On" },
      { key: "B", text: "display_errors = On dan log_errors = Off" },
      { key: "C", text: "error_reporting = 0 dan matikan semua file log" },
      { key: "D", text: "display_startup_errors = On" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Di server production, display_errors harus dimatikan (Off) agar informasi sensitif server/database tidak bocor ke publik, dan log_errors dinyalakan (On) agar developer tetap bisa memantau masalah melalui log server."
  }
];
