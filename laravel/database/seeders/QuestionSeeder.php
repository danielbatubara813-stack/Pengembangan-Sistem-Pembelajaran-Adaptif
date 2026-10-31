<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class QuestionSeeder extends Seeder
{
    const BANKS = [
        'beginner.csv' => 'Beginner',
        'intermediate.csv' => 'Intermediate',
        'advanced.csv' => 'Advanced',
    ];

    public function run(): void
    {
        $directory = __DIR__.'/bank-soal';
        $questions = [];

        foreach (self::BANKS as $filename => $difficulty) {
            $path = $directory.'/'.$filename;
            $handle = fopen($path, 'r');

            if ($handle === false) {
                throw new RuntimeException("Unable to open question bank: {$path}");
            }

            try {
                $headers = fgetcsv($handle, 0, ',', '"', '');

                if ($headers === false) {
                    throw new RuntimeException("Question bank is empty: {$path}");
                }

                $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]);
                $headerIndexes = array_flip(array_map('trim', $headers));
                $requiredHeaders = [
                    'No',
                    'Level',
                    'Topik',
                    'Pertanyaan',
                    'Potongan Kode',
                    'Pilihan A',
                    'Pilihan B',
                    'Pilihan C',
                    'Pilihan D',
                    'Kunci Jawaban',
                    'Pembahasan',
                ];

                foreach ($requiredHeaders as $header) {
                    if (! array_key_exists($header, $headerIndexes)) {
                        throw new RuntimeException("Missing '{$header}' column in question bank: {$path}");
                    }
                }

                while (($row = fgetcsv($handle, 0, ',', '"', '')) !== false) {
                    if (count($row) === 1 && trim((string) $row[0]) === '') {
                        continue;
                    }

                    $value = static fn (string $header): string => trim((string) ($row[$headerIndexes[$header]] ?? ''));
                    $rowDifficulty = $value('Level');
                    $question = $value('Pertanyaan');
                    $questionNumber = $value('No');
                    $correctAnswer = strtoupper($value('Kunci Jawaban'));
                    $options = [
                        'A' => $value('Pilihan A'),
                        'B' => $value('Pilihan B'),
                        'C' => $value('Pilihan C'),
                        'D' => $value('Pilihan D'),
                    ];

                    if ($rowDifficulty !== $difficulty) {
                        throw new RuntimeException("Unexpected level '{$rowDifficulty}' in {$path}; expected '{$difficulty}'.");
                    }

                    if (
                        ! ctype_digit($questionNumber) ||
                        (int) $questionNumber < 1 ||
                        $question === '' ||
                        ! in_array($correctAnswer, ['A', 'B', 'C', 'D'], true) ||
                        in_array('', $options, true)
                    ) {
                        throw new RuntimeException("Invalid question row in {$path}: {$question}");
                    }

                    $questions[] = [
                        'bank_key' => pathinfo($filename, PATHINFO_FILENAME).':'.$questionNumber,
                        'question' => $question,
                        'difficulty' => $difficulty,
                        'category' => $value('Topik') ?: 'Dasar PHP',
                        'options' => $options,
                        'correct_answer' => $correctAnswer,
                        'explanation' => $value('Pembahasan'),
                        'code_snippet' => $value('Potongan Kode') ?: null,
                        'exam_type' => 'initial',
                        'source' => 'csv_bank',
                    ];
                }
            } finally {
                fclose($handle);
            }
        }

        foreach (array_values(self::BANKS) as $difficulty) {
            $count = count(array_filter(
                $questions,
                static fn (array $question): bool => $question['difficulty'] === $difficulty
            ));

            if ($count < 10) {
                throw new RuntimeException("The {$difficulty} question bank must contain at least 10 questions.");
            }
        }

        DB::transaction(static function () use ($questions): void {
            foreach ($questions as $attributes) {
                $question = Question::where('bank_key', $attributes['bank_key'])->first();

                if ($question === null) {
                    $question = Question::whereNull('bank_key')
                        ->where('source', $attributes['source'])
                        ->where('question', $attributes['question'])
                        ->where('difficulty', $attributes['difficulty'])
                        ->where('exam_type', $attributes['exam_type'])
                        ->first();
                }

                if ($question === null) {
                    Question::create($attributes);
                    continue;
                }

                $question->fill($attributes);
                $question->save();
            }
        });

        if ($this->command !== null) {
            $this->command->info('Imported '.count($questions).' initial-assessment questions from the CSV banks.');
        }
    }
}
