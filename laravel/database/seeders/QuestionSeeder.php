<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 50 Soal Assessment Awal + 50 Soal Retest (Total 100 Soal PHP).
     */
    public function run(): void
    {
        // 50 Soal Assessment Awal
        $initialQuestions = [
            [
                'question' => 'Bagaimanakah tag pembuka standar yang direkomendasikan untuk menulis script PHP menurut PSR-12?',
                'code_snippet' => null,
                'options' => ['A' => '<?php', 'B' => '<%', 'C' => '<script language="php">', 'D' => '<?'],
                'correct_answer' => 'A',
                'category' => 'Dasar PHP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Tag pembuka standar dan wajib menurut standar PSR-12 adalah <?php.'
            ],
            [
                'question' => 'Perhatikan baris kode PHP berikut. Apa keluaran dari script tersebut?',
                'code_snippet' => "<?php\necho \"Hello\", \" \", \"World!\";\n?>",
                'options' => ['A' => 'Syntax Error', 'B' => 'Hello World!', 'C' => 'Hello, World!', 'D' => 'Array'],
                'correct_answer' => 'B',
                'category' => 'Dasar PHP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'echo adalah language construct yang dapat menerima multi-parameter dipisahkan tanda koma.'
            ],
            [
                'question' => 'Manakah pernyataan yang BENAR mengenai perbedaan mendasar antara echo dan print dalam PHP?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'print tidak dapat mencetak string',
                    'B' => 'echo mengembalikan nilai 1, sedangkan print tidak',
                    'C' => 'print selalu mengembalikan nilai integer 1 dan dapat digunakan dalam ekspresi, sedangkan echo void',
                    'D' => 'echo hanya berjalan di CLI'
                ],
                'correct_answer' => 'C',
                'category' => 'Dasar PHP',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'print bertindak seperti ekspresi yang selalu mengembalikan 1, sedangkan echo tidak mengembalikan nilai.'
            ],
            [
                'question' => 'Cara penulisan komentar multi-baris yang valid di PHP adalah:',
                'code_snippet' => null,
                'options' => ['A' => '<!-- Komentar -->', 'B' => '/* Komentar */', 'C' => '#* Komentar *#', 'D' => '// Komentar //'],
                'correct_answer' => 'B',
                'category' => 'Dasar PHP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Komentar multi-baris PHP dibuka dengan /* dan ditutup dengan */.'
            ],
            [
                'question' => 'Manakah nama variabel berikut yang VALID dalam aturan sintaks PHP?',
                'code_snippet' => null,
                'options' => ['A' => '$2user', 'B' => '$user-name', 'C' => '$_user_123', 'D' => '$user.score'],
                'correct_answer' => 'C',
                'category' => 'Variabel dan Tipe Data',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Variabel diawali $, huruf atau underscore, bukan angka atau tanda minus/titik.'
            ],
            [
                'question' => 'Apa output dari kode pengecekan tipe data berikut?',
                'code_snippet' => "<?php\n\$val = \"100\" + 20;\necho gettype(\$val);\n?>",
                'options' => ['A' => 'string', 'B' => 'integer', 'C' => 'double', 'D' => 'TypeError exception'],
                'correct_answer' => 'B',
                'category' => 'Variabel dan Tipe Data',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Type juggling otomatis mengonversi string numerik menjadi integer.'
            ],
            [
                'question' => 'Apakah hasil keluaran dari script perbandingan konstanta berikut?',
                'code_snippet' => "<?php\ndefine(\"SITE_NAME\", \"AdaptifAI\");\n\$name = \"SITE_NAME\";\necho constant(\$name);\n?>",
                'options' => ['A' => 'SITE_NAME', 'B' => '$name', 'C' => 'AdaptifAI', 'D' => 'Undefined variable'],
                'correct_answer' => 'C',
                'category' => 'Variabel dan Tipe Data',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Fungsi constant() mengambil nilai konstanta yang namanya disimpan di dalam string variabel.'
            ],
            [
                'question' => 'Tipe data khusus apa di PHP yang merepresentasikan variabel tanpa nilai dan case-insensitive?',
                'code_snippet' => null,
                'options' => ['A' => 'void', 'B' => 'NULL', 'C' => 'undefined', 'D' => 'empty'],
                'correct_answer' => 'B',
                'category' => 'Variabel dan Tipe Data',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'NULL adalah tipe data spesial di PHP yang menandakan ketiadaan nilai.'
            ],
            [
                'question' => 'Apa output dari perbandingan strict identity berikut?',
                'code_snippet' => "<?php\n\$a = 5;\n\$b = \"5\";\nvar_dump(\$a === \$b);\n?>",
                'options' => ['A' => 'bool(true)', 'B' => 'bool(false)', 'C' => 'int(1)', 'D' => 'null'],
                'correct_answer' => 'B',
                'category' => 'Operator',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Operator === membandingkan kesamaan nilai dan kesamaan tipe data.'
            ],
            [
                'question' => 'Apa nilai dari $result pada penggunaan operator Null Coalescing (??) berikut?',
                'code_snippet' => "<?php\n\$data = ['name' => null];\n\$result = \$data['name'] ?? 'Anonim';\necho \$result;\n?>",
                'options' => ['A' => 'null', 'B' => 'Anonim', 'C' => 'Notice: Undefined index', 'D' => 'false'],
                'correct_answer' => 'B',
                'category' => 'Operator',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Operator ?? mengembalikan operand kedua jika operand pertama bernilai null.'
            ],
            [
                'question' => 'Perhatikan penggunaan spaceship operator (<=>) pada PHP 7+. Apa outputnya?',
                'code_snippet' => "<?php\necho 15 <=> 20;\n?>",
                'options' => ['A' => '1', 'B' => '0', 'C' => '-1', 'D' => 'false'],
                'correct_answer' => 'C',
                'category' => 'Operator',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => '15 <=> 20 mengembalikan -1 karena 15 lebih kecil dari 20.'
            ],
            [
                'question' => 'Apa output dari operasi pre-increment dan post-increment berikut?',
                'code_snippet' => "<?php\n\$x = 10;\n\$y = ++\$x + \$x++;\necho \"\$x dan \$y\";\n?>",
                'options' => ['A' => '12 dan 22', 'B' => '11 dan 21', 'C' => '12 dan 23', 'D' => '10 dan 20'],
                'correct_answer' => 'A',
                'category' => 'Operator',
                'difficulty' => 'Advanced',
                'exam_type' => 'initial',
                'explanation' => '++$x menaikkan x jadi 11. Lalu $x++ mengembalikan 11 dan menaikkan $x jadi 12. Total $y = 11 + 11 = 22.'
            ],
            [
                'question' => 'Perhatikan switch statement berikut. Berapakah nilai yang dicetak?',
                'code_snippet' => "<?php\n\$score = 80;\nswitch (true) {\n    case \$score >= 85:\n        echo \"A\"; break;\n    case \$score >= 75:\n        echo \"B\"; break;\n    default:\n        echo \"C\";\n}\n?>",
                'options' => ['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'Error sintaks'],
                'correct_answer' => 'B',
                'category' => 'Conditional',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => '80 >= 75 adalah true, maka case tersebut cocok dan mencetak B.'
            ],
            [
                'question' => 'Apa keunggulan ekspresi match (PHP 8) dibandingkan struktur switch tradisional?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'match menggunakan strict comparison (===) dan langsung mengembalikan nilai tanpa butuh break',
                    'B' => 'match lebih lambat namun multi-type',
                    'C' => 'match memperbolehkan fall-through tanpa break',
                    'D' => 'match hanya untuk string'
                ],
                'correct_answer' => 'A',
                'category' => 'Conditional',
                'difficulty' => 'Advanced',
                'exam_type' => 'initial',
                'explanation' => 'match di PHP 8 mengevaluasi strict comparison dan mengembalikan nilai langsung.'
            ],
            [
                'question' => 'Apa output dari ternary operator bersarang berikut?',
                'code_snippet' => "<?php\n\$role = 'editor';\n\$access = \$role === 'admin' ? 'Penuh' : (\$role === 'editor' ? 'Terbatas' : 'Tolak');\necho \$access;\n?>",
                'options' => ['A' => 'Penuh', 'B' => 'Terbatas', 'C' => 'Tolak', 'D' => 'null'],
                'correct_answer' => 'B',
                'category' => 'Conditional',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => '$role adalah editor sehingga kondisi cabang kedua terpenuhi.'
            ],
            [
                'question' => 'Manakah nilai berikut yang dievaluasi sebagai TRUE oleh kondisi if di PHP?',
                'code_snippet' => null,
                'options' => ['A' => '"0"', 'B' => '[]', 'C' => '"-1"', 'D' => '0.0'],
                'correct_answer' => 'C',
                'category' => 'Conditional',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'String "-1" bernilai truthy di PHP.'
            ],
            [
                'question' => 'Berapa kali perulangan do...while dipastikan akan dieksekusi minimal?',
                'code_snippet' => null,
                'options' => ['A' => '0 kali', 'B' => '1 kali', 'C' => '2 kali', 'D' => 'Tergantung nilai'],
                'correct_answer' => 'B',
                'category' => 'Looping',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'do-while memeriksa kondisi di akhir sehingga minimal berjalan 1 kali.'
            ],
            [
                'question' => 'Perhatikan potongan kode looping berikut. Apa keluaran yang dihasilkan?',
                'code_snippet' => "<?php\nfor (\$i = 1; \$i <= 5; \$i++) {\n    if (\$i === 3) continue;\n    if (\$i === 5) break;\n    echo \$i;\n}\n?>",
                'options' => ['A' => '1234', 'B' => '124', 'C' => '1245', 'D' => '12'],
                'correct_answer' => 'B',
                'category' => 'Looping',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Saat 3 dilewati continue, saat 5 dihentikan break, mencetak 124.'
            ],
            [
                'question' => 'Apa output dari perulangan foreach dengan referensi (&) berikut?',
                'code_snippet' => "<?php\n\$nums = [1, 2, 3];\nforeach (\$nums as &\$val) {\n    \$val *= 2;\n}\nunset(\$val);\necho implode(\",\", \$nums);\n?>",
                'options' => ['A' => '1,2,3', 'B' => '2,4,6', 'C' => '2,2,3', 'D' => 'Conversion error'],
                'correct_answer' => 'B',
                'category' => 'Looping',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Referensi & langsung memodifikasi elemen asli array.'
            ],
            [
                'question' => 'Dalam PHP, parameter numerik opsional pada statement break 2 berfungsi untuk:',
                'code_snippet' => null,
                'options' => [
                    'A' => 'Menunggu 2 detik',
                    'B' => 'Keluar dari 2 level struktur looping bersarang sekaligus',
                    'C' => 'Mengulangi loop 2 kali',
                    'D' => 'Melewati 2 iterasi'
                ],
                'correct_answer' => 'B',
                'category' => 'Looping',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'break N keluar dari N struktur loop terbungkus.'
            ],
            [
                'question' => 'Fungsi bawaan PHP manakah yang digunakan untuk menghitung jumlah elemen dalam array?',
                'code_snippet' => null,
                'options' => ['A' => 'array_length()', 'B' => 'count()', 'C' => 'size()', 'D' => 'len()'],
                'correct_answer' => 'B',
                'category' => 'Array',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'count() menghitung jumlah elemen di dalam array.'
            ],
            [
                'question' => 'Perhatikan kode manipulasi array berikut. Apa nilai dari $result["b"]?',
                'code_snippet' => "<?php\n\$arr1 = [\"a\" => 1, \"b\" => 2];\n\$arr2 = [\"b\" => 99, \"c\" => 3];\n\$result = \$arr1 + \$arr2;\necho \$result[\"b\"];\n?>",
                'options' => ['A' => '99', 'B' => '2', 'C' => '101', 'D' => 'Fatal error'],
                'correct_answer' => 'B',
                'category' => 'Array',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Operator union (+) mempertahankan kunci array kiri jika terjadi bentrok.'
            ],
            [
                'question' => 'Apa fungsi dari array_map() dalam PHP?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'Menyaring elemen array berdasarkan callback',
                    'B' => 'Menerapkan fungsi callback ke setiap elemen array dan mengembalikan array baru',
                    'C' => 'Mengurutkan geolokasi',
                    'D' => 'Menggabungkan array'
                ],
                'correct_answer' => 'B',
                'category' => 'Array',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'array_map mentransformasi setiap elemen array dengan fungsi callback.'
            ],
            [
                'question' => 'Fungsi bawaan untuk memeriksa apakah sebuah kunci (key) ada di dalam array asosiatif?',
                'code_snippet' => null,
                'options' => ['A' => 'in_array()', 'B' => 'array_search()', 'C' => 'array_key_exists()', 'D' => 'has_key()'],
                'correct_answer' => 'C',
                'category' => 'Array',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'array_key_exists mengecek indeks/key ada di array bahkan jika nilainya null.'
            ],
            [
                'question' => 'Perhatikan array_filter berikut. Elemen apa yang tersisa dalam array hasil?',
                'code_snippet' => "<?php\n\$data = [0, 12, false, \"PHP\", \"\", null, 45];\n\$filtered = array_filter(\$data);\necho implode(\", \", \$filtered);\n?>",
                'options' => ['A' => '12, PHP, 45', 'B' => '0, 12, PHP, 45', 'C' => '12, false, PHP, 45', 'D' => 'Semua elemen'],
                'correct_answer' => 'A',
                'category' => 'Array',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'array_filter tanpa callback membuang elemen bernilai falsy (0, false, "", null).'
            ],
            [
                'question' => 'Bagaimanakah cara mengizinkan fungsi menerima jumlah argumen variabel tanpa batas (variadic function)?',
                'code_snippet' => null,
                'options' => ['A' => 'Simbol ... (splat operator)', 'B' => 'Simbol ampersand &', 'C' => 'Default = []', 'D' => 'Keyword params'],
                'correct_answer' => 'A',
                'category' => 'Function',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Splat operator (...$params) menangkap argumen dinamis ke dalam array.'
            ],
            [
                'question' => 'Keyword apa yang wajib digunakan agar closure bisa mengakses variabel dari lingkup luar?',
                'code_snippet' => "<?php\n\$bonus = 500;\n\$calc = function(\$sal) ______ (\$bonus) {\n    return \$sal + \$bonus;\n};\n?>",
                'options' => ['A' => 'global', 'B' => 'use', 'C' => 'import', 'D' => 'pass'],
                'correct_answer' => 'B',
                'category' => 'Function',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Keyword use mengikat variabel dari outer scope ke dalam anonymous function.'
            ],
            [
                'question' => 'Apa output dari script yang menggunakan variabel static di dalam fungsi berikut?',
                'code_snippet' => "<?php\nfunction counter() {\n    static \$count = 0;\n    \$count++;\n    return \$count;\n}\ncounter();\necho counter();\n?>",
                'options' => ['A' => '1', 'B' => '2', 'C' => '0', 'D' => 'NULL'],
                'correct_answer' => 'B',
                'category' => 'Function',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Variabel static mempertahankan nilainya antar pemanggilan fungsi.'
            ],
            [
                'question' => 'Type hint nullable pada parameter fungsi di PHP ditulis dengan awalan:',
                'code_snippet' => null,
                'options' => ['A' => '!', 'B' => '?', 'C' => '*', 'D' => 'null|'],
                'correct_answer' => 'B',
                'category' => 'Function',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Tanda tanya (?string) menandakan nilai string atau null.'
            ],
            [
                'question' => 'Apa perbedaan mendasar antara petik ganda (" ") dan petik tunggal (\' \') di PHP?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'Petik ganda menginterpolasi variabel dan escape sequences, petik tunggal literal',
                    'B' => 'Petik tunggal membaca ANSI',
                    'C' => 'Petik ganda menolak spasi',
                    'D' => 'Identik'
                ],
                'correct_answer' => 'A',
                'category' => 'String',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Petik ganda mengevaluasi variabel dan escape sequence seperti \n.'
            ],
            [
                'question' => 'Fungsi bawaan apakah yang memecah string menjadi array berdasarkan delimiter tertentu?',
                'code_snippet' => null,
                'options' => ['A' => 'implode()', 'B' => 'str_split()', 'C' => 'explode()', 'D' => 'split_string()'],
                'correct_answer' => 'C',
                'category' => 'String',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'explode() memecah string menjadi array berdasarkan pemisah.'
            ],
            [
                'question' => 'Apa output dari kode pemotongan string berikut?',
                'code_snippet' => "<?php\n\$str = \"Belajar PHP Modern\";\necho substr(\$str, 8, 3);\n?>",
                'options' => ['A' => 'PHP', 'B' => 'r P', 'C' => 'Modern', 'D' => 'Bel'],
                'correct_answer' => 'A',
                'category' => 'String',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Indeks ke-8 sepanjang 3 karakter menghasilkan PHP.'
            ],
            [
                'question' => 'Manakah fungsi PHP yang digunakan untuk mencari posisi kemunculan pertama substring?',
                'code_snippet' => null,
                'options' => ['A' => 'strpos()', 'B' => 'strstr()', 'C' => 'str_find()', 'D' => 'substr_count()'],
                'correct_answer' => 'A',
                'category' => 'String',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'strpos mengembalikan indeks awal substring yang dicari.'
            ],
            [
                'question' => 'Visibility keyword manakah yang membatasi akses hanya di class itu sendiri dan class turunannya?',
                'code_snippet' => null,
                'options' => ['A' => 'private', 'B' => 'protected', 'C' => 'public', 'D' => 'static'],
                'correct_answer' => 'B',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'protected dapat diakses dari class itu sendiri dan subclass turunannya.'
            ],
            [
                'question' => 'Apa nama magic method constructor yang otomatis dieksekusi saat objek dibuat?',
                'code_snippet' => null,
                'options' => ['A' => '__init()', 'B' => '__construct()', 'C' => '__build()', 'D' => '__create()'],
                'correct_answer' => 'B',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => '__construct() adalah method constructor di PHP.'
            ],
            [
                'question' => 'Perhatikan deklarasi abstract class. Manakah pernyataan yang BENAR?',
                'code_snippet' => "<?php\nabstract class Vehicle {\n    abstract public function startEngine(): bool;\n}\n?>",
                'options' => [
                    'A' => 'Vehicle dapat langsung diinstansiasi',
                    'B' => 'Abstract class tidak boleh punya method',
                    'C' => 'Class turunan wajib mengimplementasikan method startEngine()',
                    'D' => 'Method wajib private'
                ],
                'correct_answer' => 'C',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Subclass wajib mendefinisikan method abstrak turunan.'
            ],
            [
                'question' => 'Keyword apa yang digunakan oleh class untuk menggunakan satu atau lebih Trait di PHP?',
                'code_snippet' => null,
                'options' => ['A' => 'extends', 'B' => 'implements', 'C' => 'use', 'D' => 'include'],
                'correct_answer' => 'C',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Trait diimpor ke dalam body class dengan keyword use.'
            ],
            [
                'question' => 'Sintaks untuk mengakses method statis getInfo() pada class Product tanpa instansiasi?',
                'code_snippet' => null,
                'options' => ['A' => 'Product->getInfo()', 'B' => 'Product::getInfo()', 'C' => 'Product@getInfo()', 'D' => 'Product.getInfo()'],
                'correct_answer' => 'B',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Operator :: (scope resolution) digunakan untuk member statis.'
            ],
            [
                'question' => 'Fungsi dari keyword final jika diletakkan di depan deklarasi class?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'Class menjadi immutable',
                    'B' => 'Class tersebut tidak dapat diturunkan/diwariskan oleh class lain',
                    'C' => 'Class dieksekusi terakhir',
                    'D' => 'Singleton otomatis'
                ],
                'correct_answer' => 'B',
                'category' => 'Object Oriented Programming / OOP',
                'difficulty' => 'Advanced',
                'exam_type' => 'initial',
                'explanation' => 'final class mencegah pewarisan (inheritance) oleh kelas lain.'
            ],
            [
                'question' => 'Mengapa PDO (PHP Data Objects) lebih direkomendasikan daripada fungsi lawas mysqli_*?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'PDO mendukung multi-RDBMS dan prepared statement aman terstandar',
                    'B' => 'PDO tanpa username',
                    'C' => 'PDO tanpa kompilasi',
                    'D' => 'mysqli dihapus'
                ],
                'correct_answer' => 'A',
                'category' => 'Database / MySQL',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'PDO menyediakan database abstraction layer untuk banyak RDBMS.'
            ],
            [
                'question' => 'Format DSN yang tepat untuk membuat koneksi PDO ke MySQL di localhost?',
                'code_snippet' => null,
                'options' => [
                    'A' => '"mysql:host=localhost;dbname=akademik;charset=utf8mb4"',
                    'B' => '"database://localhost:mysql/akademik"',
                    'C' => '"pdo_mysql(localhost, akademik)"',
                    'D' => '"mysql://root@localhost"'
                ],
                'correct_answer' => 'A',
                'category' => 'Database / MySQL',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'DSN PDO berformat mysql:host=...;dbname=...;charset=....'
            ],
            [
                'question' => 'Fitur keamanan apakah dalam PDO yang paling efektif mencegah serangan SQL Injection?',
                'code_snippet' => null,
                'options' => [
                    'A' => 'htmlspecialchars()',
                    'B' => 'Prepared Statements dengan parameterized queries',
                    'C' => 'md5() hashing',
                    'D' => 'addslashes()'
                ],
                'correct_answer' => 'B',
                'category' => 'Database / MySQL',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'Prepared statements memisahkan query SQL dari data parameter pengguna.'
            ],
            [
                'question' => 'Apa arti dari konstanta PDO::FETCH_ASSOC saat mengambil baris data?',
                'code_snippet' => "<?php\n\$stmt = \$pdo->query(\"SELECT id, name FROM users\");\n\$user = \$stmt->fetch(PDO::FETCH_ASSOC);\n?>",
                'options' => [
                    'A' => 'Mengembalikan stdClass',
                    'B' => 'Mengembalikan hasil baris sebagai array yang diindeks oleh nama kolom tabel',
                    'C' => 'Array numerik',
                    'D' => 'Menghapus data'
                ],
                'correct_answer' => 'B',
                'category' => 'Database / MySQL',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'PDO::FETCH_ASSOC menghasilkan associative array nama_kolom => nilai.'
            ],
            [
                'question' => 'Method PDO manakah yang digunakan untuk membatalkan seluruh perubahan query dalam transaksi?',
                'code_snippet' => null,
                'options' => ['A' => '$pdo->rollBack()', 'B' => '$pdo->cancel()', 'C' => '$pdo->revert()', 'D' => '$pdo->undo()'],
                'correct_answer' => 'A',
                'category' => 'Database / MySQL',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => '$pdo->rollBack() membatalkan seluruh perubahan transaksi database.'
            ],
            [
                'question' => 'Variabel superglobal PHP manakah yang menangkap data formulir HTML method POST?',
                'code_snippet' => null,
                'options' => ['A' => '$_GET', 'B' => '$_POST', 'C' => '$_REQUEST_BODY', 'D' => '$_DATA'],
                'correct_answer' => 'B',
                'category' => 'CRUD',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => '$_POST memuat nilai parameter dari permintaan HTTP POST.'
            ],
            [
                'question' => 'Perhatikan potongan UPDATE berikut. Apa kelemahan fatal script ini?',
                'code_snippet' => "<?php\n\$id = \$_POST['id'];\n\$nama = \$_POST['nama'];\n\$sql = \"UPDATE mahasiswa SET nama='\$nama' WHERE id=\$id\";\n\$conn->query(\$sql);\n?>",
                'options' => [
                    'A' => 'Tidak ada kelemahan',
                    'B' => 'Rentan terhadap serangan SQL Injection karena penggabungan variabel mentah ke query',
                    'C' => 'Sintaks salah',
                    'D' => 'POST dilarang untuk update'
                ],
                'correct_answer' => 'B',
                'category' => 'CRUD',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Penggabungan string variabel ke query SQL tanpa prepared statement membuka celah SQLi.'
            ],
            [
                'question' => 'Setelah berhasil menyimpan data (Create), kode pengalihan (redirect) kembali yang benar:',
                'code_snippet' => null,
                'options' => [
                    'A' => 'header(\'Location: index.php\'); exit;',
                    'B' => 'redirect(\'index.php\');',
                    'C' => 'goto index.php;',
                    'D' => 'window.location = \'index.php\';'
                ],
                'correct_answer' => 'A',
                'category' => 'CRUD',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'explanation' => 'header("Location: ...") mengirimkan HTTP 302 redirect header.'
            ],
            [
                'question' => 'Fungsi bawaan PHP untuk mencegah serangan Cross-Site Scripting (XSS) pada output HTML?',
                'code_snippet' => null,
                'options' => ['A' => 'strip_tags()', 'B' => 'htmlspecialchars()', 'C' => 'urlencode()', 'D' => 'md5()'],
                'correct_answer' => 'B',
                'category' => 'CRUD',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'htmlspecialchars() mengonversi karakter khusus menjadi entitas HTML aman.'
            ],
            [
                'question' => 'Blok penanganan error yang selalu dieksekusi baik terjadi exception maupun tidak?',
                'code_snippet' => "<?php\ntry {\n    // code\n} catch (Exception \$e) {\n    // handle\n} ______ {\n    // always runs\n}\n?>",
                'options' => ['A' => 'always', 'B' => 'finally', 'C' => 'end', 'D' => 'default'],
                'correct_answer' => 'B',
                'category' => 'Error Handling',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'Blok finally dijamin selalu berjalan setelah try dan catch selesai.'
            ],
            [
                'question' => 'Konfigurasi PDO agar melempar PDOException saat terjadi kesalahan query SQL?',
                'code_snippet' => null,
                'options' => [
                    'A' => '$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);',
                    'B' => '$pdo->enableExceptions(true);',
                    'C' => 'error_reporting(E_ALL);',
                    'D' => '$pdo->setDebugMode(\'strict\');'
                ],
                'correct_answer' => 'A',
                'category' => 'Error Handling',
                'difficulty' => 'Intermediate',
                'exam_type' => 'initial',
                'explanation' => 'PDO::ERRMODE_EXCEPTION memerintahkan PDO melempar objek exception saat error.'
            ],
        ];

        foreach ($initialQuestions as $q) {
            Question::create($q);
        }
    }
}
