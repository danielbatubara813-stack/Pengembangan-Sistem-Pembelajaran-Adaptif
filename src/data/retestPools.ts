import { Question, PHPTopic } from '../types';
import { RETEST_QUESTIONS } from './retestQuestions';

// Pool B: 50 Soal Alternatif Berbeda untuk Retest Percobaan 2
export const RETEST_POOL_B: Question[] = [
  // 1. Dasar PHP
  {
    id: 201,
    question: "Apa fungsi dari directive declare(strict_types=1); dalam script PHP modern?",
    codeSnippet: "<?php\ndeclare(strict_types=1);\nfunction sum(int $a, int $b): int {\n    return $a + $b;\n}\n?>",
    options: [
      { key: "A", text: "Menegakkan pemeriksaan tipe data secara ketat tanpa konversi otomatis pada pemanggilan fungsi" },
      { key: "B", text: "Mengubah semua variabel global menjadi konstan" },
      { key: "C", text: "Memaksa penggunaan memori yang lebih sedikit" },
      { key: "D", text: "Mengaktifkan mode kompilasi bytecode Ahead-Of-Time" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "declare(strict_types=1) mencegah type coercion otomatis sehingga tipe argumen harus sesuai deklarasi."
  },
  {
    id: 202,
    question: "Konstanta manakah di bawah ini yang merupakan magic constant PHP untuk mengetahui nomor baris kode saat ini?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "__LINE__" },
      { key: "B", text: "__ROW__" },
      { key: "C", text: "__CURRENT_LINE__" },
      { key: "D", text: "__BARIS__" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "__LINE__ mengembalikan baris kode saat ini di mana konstanta tersebut dipanggil."
  },
  {
    id: 203,
    question: "Apa perbedaan mendasar antara include dan require saat file yang dipanggil tidak ditemukan?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "include mengeluarkan Warning dan script tetap berjalan, require menghasilkan Fatal Error dan menghentikan script" },
      { key: "B", text: "require hanya dipakai untuk file HTML, include untuk file PHP" },
      { key: "C", text: "include menghentikan script seketika, require tidak" },
      { key: "D", text: "Keduanya memiliki perilaku yang identik tanpa perbedaan" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "require menghasilkan E_COMPILE_ERROR / Fatal Error yang menghentikan script, sedangkan include hanya memicu E_WARNING."
  },
  {
    id: 204,
    question: "Manakah cara penulisan komentar multi-baris yang valid di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "/* Ini adalah komentar multi baris */" },
      { key: "B", text: "<!-- Ini adalah komentar multi baris -->" },
      { key: "C", text: "#! Ini adalah komentar multi baris !#" },
      { key: "D", text: "-- Ini adalah komentar multi baris --" }
    ],
    correct_answer: "A",
    category: "Dasar PHP",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Sintaks /* ... */ adalah standar penulisan komentar lebih dari satu baris dalam PHP."
  },

  // 2. Variabel dan Tipe Data
  {
    id: 205,
    question: "Apakah output dari kode PHP berikut saat memeriksa tipe data dengan gettype()?",
    codeSnippet: "<?php\n$val = 4.5;\nsettype($val, 'integer');\necho $val;\n?>",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "4.5" },
      { key: "C", text: "5" },
      { key: "D", text: "Error" }
    ],
    correct_answer: "A",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "settype($val, 'integer') memotong nilai float desimal (truncation) menjadi bilangan bulat 4."
  },
  {
    id: 206,
    question: "Tipe data apakah yang dihasilkan dari ekspresi perbandingan (5 > 3) di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "boolean" },
      { key: "B", text: "integer" },
      { key: "C", text: "string" },
      { key: "D", text: "null" }
    ],
    correct_answer: "A",
    category: "Variabel dan Tipe Data",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Ekspresi relasional menghasilkan nilai boolean true atau false."
  },
  {
    id: 207,
    question: "Bagaimana cara membuat variabel global dapat diakses di dalam lingkup lokal fungsi PHP?",
    codeSnippet: "<?php\n$counter = 10;\nfunction increment() {\n    // Lengkapi di sini\n    $counter++;\n}\n?>",
    options: [
      { key: "A", text: "global $counter; atau $GLOBALS['counter']" },
      { key: "B", text: "import $counter;" },
      { key: "C", text: "external $counter;" },
      { key: "D", text: "use($counter);" }
    ],
    correct_answer: "A",
    category: "Variabel dan Tipe Data",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Kata kunci global $counter atau superglobal $GLOBALS['counter'] digunakan untuk mengakses variabel lingkup global."
  },
  {
    id: 208,
    question: "Manakah yang merupakan penamaan variabel PHP yang TIDAK valid menurut spesifikasi?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$123user" },
      { key: "B", text: "$_user123" },
      { key: "C", text: "$user_123" },
      { key: "D", text: "$userOne" }
    ],
    correct_answer: "A",
    category: "Variabel dan Tipe Data",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Nama variabel di PHP tidak boleh diawali dengan angka setelah tanda $."
  },

  // 3. Operator
  {
    id: 209,
    question: "Apa hasil dari operator identik (===) jika membandingkan angka integer 0 dengan boolean false?",
    codeSnippet: "<?php\nvar_dump(0 === false);\n?>",
    options: [
      { key: "A", text: "bool(false)" },
      { key: "B", text: "bool(true)" },
      { key: "C", text: "0" },
      { key: "D", text: "Fatal Error" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator === memeriksa kesamaan nilai sekaligus tipe data. Karena tipe integer !== boolean, hasilnya adalah false."
  },
  {
    id: 210,
    question: "Apa output dari operator penggabungan assignment string (.=) berikut?",
    codeSnippet: "<?php\n$teks = 'Web ';\n$teks .= 'Modern';\necho $teks;\n?>",
    options: [
      { key: "A", text: "Web Modern" },
      { key: "B", text: "Web" },
      { key: "C", text: "Modern" },
      { key: "D", text: "Error" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Operator .= menambahkan string di sebelah kanan ke variabel sebelah kiri."
  },
  {
    id: 211,
    question: "Manakah operator logika PHP yang memiliki presedensi lebih rendah dari operator assignment (=)?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "and" },
      { key: "B", text: "&&" },
      { key: "C", text: "||" },
      { key: "D", text: "!" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Kata kunci 'and' memiliki presedensi lebih rendah dari operator penugasan '=', berbeda dari '&&'."
  },
  {
    id: 212,
    question: "Berapakah hasil evaluasi ekspresi aritmatika 10 - 2 * 3 di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "24" },
      { key: "C", text: "8" },
      { key: "D", text: "16" }
    ],
    correct_answer: "A",
    category: "Operator",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Operator perkalian (*) memiliki presedensi lebih tinggi daripada pengurangan (-), sehingga 2 * 3 dihitung lebih dulu."
  },

  // 4. Conditional
  {
    id: 213,
    question: "Dalam struktur match di PHP 8, apa yang terjadi jika tidak ada pola yang cocok dan default arm tidak disediakan?",
    codeSnippet: "<?php\n$val = 99;\n$result = match($val) {\n    1 => 'Satu',\n    2 => 'Dua'\n};\n?>",
    options: [
      { key: "A", text: "Menghasilkan UnhandledMatchError exception" },
      { key: "B", text: "Mengembalikan nilai null secara diam-diam" },
      { key: "C", text: "Mengembalikan string kosong" },
      { key: "D", text: "Mengeksekusi baris pertama" }
    ],
    correct_answer: "A",
    category: "Conditional",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "match expression PHP 8 bersifat exhaustive; jika tidak ada kondisi cocok dan tidak ada default, UnhandledMatchError dilempar."
  },
  {
    id: 214,
    question: "Apa output dari ternary operator bersarang berikut?",
    codeSnippet: "<?php\n$score = 75;\necho $score >= 80 ? 'A' : ($score >= 70 ? 'B' : 'C');\n?>",
    options: [
      { key: "A", text: "B" },
      { key: "B", text: "A" },
      { key: "C", text: "C" },
      { key: "D", text: "Error" }
    ],
    correct_answer: "A",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Karena score = 75, kondisi pertama false, lalu masuk ke cabang kedua yang bernilai true (>= 70) menghasilkan 'B'."
  },
  {
    id: 215,
    question: "Pernyataan manakah yang wajib ditulis di dalam blok case switch PHP agar eksekusi tidak berlanjut ke case berikutnya?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "break;" },
      { key: "B", text: "stop;" },
      { key: "C", text: "continue;" },
      { key: "D", text: "exit;" }
    ],
    correct_answer: "A",
    category: "Conditional",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Perintah break; mencegah fall-through ke case berikutnya pada switch statement."
  },
  {
    id: 216,
    question: "Apa output dari conditional if berikut di PHP?",
    codeSnippet: "<?php\nif ('0') {\n    echo 'True';\n} else {\n    echo 'False';\n}\n?>",
    options: [
      { key: "A", text: "False" },
      { key: "B", text: "True" },
      { key: "C", text: "0" },
      { key: "D", text: "Parse error" }
    ],
    correct_answer: "A",
    category: "Conditional",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Dalam PHP, string '0' dikonversi menjadi boolean FALSE menurut aturan type juggling."
  },

  // 5. Looping
  {
    id: 217,
    question: "Bagaimanakah cara melompati 2 tingkat perulangan bersarang sekaligus di PHP?",
    codeSnippet: "<?php\nfor ($i = 0; $i < 5; $i++) {\n    for ($j = 0; $j < 5; $j++) {\n        if ($j === 2) {\n            // Lewati iterasi luar\n            continue 2;\n        }\n    }\n}\n?>",
    options: [
      { key: "A", text: "continue 2;" },
      { key: "B", text: "break 2;" },
      { key: "C", text: "skip 2;" },
      { key: "D", text: "jump 2;" }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "continue 2; melompati sisa iterasi saat ini dan langsung berpindah ke iterasi berikutnya dari perulangan tingkat ke-2."
  },
  {
    id: 218,
    question: "Perulangan manakah yang dijamin mengeksekusi blok kodenya minimal SATU kali meskipun kondisi awalnya false?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "do-while" },
      { key: "B", text: "while" },
      { key: "C", text: "for" },
      { key: "D", text: "foreach" }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "do-while melakukan pengecekan kondisi di akhir perulangan, sehingga blok kode selalu dieksekusi minimal satu kali."
  },
  {
    id: 219,
    question: "Berapa kali loop for ($k = 1; $k <= 10; $k += 3) akan dijalankan?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "4 kali ($k = 1, 4, 7, 10)" },
      { key: "B", text: "3 kali" },
      { key: "C", text: "10 kali" },
      { key: "D", text: "Tak terhingga" }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Nilai $k akan bernilai 1, 4, 7, 10 (4 iterasi), dan berhenti ketika bernilai 13."
  },
  {
    id: 220,
    question: "Apa output dari perulangan foreach yang memodifikasi nilai array dengan referensi (&)?",
    codeSnippet: "<?php\n$nums = [1, 2];\nforeach ($nums as &$val) {\n    $val *= 2;\n}\nunset($val);\necho $nums[0];\n?>",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "1" },
      { key: "C", text: "4" },
      { key: "D", text: "Error" }
    ],
    correct_answer: "A",
    category: "Looping",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Menggunakan tanda & pada $val mengubah elemen asli array secara langsung dari 1 menjadi 2."
  },

  // 6. Array
  {
    id: 221,
    question: "Fungsi bawaan PHP apakah yang digunakan untuk menggabungkan dua atau lebih array menjadi satu array baru?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "array_merge()" },
      { key: "B", text: "array_join()" },
      { key: "C", text: "array_combine()" },
      { key: "D", text: "array_concat()" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "array_merge() menggabungkan elemen satu atau lebih array secara berurutan."
  },
  {
    id: 222,
    question: "Apa output dari fungsi array_map() berikut?",
    codeSnippet: "<?php\n$arr = [1, 2, 3];\n$res = array_map(fn($n) => $n * 3, $arr);\necho $res[1];\n?>",
    options: [
      { key: "A", text: "6" },
      { key: "B", text: "3" },
      { key: "C", text: "9" },
      { key: "D", text: "2" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "array_map mengalikan setiap elemen dengan 3: [3, 6, 9]. Elemen pada indeks ke-1 adalah 6."
  },
  {
    id: 223,
    question: "Manakah fungsi PHP yang digunakan untuk menyaring (filter) elemen array berdasarkan fungsi callback bernilai boolean?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "array_filter()" },
      { key: "B", text: "array_search()" },
      { key: "C", text: "array_reduce()" },
      { key: "D", text: "array_walk()" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "array_filter() menyaring elemen array hanya yang mengembalikan nilai true pada fungsi callback."
  },
  {
    id: 224,
    question: "Bagaimanakah cara mengambil dan sekaligus menghapus elemen TERAKHIR dari sebuah array di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "array_pop()" },
      { key: "B", text: "array_shift()" },
      { key: "C", text: "array_unshift()" },
      { key: "D", text: "array_slice()" }
    ],
    correct_answer: "A",
    category: "Array",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "array_pop() memotong elemen terakhir dari array dan mengembalikan nilainya."
  },

  // 7. Function
  {
    id: 225,
    question: "Manakah sintaks yang benar untuk anonymous function arrow (short closure) di PHP 7.4+?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "fn($x) => $x * 2" },
      { key: "B", text: "($x) -> $x * 2" },
      { key: "C", text: "lambda($x): $x * 2" },
      { key: "D", text: "function($x) => $x * 2" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Arrow function di PHP menggunakan kata kunci fn diikuti argumen dan tanda =>."
  },
  {
    id: 226,
    question: "Apa fungsi dari return type void pada deklarasi fungsi PHP?",
    codeSnippet: "<?php\nfunction logData(string $msg): void {\n    echo $msg;\n}\n?>",
    options: [
      { key: "A", text: "Menegaskan bahwa fungsi tersebut tidak boleh mengembalikan nilai apapun (atau hanya return;)" },
      { key: "B", text: "Menandakan fungsi dapat mengembalikan string kosong" },
      { key: "C", text: "Fungsi otomatis mengembalikan integer 0" },
      { key: "D", text: "Fungsi bersifat private" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Return type void menyatakan bahwa fungsi tidak mengembalikan nilai apapun."
  },
  {
    id: 227,
    question: "Bagaimana cara mendefinisikan variadic parameter agar fungsi dapat menerima jumlah argumen yang dinamis?",
    codeSnippet: "<?php\nfunction total(...$numbers) {\n    return array_sum($numbers);\n}\n?>",
    options: [
      { key: "A", text: "Menggunakan tanda titik tiga (...) di depan nama parameter" },
      { key: "B", text: "Menggunakan tanda bintang (*) di depan parameter" },
      { key: "C", text: "Menggunakan keyword args" },
      { key: "D", text: "Menggunakan keyword dynamic" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator spread / splat (...) digunakan untuk menangkap argumen tak terbatas ke dalam satu array."
  },
  {
    id: 228,
    question: "Dalam PHP 8, fitur apa yang memungkinkan pengiriman argumen ke fungsi berdasarkan nama parameternya tanpa terikat urutan?",
    codeSnippet: "<?php\nfunction setting($host, $port = 3306, $debug = false) {}\nsetting(host: 'localhost', debug: true);\n?>",
    options: [
      { key: "A", text: "Named Arguments" },
      { key: "B", text: "Keyed Parameters" },
      { key: "C", text: "Optional Invocation" },
      { key: "D", text: "Strict Arguments" }
    ],
    correct_answer: "A",
    category: "Function",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Named Arguments di PHP 8 memungkinkan pengoperan nilai parameter berdasarkan nama spesifiknya."
  },

  // 8. String
  {
    id: 229,
    question: "Fungsi string manakah yang aman digunakan untuk memproses string multi-byte (seperti huruf beraksen / UTF-8) di PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "mb_strlen()" },
      { key: "B", text: "strlen()" },
      { key: "C", text: "str_utf8()" },
      { key: "D", text: "string_len()" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Fungsi mb_* (Multi-Byte String) menangani karakter UTF-8 yang terdiri lebih dari 1 byte secara akurat."
  },
  {
    id: 230,
    question: "Apa output dari script fungsi str_replace() berikut?",
    codeSnippet: "<?php\n$teks = 'PHP 7 adalah cepat';\necho str_replace('7', '8.3', $teks);\n?>",
    options: [
      { key: "A", text: "PHP 8.3 adalah cepat" },
      { key: "B", text: "PHP 7 adalah cepat" },
      { key: "C", text: "PHP 8.3" },
      { key: "D", text: "Error" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "str_replace menggantikan kemunculan substring '7' dengan '8.3'."
  },
  {
    id: 231,
    question: "Manakah fungsi PHP yang digunakan untuk memecah string menjadi array berdasarkan karakter delimiter tertentu?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "explode()" },
      { key: "B", text: "implode()" },
      { key: "C", text: "str_split_words()" },
      { key: "D", text: "join()" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "explode(separator, string) memecah string menjadi array elemen terpisah."
  },
  {
    id: 232,
    question: "Fungsi bawaan PHP 8 apakah yang memeriksa apakah suatu string DIAWALI oleh substring tertentu secara case-sensitive?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "str_starts_with()" },
      { key: "B", text: "strpos() === 0" },
      { key: "C", text: "string_begin()" },
      { key: "D", text: "str_first()" }
    ],
    correct_answer: "A",
    category: "String",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "str_starts_with() diperkenalkan di PHP 8 untuk memeriksa awalan string secara langsung dan ekspresif."
  },

  // 9. Object Oriented Programming / OOP
  {
    id: 233,
    question: "Dalam PHP 8.2, apa keuntungan utama menerapkan kata kunci readonly pada deklarasi sebuah class?",
    codeSnippet: "<?php\nreadonly class UserDTO {\n    public function __construct(public string $name, public string $email) {}\n}\n?>",
    options: [
      { key: "A", text: "Semua properti otomatis readonly dan mencegah penambahan dynamic properties secara otomatis" },
      { key: "B", text: "Class tidak dapat diwariskan" },
      { key: "C", text: "Class tidak dapat diinstansiasi dengan keyword new" },
      { key: "D", text: "Semua method otomatis menjadi static" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Readonly class di PHP 8.2 menjadikan seluruh properti bernilai readonly dan melarang dynamic property."
  },
  {
    id: 234,
    question: "Apakah kata kunci yang digunakan untuk mencegah suatu method pada class agar tidak dapat di-override oleh child class?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "final" },
      { key: "B", text: "sealed" },
      { key: "C", text: "static" },
      { key: "D", text: "locked" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Keyword final pada method atau class mencegah method tersebut di-override atau class tersebut di-extend."
  },
  {
    id: 235,
    question: "Manakah yang merupakan definisi yang tepat dari Interface dalam pemrograman OOP PHP?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Kontrak kerja yang hanya berisi deklarasi method publik tanpa tubuh/implementasi kode" },
      { key: "B", text: "Class yang memiliki properti private dan protected" },
      { key: "C", text: "Fungsi global yang dapat dipanggil di mana saja" },
      { key: "D", text: "Class yang dapat langsung diinstansiasi berkali-kali" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Interface mendefinisikan kontrak method publik yang wajib diimplementasikan oleh class turunan."
  },
  {
    id: 236,
    question: "Bagaimanakah cara mengakses konstanta class dari dalam method class itu sendiri?",
    codeSnippet: "<?php\nclass AppConfig {\n    const VERSION = '2.0';\n    public function getVersion() {\n        return self::VERSION;\n    }\n}\n?>",
    options: [
      { key: "A", text: "self::VERSION" },
      { key: "B", text: "$this->VERSION" },
      { key: "C", text: "parent::VERSION" },
      { key: "D", text: "$this::VERSION" }
    ],
    correct_answer: "A",
    category: "Object Oriented Programming / OOP",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Operator scope resolution self:: digunakan untuk mengakses konstanta atau properti static dalam class."
  },

  // 10. Database / MySQL
  {
    id: 237,
    question: "Bagaimanakah cara mengaktifkan exception mode pada koneksi PDO agar error database otomatis melempar PDOException?",
    codeSnippet: "<?php\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n?>",
    options: [
      { key: "A", text: "$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);" },
      { key: "B", text: "$pdo->setExceptionHandler('PDO');" },
      { key: "C", text: "$pdo->throwErrors(true);" },
      { key: "D", text: "$pdo->enableExceptions();" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Pengaturan PDO::ERRMODE_EXCEPTION wajib diaktifkan agar error SQL ditangani secara aman dengan try-catch."
  },
  {
    id: 238,
    question: "Mengapa prepared statement lebih aman daripada langsung menggabungkan variabel string ke query SQL?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Karena memisahkan kompilasi logika query SQL dari parsing data masukan pengguna sehingga kebal SQL Injection" },
      { key: "B", text: "Karena otomatis mengenkripsi database" },
      { key: "C", text: "Karena query dijalankan di browser client" },
      { key: "D", text: "Karena tidak memerlukan koneksi TCP/IP" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Prepared statements memisahkan template instruksi SQL dari parameter nilai sehingga data tidak pernah dievaluasi sebagai kode SQL."
  },
  {
    id: 239,
    question: "Fungsi fetch PDO manakah yang mengembalikan setiap baris hasil query sebagai objek generik bertipe stdClass?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "PDO::FETCH_OBJ" },
      { key: "B", text: "PDO::FETCH_ASSOC" },
      { key: "C", text: "PDO::FETCH_NUM" },
      { key: "D", text: "PDO::FETCH_CLASS" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "PDO::FETCH_OBJ memetakan kolom database menjadi properti dari objek anonim stdClass."
  },
  {
    id: 240,
    question: "Metode PDO apakah yang digunakan untuk memulai sebuah database transaction secara aman?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$pdo->beginTransaction()" },
      { key: "B", text: "$pdo->startTransaction()" },
      { key: "C", text: "$pdo->createTransaction()" },
      { key: "D", text: "$pdo->lockTable()" }
    ],
    correct_answer: "A",
    category: "Database / MySQL",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "$pdo->beginTransaction() mematikan mode autocommit dan memulai blok transaksi baru."
  },

  // 11. CRUD
  {
    id: 241,
    question: "Untuk operasi UPDATE data dengan prepared statement, metode apakah yang mengembalikan jumlah baris data yang terpengaruh?",
    codeSnippet: "<?php\n$stmt = $pdo->prepare('UPDATE users SET status = 1 WHERE role = ?');\n$stmt->execute(['admin']);\n$count = $stmt->rowCount();\n?>",
    options: [
      { key: "A", text: "$stmt->rowCount()" },
      { key: "B", text: "$stmt->numRows()" },
      { key: "C", text: "$stmt->affectedRows()" },
      { key: "D", text: "$stmt->count()" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "rowCount() pada PDOStatement mengembalikan jumlah baris yang terdampak oleh pernyataan DELETE, INSERT, atau UPDATE."
  },
  {
    id: 242,
    question: "Bagaimanakah cara mengambil ID auto-increment yang baru saja dibuat setelah query INSERT dijalankan di PDO?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "$pdo->lastInsertId()" },
      { key: "B", text: "$stmt->getInsertId()" },
      { key: "C", text: "$pdo->insertedId" },
      { key: "D", text: "$pdo->currentId()" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "lastInsertId() pada objek PDO mengembalikan ID baris terakhir yang dimasukkan ke dalam database."
  },
  {
    id: 243,
    question: "Dalam implementasi form update data di web, mengapa validasi CSRF token wajib dilakukan sebelum query UPDATE dieksekusi?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Untuk memastikan permintaan perubahan data sah berasal dari form aplikasi sendiri, bukan dari situs peretas pihak ketiga" },
      { key: "B", text: "Untuk mempercepat query update di MySQL" },
      { key: "C", text: "Untuk mengkompresi ukuran payload data" },
      { key: "D", text: "Agar database tidak penuh" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "CSRF token memvalidasi origin integritas pengguna agar penyerang tidak dapat mengeksekusi aksi tanpa izin korban."
  },
  {
    id: 244,
    question: "Klausa apa yang wajib disertakan pada query DELETE agar tidak menghapus seluruh isi tabel secara tidak sengaja?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "WHERE" },
      { key: "B", text: "HAVING" },
      { key: "C", text: "LIMIT" },
      { key: "D", text: "FROM" }
    ],
    correct_answer: "A",
    category: "CRUD",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Klausa WHERE membatasi penghapusan hanya pada baris data yang memenuhi kondisi kriteria tertentu."
  },

  // 12. Error Handling
  {
    id: 245,
    question: "Bagaimanakah cara menangani beberapa jenis exception berbeda dalam satu blok catch di PHP modern?",
    codeSnippet: "<?php\ntry {\n    $service->execute();\n} catch (DatabaseException | NetworkException $e) {\n    logger($e->getMessage());\n}\n?>",
    options: [
      { key: "A", text: "Memisahkan class exception menggunakan karakter pipa (|)" },
      { key: "B", text: "Memisahkan dengan operator OR" },
      { key: "C", text: "Menggunakan array multi-catch ([...])" },
      { key: "D", text: "Tidak dimungkinkan dalam PHP" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "Sintaks catch (ExceptionA | ExceptionB $e) memungkinkan satu blok menangani multi-exception secara seragam."
  },
  {
    id: 246,
    question: "Blok kode apakah yang selalu dipastikan berjalan di akhir struktur try-catch, terlepas ada atau tidaknya exception yang dilempar?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "finally" },
      { key: "B", text: "always" },
      { key: "C", text: "end" },
      { key: "D", text: "default" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Blok finally selalu dieksekusi setelah try dan catch selesai, cocok untuk membersihkan resource koneksi atau file handler."
  },
  {
    id: 247,
    question: "Di lingkungan production, mengapa direktif display_errors pada php.ini harus disetel ke 'Off'?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Untuk mencegah kebocoran informasi sensitif (seperti path direktori, query, atau kredensial database) ke pengunjung" },
      { key: "B", text: "Agar server tidak kehabisan RAM" },
      { key: "C", text: "Agar PHP berjalan 10 kali lebih cepat" },
      { key: "D", text: "Karena browser tidak mendukung tampilan error" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Menampilkan error detail di production membahayakan keamanan aplikasi (information leakage)."
  },
  {
    id: 248,
    question: "Interface dasar di PHP yang diimplementasikan oleh semua Error dan Exception di tingkat inti (core) engine adalah:",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "Throwable" },
      { key: "B", text: "Catchable" },
      { key: "C", text: "BaseException" },
      { key: "D", text: "ErrorHandler" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Advanced",
    type: "multiple_choice",
    explanation: "Throwable adalah interface dasar tingkat atas yang menaungi class Exception dan Error sejak PHP 7.0."
  },
  {
    id: 249,
    question: "Fungsi bawaan PHP apakah yang digunakan untuk mendaftarkan fungsi custom error handler buatan sendiri?",
    codeSnippet: undefined,
    options: [
      { key: "A", text: "set_error_handler()" },
      { key: "B", text: "register_error()" },
      { key: "C", text: "add_error_listener()" },
      { key: "D", text: "catch_all_errors()" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Intermediate",
    type: "multiple_choice",
    explanation: "set_error_handler() mendaftarkan callback untuk menangani error tingkat runtime."
  },
  {
    id: 250,
    question: "Manakah cara melempar (throw) custom exception baru dengan pesan dan kode error yang tepat di PHP?",
    codeSnippet: "<?php\nthrow new InvalidArgumentException('Nilai saldo tidak boleh negatif', 400);\n?>",
    options: [
      { key: "A", text: "throw new InvalidArgumentException('Pesan', 400);" },
      { key: "B", text: "raise InvalidArgumentException('Pesan');" },
      { key: "C", text: "trigger InvalidArgumentException('Pesan');" },
      { key: "D", text: "return new Exception('Pesan');" }
    ],
    correct_answer: "A",
    category: "Error Handling",
    difficulty: "Beginner",
    type: "multiple_choice",
    explanation: "Kata kunci throw new ClassName($message, $code) adalah standar melempar exception di PHP."
  }
];

const shuffleWithSeed = <T>(items: T[], seed: number): T[] => {
  const copy = [...items];
  let nextSeed = seed;

  for (let i = copy.length - 1; i > 0; i--) {
    nextSeed = (nextSeed * 9301 + 49297) % 233280;
    const j = Math.floor((nextSeed / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const prioritizeQuestionsBySkillGap = (pool: Question[], skillGaps: string[]) => {
  if (!skillGaps.length) return pool;

  const normalizedSkillGaps = skillGaps.map((gap) => String(gap).trim().toLowerCase());
  const prioritized = pool.filter((question) => {
    const questionCategory = String(question.category || '').trim().toLowerCase();
    return normalizedSkillGaps.some((gap) =>
      questionCategory.includes(gap) || gap.includes(questionCategory)
    );
  });

  const remaining = pool.filter((question) => !prioritized.includes(question));
  return prioritized.length ? [...prioritized, ...remaining] : pool;
};

// Smart Rotator: Memilih 50 soal yang berbeda untuk setiap percobaan dan memasukkan soal AI kustom jika ada
export function getRetestQuestionsForAttempt(
  attempt: number,
  skillGaps: string[] = [],
  customAiQuestions: Question[] = []
): Question[] {
  const isEven = attempt % 2 === 0;
  const basePool = isEven ? [...RETEST_POOL_B] : [...RETEST_QUESTIONS];

  const prioritizedPool = prioritizeQuestionsBySkillGap(basePool, skillGaps);
  const rotationSeed = Math.abs(attempt * 97 + skillGaps.join('').length * 13 + 17);
  const rotatedPool = shuffleWithSeed(prioritizedPool, rotationSeed);

  if (customAiQuestions && customAiQuestions.length > 0) {
    const poolCopy = [...rotatedPool];
    customAiQuestions.forEach((aiQ, i) => {
      const targetIdx = poolCopy.findIndex((q) => q.category === aiQ.category);
      if (targetIdx !== -1) {
        poolCopy[targetIdx] = {
          ...aiQ,
          id: 500 + (attempt * 10) + i
        };
      }
    });
    return poolCopy.map((q, idx) => ({
      ...q,
      id: (attempt * 100) + (idx + 1)
    }));
  }

  return rotatedPool.map((q, idx) => ({
    ...q,
    id: (attempt * 100) + (idx + 1)
  }));
}
