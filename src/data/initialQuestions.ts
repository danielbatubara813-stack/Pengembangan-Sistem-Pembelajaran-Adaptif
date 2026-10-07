import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // --- 1. Dasar PHP (Soal 1 - 4) ---
  {
    id: 1,
    question: "Bagaimanakah tag pembuka standar yang direkomendasikan untuk menulis script PHP menurut PSR-12?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "<?php" },
      { key: "B", text: "<%" },
      { key: "C", text: "<script language=\"php\">" },
      { key: "D", text: "<?" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Tag pembuka standar dan wajib menurut standar PSR-12 adalah <?php. Tag pendek (short open tags) seperti <? tidak disarankan karena bergantung pada konfigurasi php.ini."
  },
  {
    id: 2,
    question: "Perhatikan baris kode PHP berikut. Apa keluaran dari script tersebut?",
    codeSnippet: `<?php\necho "Hello", " ", "World!";\n?>`,
    options: [
      { key: "A", text: "Syntax Error karena echo hanya menerima satu parameter" },
      { key: "B", text: "Hello World!" },
      { key: "C", text: "Hello, World!" },
      { key: "D", text: "Array" }
    ],
    correct_answer: "B",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "echo adalah konstruksi bahasa (language construct) yang dapat menerima argumen jamak dipisahkan tanda koma tanpa tanda kurung."
  },
  {
    id: 3,
    question: "Manakah pernyataan yang BENAR mengenai perbedaan mendasar antara 'echo' dan 'print' dalam PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "print tidak dapat mencetak string" },
      { key: "B", text: "echo mengembalikan nilai 1, sedangkan print tidak mengembalikan nilai" },
      { key: "C", text: "print selalu mengembalikan nilai 1 dan dapat digunakan dalam ekspresi, sedangkan echo tidak mengembalikan nilai" },
      { key: "D", text: "echo hanya bisa berjalan di PHP CLI" }
    ],
    correct_answer: "C",
    category: "Dasar PHP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "print bertindak seperti fungsi yang selalu mengembalikan nilai integer 1 sehingga dapat digunakan dalam ekspresi matematika/kondisional, sedangkan echo tidak mengembalikan nilai apapun."
  },
  {
    id: 4,
    question: "Cara penulisan komentar multi-baris (multiline comment) yang valid di PHP adalah:",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "<!-- Komentar -->" },
      { key: "B", text: "/* Komentar */" },
      { key: "C", text: "#* Komentar *#" },
      { key: "D", text: "// Komentar //" }
    ],
    correct_answer: "B",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Di PHP, komentar multi-baris ditulis menggunakan pembuka /* dan penutup */."
  },

  // --- 2. Variabel dan Tipe Data (Soal 5 - 8) ---
  {
    id: 5,
    question: "Manakah nama variabel berikut yang VALID dalam aturan sintaks PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$2user" },
      { key: "B", text: "$user-name" },
      { key: "C", text: "$_user_123" },
      { key: "D", text: "$user.score" }
    ],
    correct_answer: "C",
    category: "Variabel dan Tipe Data",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Variabel PHP harus diawali dengan tanda $, diikuti huruf atau underscore (_), bukan angka atau tanda hubung (-)."
  },
  {
    id: 6,
    question: "Apa output dari kode pengecekan tipe data berikut?",
    codeSnippet: `<?php\n$val = "100" + 20;\necho gettype($val);\n?>`,
    options: [
      { key: "A", text: "string" },
      { key: "B", text: "integer" },
      { key: "C", text: "double" },
      { key: "D", text: "TypeError fatal exception" }
    ],
    correct_answer: "B",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operasi aritmatika penambahan (+) melakukan type juggling otomatis mengkonversi string numerik '100' menjadi integer 100, lalu ditambah 20 menghasilkan integer 120."
  },
  {
    id: 7,
    question: "Apakah hasil keluaran dari script perbandingan konstanta berikut?",
    codeSnippet: `<?php\ndefine("SITE_NAME", "AdaptifAI");\n$name = "SITE_NAME";\necho constant($name);\n?>`,
    options: [
      { key: "A", text: "SITE_NAME" },
      { key: "B", text: "$name" },
      { key: "C", text: "AdaptifAI" },
      { key: "D", text: "Undefined variable: SITE_NAME" }
    ],
    correct_answer: "C",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Fungsi constant() berguna untuk mengambil nilai dari sebuah konstanta saat nama konstanta tersebut tersimpan di dalam variabel."
  },
  {
    id: 8,
    question: "Tipe data khusus apa di PHP yang merepresentasikan variabel tanpa nilai dan bernilai case-insensitive?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "void" },
      { key: "B", text: "NULL" },
      { key: "C", text: "undefined" },
      { key: "D", text: "empty" }
    ],
    correct_answer: "B",
    category: "Variabel dan Tipe Data",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "NULL adalah tipe data spesial di PHP yang menandakan bahwa variabel belum memiliki nilai atau telah di-unset."
  },

  // --- 3. Operator (Soal 9 - 12) ---
  {
    id: 9,
    question: "Apa output dari perbandingan strict identity berikut?",
    codeSnippet: `<?php\n$a = 5;\n$b = "5";\nvar_dump($a === $b);\n?>`,
    options: [
      { key: "A", text: "bool(true)" },
      { key: "B", text: "bool(false)" },
      { key: "C", text: "int(1)" },
      { key: "D", text: "null" }
    ],
    correct_answer: "B",
    category: "Operator",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Operator === memeriksa kesamaan nilai sekaligus tipe data (strict comparison). Karena $a adalah integer dan $b adalah string, hasilnya false."
  },
  {
    id: 10,
    question: "Apa nilai dari $result pada penggunaan operator Null Coalescing (??) berikut?",
    codeSnippet: `<?php\n$data = ['name' => null];\n$result = $data['name'] ?? 'Anonim';\necho $result;\n?>`,
    options: [
      { key: "A", text: "null" },
      { key: "B", text: "Anonim" },
      { key: "C", text: "Notice: Undefined index" },
      { key: "D", text: "false" }
    ],
    correct_answer: "B",
    category: "Operator",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator null coalescing (??) mengembalikan operand kedua jika operand pertama bernilai NULL atau tidak terdefinisi."
  },
  {
    id: 11,
    question: "Perhatikan penggunaan spaceship operator (<=>) pada PHP 7+. Apa outputnya?",
    codeSnippet: `<?php\necho 15 <=> 20;\n?>`,
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "0" },
      { key: "C", text: "-1" },
      { key: "D", text: "false" }
    ],
    correct_answer: "C",
    category: "Operator",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator spaceship (<=>) mengembalikan -1 jika nilai kiri < kanan, 0 jika sama, dan 1 jika nilai kiri > kanan. Karena 15 < 20, hasilnya -1."
  },
  {
    id: 12,
    question: "Apa output dari operasi pre-increment dan post-increment berikut?",
    codeSnippet: `<?php\n$x = 10;\n$y = ++$x + $x++;\necho "$x dan $y";\n?>`,
    options: [
      { key: "A", text: "12 dan 22" },
      { key: "B", text: "11 dan 21" },
      { key: "C", text: "12 dan 23" },
      { key: "D", text: "10 dan 20" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "++$x menaikkan $x menjadi 11 dan mengembalikan 11. Lalu ekspresi kedua $x++ menggunakan nilai 11 lalu menaikkannya menjadi 12. Jadi $y = 11 + 11 = 22, dan nilai akhir $x adalah 12."
  },

  // --- 4. Conditional (Soal 13 - 16) ---
  {
    id: 13,
    question: "Perhatikan switch statement berikut. Berapakah nilai yang dicetak?",
    codeSnippet: `<?php\n$score = 80;\nswitch (true) {\n    case $score >= 85:\n        echo "A"; break;\n    case $score >= 75:\n        echo "B"; break;\n    default:\n        echo "C";\n}\n?>`,
    options: [
      { key: "A", text: "A" },
      { key: "B", text: "B" },
      { key: "C", text: "C" },
      { key: "D", text: "Error sintaks" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Teknik switch(true) mengevaluasi setiap case kondisi boolean. Karena 80 >= 75 adalah true, maka case tersebut cocok dan mencetak B."
  },
  {
    id: 14,
    question: "Apa keunggulan ekspresi 'match' (diperkenalkan di PHP 8) dibandingkan struktur 'switch' tradisional?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "match menggunakan strict comparison (===) dan langsung mengembalikan nilai tanpa butuh break" },
      { key: "B", text: "match lebih lambat tetapi mendukung case multi-type" },
      { key: "C", text: "match memperbolehkan fall-through tanpa break secara default" },
      { key: "D", text: "match hanya dapat mengevaluasi tipe data string" }
    ],
    correct_answer: "A",
    category: "Conditional",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Ekspresi match di PHP 8 mengevaluasi kesamaan dengan operator identitas ketat (===), tidak memerlukan statement break, dan mengembalikan sebuah nilai langsung."
  },
  {
    id: 15,
    question: "Apa output dari ternary operator bersarang berikut?",
    codeSnippet: `<?php\n$role = 'editor';\n$access = $role === 'admin' ? 'Penuh' : ($role === 'editor' ? 'Terbatas' : 'Tolak');\necho $access;\n?>`,
    options: [
      { key: "A", text: "Penuh" },
      { key: "B", text: "Terbatas" },
      { key: "C", text: "Tolak" },
      { key: "D", text: "null" }
    ],
    correct_answer: "B",
    category: "Conditional",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Karena $role bernilai 'editor', kondisi pertama bernilai false, lalu kondisi kedua bernilai true sehingga mengembalikan 'Terbatas'."
  },
  {
    id: 16,
    question: "Manakah nilai berikut yang dievaluasi sebagai TRUE oleh kondisi if di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "\"0\" (string nol)" },
      { key: "B", text: "[] (array kosong)" },
      { key: "C", text: "\"-1\" (string minus satu)" },
      { key: "D", text: "0.0 (float nol)" }
    ],
    correct_answer: "C",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Di PHP, '0', 0, 0.0, [], null, dan '' dievaluasi sebagai false. Namun string '-1' dievaluasi sebagai true."
  },

  // --- 5. Looping (Soal 17 - 20) ---
  {
    id: 17,
    question: "Berapa kali perulangan 'do...while' dipastikan akan dieksekusi minimal?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "0 kali (bisa tidak sama sekali)" },
      { key: "B", text: "1 kali" },
      { key: "C", text: "2 kali" },
      { key: "D", text: "Tergantung nilai awal variabel counter" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Struktur do-while memeriksa kondisi di akhir iterasi, sehingga blok kode di dalamnya selalu dieksekusi minimal satu kali."
  },
  {
    id: 18,
    question: "Perhatikan potongan kode looping berikut. Apa keluaran yang dihasilkan?",
    codeSnippet: `<?php\nfor ($i = 1; $i <= 5; $i++) {\n    if ($i === 3) continue;\n    if ($i === 5) break;\n    echo $i;\n}\n?>`,
    options: [
      { key: "A", text: "1234" },
      { key: "B", text: "124" },
      { key: "C", text: "1245" },
      { key: "D", text: "12" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Ketika $i bernilai 3, perintah continue melompati iterasi tersebut. Ketika $i bernilai 5, perintah break langsung menghentikan perulangan. Sehingga tercetak 124."
  },
  {
    id: 19,
    question: "Apa output dari perulangan foreach dengan referensi (&) berikut?",
    codeSnippet: `<?php\n$nums = [1, 2, 3];\nforeach ($nums as &$val) {\n    $val *= 2;\n}\nunset($val);\necho implode(",", $nums);\n?>`,
    options: [
      { key: "A", text: "1,2,3" },
      { key: "B", text: "2,4,6" },
      { key: "C", text: "2,2,3" },
      { key: "D", text: "Array to string conversion error" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Tanda ampersand (&) pada $val membuat elemen di dalam array dioper secara referensi, sehingga perubahan $val *= 2 langsung memodifikasi elemen asli array menjadi [2, 4, 6]."
  },
  {
    id: 20,
    question: "Dalam PHP, parameter numerik opsional pada statement 'break 2;' berfungsi untuk:",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menunggu 2 detik sebelum keluar" },
      { key: "B", text: "Keluar dari 2 level struktur looping bersarang sekaligus" },
      { key: "C", text: "Mengulangi loop sebanyak 2 kali" },
      { key: "D", text: "Melewati 2 iterasi berikutnya" }
    ],
    correct_answer: "B",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Di PHP, break menerima argumen numerik opsional yang menentukan berapa level struktur loop terbungkus yang ingin dihentikan."
  },

  // --- 6. Array (Soal 21 - 25) ---
  {
    id: 21,
    question: "Fungsi bawaan PHP manakah yang digunakan untuk menghitung jumlah elemen dalam array?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "array_length()" },
      { key: "B", text: "count()" },
      { key: "C", text: "size()" },
      { key: "D", text: "len()" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Fungsi count() (atau aliasnya sizeof()) adalah fungsi standar untuk mendapatkan total item di dalam array."
  },
  {
    id: 22,
    question: "Perhatikan kode manipulasi array berikut. Apa nilai dari $result?",
    codeSnippet: `<?php\n$arr1 = ["a" => 1, "b" => 2];\n$arr2 = ["b" => 99, "c" => 3];\n$result = $arr1 + $arr2;\necho $result["b"];\n?>`,
    options: [
      { key: "A", text: "99" },
      { key: "B", text: "2" },
      { key: "C", text: "101" },
      { key: "D", text: "Fatal error" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator penggabungan array (+) mempertahankan key dari array sebelah kiri jika terdapat duplikasi key. Maka nilai key 'b' tetap 2 (berbeda dengan array_merge yang akan menimpa)."
  },
  {
    id: 23,
    question: "Apa fungsi dari array_map() dalam PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menyaring elemen array berdasarkan fungsi kondisi callback" },
      { key: "B", text: "Menerapkan fungsi callback ke setiap elemen array dan mengembalikan array baru" },
      { key: "C", text: "Mengurutkan array berdasarkan nilai geolokasi peta" },
      { key: "D", text: "Menggabungkan dua array menjadi array asosiatif key-value" }
    ],
    correct_answer: "B",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "array_map() mengeksekusi callback pada setiap elemen array yang diberikan dan menghasilkan array baru dengan hasil transformasi."
  },
  {
    id: 24,
    question: "Apa fungsi bawaan untuk memeriksa apakah sebuah kunci (key) tertentu ada di dalam array asosiatif?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "in_array()" },
      { key: "B", text: "array_search()" },
      { key: "C", text: "array_key_exists()" },
      { key: "D", text: "has_key()" }
    ],
    correct_answer: "C",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "array_key_exists('key', $array) memeriksa keberadaan indeks/kunci, bahkan jika nilainya adalah NULL (berbeda dengan isset yang return false jika value bernilai null)."
  },
  {
    id: 25,
    question: "Perhatikan fungsi array_filter berikut. Elemen apa saja yang tersisa dalam array hasil?",
    codeSnippet: `<?php\n$data = [0, 12, false, "PHP", "", null, 45];\n$filtered = array_filter($data);\necho implode(", ", $filtered);\n?>`,
    options: [
      { key: "A", text: "12, PHP, 45" },
      { key: "B", text: "0, 12, PHP, 45" },
      { key: "C", text: "12, false, PHP, 45" },
      { key: "D", text: "Semua elemen tetap utuh" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Jika dipanggil tanpa callback kedua, array_filter() otomatis membuang semua elemen yang bernilai 'falsy' seperti 0, false, '', dan null."
  },

  // --- 7. Function (Soal 26 - 29) ---
  {
    id: 26,
    question: "Bagaimanakah cara mengizinkan fungsi menerima jumlah argumen variabel tanpa batas (variadic function) di PHP 5.6+?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Menggunakan simbol ... (splat/spread operator) sebelum nama parameter" },
      { key: "B", text: "Menggunakan tanda ampersand (&) pada nama parameter" },
      { key: "C", text: "Mengatur default parameter = []" },
      { key: "D", text: "Menggunakan keyword params" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Splat operator (...) sebelum parameter mengumpulkan seluruh argumen sisa ke dalam sebuah array (misal: function sum(...$numbers))."
  },
  {
    id: 27,
    question: "Perhatikan closure (anonymous function) berikut. Keyword apa yang wajib digunakan agar closure bisa mengakses variabel dari lingkup (scope) luar?",
    codeSnippet: `<?php\n$bonus = 500;\n$calculate = function($salary) ______ ($bonus) {\n    return $salary + $bonus;\n};\n?>`,
    options: [
      { key: "A", text: "global" },
      { key: "B", text: "use" },
      { key: "C", text: "import" },
      { key: "D", text: "pass" }
    ],
    correct_answer: "B",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Keyword 'use' digunakan pada deklarasi anonymous function di PHP untuk mengikat variabel dari outer scope ke dalam closure."
  },
  {
    id: 28,
    question: "Apa output dari script yang menggunakan variabel static di dalam fungsi berikut?",
    codeSnippet: `<?php\nfunction counter() {\n    static $count = 0;\n    $count++;\n    return $count;\n}\ncounter();\necho counter();\n?>`,
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "2" },
      { key: "C", text: "0" },
      { key: "D", text: "NULL" }
    ],
    correct_answer: "B",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Variabel static mempertahankan nilainya antar pemanggilan fungsi. Pemanggilan pertama mengubah $count dari 0 ke 1, dan pemanggilan kedua mengubahnya menjadi 2."
  },
  {
    id: 29,
    question: "Sejak PHP 7.1, type hint 'nullable' pada parameter fungsi ditulis dengan awalan simbol:",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "! (contoh: !string)" },
      { key: "B", text: "? (contoh: ?string)" },
      { key: "C", text: "* (contoh: *string)" },
      { key: "D", text: "null| (hanya di docblock)" }
    ],
    correct_answer: "B",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Tanda tanya di depan tipe data (?string) menandakan parameter tersebut dapat bertipe string atau bernilai null."
  },

  // --- 8. String (Soal 30 - 33) ---
  {
    id: 30,
    question: "Apa perbedaan mendasar antara petik ganda (\" \") dan petik tunggal (' ') dalam mendeklarasikan string di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Petik ganda mem-parsing variabel (interpolasi) dan escape sequence, sedangkan petik tunggal memperlakukan teks secara literal" },
      { key: "B", text: "Petik tunggal jauh lebih lambat karena harus membaca ANSI encoding" },
      { key: "C", text: "Petik ganda tidak memperbolehkan spasi di dalamnya" },
      { key: "D", text: "Tidak ada perbedaan, keduanya identik" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "String petik ganda mengevaluasi variabel ($nama) dan escape sequence (seperti \\n), sedangkan petik tunggal menampilkannya secara mentah apa adanya."
  },
  {
    id: 31,
    question: "Fungsi bawaan apakah yang memecah string menjadi array berdasarkan delimiter tertentu?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "implode()" },
      { key: "B", text: "str_split()" },
      { key: "C", text: "explode()" },
      { key: "D", text: "split_string()" }
    ],
    correct_answer: "C",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "explode(delimiter, string) memecah string berdasarkan pemisah tertentu dan mengembalikan array potongan string."
  },
  {
    id: 32,
    question: "Apa output dari kode pemotongan string berikut?",
    codeSnippet: `<?php\n$str = "Belajar PHP Modern";\necho substr($str, 8, 3);\n?>`,
    options: [
      { key: "A", text: "PHP" },
      { key: "B", text: "r P" },
      { key: "C", text: "Modern" },
      { key: "D", text: "Bel" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Indeks ke-8 pada 'Belajar PHP Modern' adalah huruf 'P' (indeks berbasis 0), dan panjang 3 karakter menghasilkan 'PHP'."
  },
  {
    id: 33,
    question: "Manakah fungsi PHP yang digunakan untuk mencari posisi kemunculan pertama suatu substring di dalam string?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "strpos()" },
      { key: "B", text: "strstr()" },
      { key: "C", text: "str_find()" },
      { key: "D", text: "substr_count()" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "strpos() mengembalikan indeks posisi karakter pertama substring yang dicari, atau false jika tidak ditemukan."
  },

  // --- 9. Object Oriented Programming / OOP (Soal 34 - 39) ---
  {
    id: 34,
    question: "Visibility keyword manakah yang memungkinkan properti atau method dapat diakses di dalam class itu sendiri dan class turunannya, tetapi TIDAK dari luar class?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "private" },
      { key: "B", text: "protected" },
      { key: "C", text: "public" },
      { key: "D", text: "static" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Keyword protected membatasi akses hanya untuk class pemilik dan kelas-kelas anak (subclasses) yang meng-inherit class tersebut."
  },
  {
    id: 35,
    question: "Apa nama magic method constructor yang otomatis dieksekusi saat sebuah instance class dibuat?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "__init()" },
      { key: "B", text: "__construct()" },
      { key: "C", text: "__build()" },
      { key: "D", text: "__create()" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Dalam PHP, constructor dinyatakan dengan method ajaib __construct()."
  },
  {
    id: 36,
    question: "Perhatikan deklarasi abstract class berikut. Manakah pernyataan yang BENAR?",
    codeSnippet: `<?php\nabstract class Vehicle {\n    abstract public function startEngine(): bool;\n    public function honk(): string {\n        return "Beep!";\n    }\n}\n?>`,
    options: [
      { key: "A", text: "Vehicle dapat langsung diinstansiasi dengan $v = new Vehicle();" },
      { key: "B", text: "Abstract class tidak boleh memiliki method konkrit yang memiliki body" },
      { key: "C", text: "Class turunan wajib mengimplementasikan method startEngine()" },
      { key: "D", text: "Method startEngine harus bertipe private" }
    ],
    correct_answer: "C",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Setiap kelas turunan non-abstract wajib mendefinisikan implementasi konkret untuk semua abstract method yang diwariskan dari parent class."
  },
  {
    id: 37,
    question: "Keyword apa yang digunakan oleh sebuah class untuk menggunakan satu atau lebih 'Trait' dalam PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "extends" },
      { key: "B", text: "implements" },
      { key: "C", text: "use" },
      { key: "D", text: "include" }
    ],
    correct_answer: "C",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Trait diimpor ke dalam body class menggunakan keyword 'use' untuk memungkinkan penggunaan kembali kode (horizontal reuse of code)."
  },
  {
    id: 38,
    question: "Manakah sintaks yang benar untuk mengakses method statis 'getInfo()' pada class 'Product' tanpa membuat objek instansiasi?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Product->getInfo();" },
      { key: "B", text: "Product::getInfo();" },
      { key: "C", text: "Product@getInfo();" },
      { key: "D", text: "Product.getInfo();" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Scope Resolution Operator (:: atau Paamayim Nekudotayim) digunakan untuk mengakses member statis, konstanta, atau method overriden dari sebuah class."
  },
  {
    id: 39,
    question: "Apa fungsi dari keyword 'final' jika diletakkan di depan deklarasi sebuah class?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Class tersebut menjadi immutable dan nilainya tidak bisa diubah" },
      { key: "B", text: "Class tersebut tidak dapat diturunkan/diwariskan (cannot be extended) oleh class lain" },
      { key: "C", text: "Class tersebut otomatis dipanggil terakhir saat script berakhir" },
      { key: "D", text: "Class tersebut hanya memiliki satu instance (singleton otomatis)" }
    ],
    correct_answer: "B",
    category: "Object Oriented Programming / OOP",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Class atau method yang diberi kata kunci 'final' mencegah pewarisan lebih lanjut (inheritance) oleh kelas lain."
  },

  // --- 10. Database / MySQL (Soal 40 - 44) ---
  {
    id: 40,
    question: "Mengapa ekstensi PDO (PHP Data Objects) lebih direkomendasikan daripada fungsi lawas mysqli_* prosedural?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "PDO mendukung database abstraction layer (bisa terhubung ke PostgreSQL, SQLite, Oracle, dll.) dan prepared statement yang aman" },
      { key: "B", text: "PDO tidak membutuhkan username dan password untuk terhubung" },
      { key: "C", text: "PDO secara default menjalankan query lebih cepat tanpa kompilasi SQL" },
      { key: "D", text: "mysqli_* sudah dihapus total di PHP 7" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "PDO menyediakan antarmuka seragam untuk berinteraksi dengan berbagai driver basis data relasional (multi-RDBMS) serta dukungan prepared statements terstandar."
  },
  {
    id: 41,
    question: "Manakah format DSN (Data Source Name) yang tepat untuk membuat koneksi PDO ke MySQL di localhost?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "\"mysql:host=localhost;dbname=akademik;charset=utf8mb4\"" },
      { key: "B", text: "\"database://localhost:mysql/akademik\"" },
      { key: "C", text: "\"pdo_mysql(localhost, akademik)\"" },
      { key: "D", text: "\"mysql://user:pass@localhost/akademik\"" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "DSN MySQL untuk PDO memiliki format 'mysql:host=...;dbname=...;charset=...'."
  },
  {
    id: 42,
    question: "Fitur keamanan apakah dalam PDO yang paling efektif untuk mencegah serangan SQL Injection?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "htmlspecialchars()" },
      { key: "B", text: "Prepared Statements dengan parameterized queries (menggunakan placeholder ? atau :name)" },
      { key: "C", text: "md5() hashing" },
      { key: "D", text: "addslashes()" }
    ],
    correct_answer: "B",
    category: "Database / MySQL",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Prepared statements memisahkan instruksi SQL dari parameter data pengguna, sehingga input tidak dapat memanipulasi struktur query SQL."
  },
  {
    id: 43,
    question: "Perhatikan baris kode PDO fetch berikut. Apa arti dari konstanta PDO::FETCH_ASSOC?",
    codeSnippet: `<?php\n$stmt = $pdo->query("SELECT id, name FROM users");\n$user = $stmt->fetch(PDO::FETCH_ASSOC);\n?>`,
    options: [
      { key: "A", text: "Mengembalikan hasil baris sebagai objek stdClass" },
      { key: "B", text: "Mengembalikan hasil baris sebagai array yang diindeks oleh nama kolom" },
      { key: "C", text: "Mengembalikan baris sebagai array numerik (0, 1, 2)" },
      { key: "D", text: "Menghapus data setelah dibaca" }
    ],
    correct_answer: "B",
    category: "Database / MySQL",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "PDO::FETCH_ASSOC memerintahkan PDO untuk mengembalikan baris sebagai array asosiatif dengan nama kolom tabel sebagai kunci array."
  },
  {
    id: 44,
    question: "Method PDO manakah yang digunakan untuk membatalkan seluruh perubahan query saat terjadi kegagalan dalam sebuah transaksi (database transaction)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$pdo->rollback()" },
      { key: "B", text: "$pdo->cancel()" },
      { key: "C", text: "$pdo->revert()" },
      { key: "D", text: "$pdo->undo()" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Method $pdo->rollBack() membatalkan seluruh query yang dilakukan sejak $pdo->beginTransaction() dipanggil jika terjadi error."
  },

  // --- 11. CRUD (Soal 45 - 48) ---
  {
    id: 45,
    question: "Dalam implementasi CRUD berbasis web, variabel superglobal PHP manakah yang digunakan untuk menangkap data formulir HTML dengan method='POST'?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$_GET" },
      { key: "B", text: "$_POST" },
      { key: "C", text: "$_REQUEST_BODY" },
      { key: "D", text: "$_DATA" }
    ],
    correct_answer: "B",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "$_POST adalah associative array yang memuat variabel yang dikirimkan via metode HTTP POST."
  },
  {
    id: 46,
    question: "Perhatikan potongan kode UPDATE pada modul CRUD berikut. Apa kelemahan fatal dari script ini?",
    codeSnippet: `<?php\n$id = $_POST['id'];\n$nama = $_POST['nama'];\n$sql = "UPDATE mahasiswa SET nama='$nama' WHERE id=$id";\n$conn->query($sql);\n?>`,
    options: [
      { key: "A", text: "Tidak ada kelemahan, kodenya bersih" },
      { key: "B", text: "Rentan terhadap serangan SQL Injection karena menggabungkan variabel langsung ke query tanpa sanitasi/prepared statement" },
      { key: "C", text: "Sintaks query UPDATE salah" },
      { key: "D", text: "Method POST tidak bisa digunakan untuk UPDATE" }
    ],
    correct_answer: "B",
    category: "CRUD",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Penggabungan string input pengguna secara langsung ke dalam query SQL membuka celah keamanan serius berupa SQL Injection."
  },
  {
    id: 47,
    question: "Setelah berhasil menyimpan data (operasi Create) pada file proses_tambah.php, kode apa yang digunakan untuk mengalihkan pengguna kembali ke halaman index.php?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "header('Location: index.php'); exit;" },
      { key: "B", text: "redirect('index.php');" },
      { key: "C", text: "goto index.php;" },
      { key: "D", text: "window.location = 'index.php';" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Fungsi header('Location: url') mengirimkan HTTP 302 redirect header, dan disarankan diikuti dengan exit/die agar script selanjutnya tidak dieksekusi."
  },
  {
    id: 48,
    question: "Fungsi bawaan PHP manakah yang wajib dipanggil sebelum mencetak data yang diinput pengguna ke halaman HTML guna mencegah serangan Cross-Site Scripting (XSS)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "strip_tags()" },
      { key: "B", text: "htmlspecialchars()" },
      { key: "C", text: "urlencode()" },
      { key: "D", text: "md5()" }
    ],
    correct_answer: "B",
    category: "CRUD",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "htmlspecialchars() mengkonversi karakter khusus seperti <, >, &, dan \" menjadi HTML entities sehingga browser tidak merendernya sebagai script berbahaya."
  },

  // --- 12. Error Handling (Soal 49 - 50) ---
  {
    id: 49,
    question: "Dalam struktur penanganan exception di PHP, blok apakah yang dijamin AKAN SELALU DIJALANKAN baik terjadi exception maupun tidak?",
    codeSnippet: `<?php\ntry {\n    // operasi berisiko\n} catch (Exception $e) {\n    // penanganan error\n} ______ {\n    // blok yang selalu berjalan\n}\n?>`,
    options: [
      { key: "A", text: "always" },
      { key: "B", text: "finally" },
      { key: "C", text: "end" },
      { key: "D", text: "default" }
    ],
    correct_answer: "B",
    category: "Error Handling",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Blok 'finally' selalu dieksekusi setelah blok try dan catch selesai, umumnya dimanfaatkan untuk membersihkan resource seperti menutup koneksi."
  },
  {
    id: 50,
    question: "Bagaimanakah cara mengkonfigurasi PDO agar melempar (throw) PDOException saat terjadi kesalahan sintaks query SQL?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);" },
      { key: "B", text: "$pdo->enableExceptions(true);" },
      { key: "C", text: "error_reporting(E_ALL);" },
      { key: "D", text: "$pdo->setDebugMode('strict');" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Dengan mengatur PDO::ATTR_ERRMODE ke PDO::ERRMODE_EXCEPTION, setiap kegagalan query PDO akan memunculkan instance PDOException yang dapat ditangkap dalam blok try-catch."
  }
];
