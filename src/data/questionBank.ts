import beginnerCsv from '../../laravel/database/seeders/bank-soal/beginner.csv?raw';
import intermediateCsv from '../../laravel/database/seeders/bank-soal/intermediate.csv?raw';
import advancedCsv from '../../laravel/database/seeders/bank-soal/advanced.csv?raw';
import { PHPDifficulty, PHPTopic, Question } from '../types';

const BANKS: Array<{ difficulty: PHPDifficulty; csv: string; idOffset: number }> = [
  { difficulty: 'Beginner', csv: beginnerCsv, idOffset: 10000 },
  { difficulty: 'Intermediate', csv: intermediateCsv, idOffset: 20000 },
  { difficulty: 'Advanced', csv: advancedCsv, idOffset: 30000 }
];

const TOPICS: PHPTopic[] = [
  'Dasar PHP',
  'Variabel dan Tipe Data',
  'Operator',
  'Conditional',
  'Looping',
  'Array',
  'Function',
  'String',
  'Object Oriented Programming / OOP',
  'Database / MySQL',
  'CRUD',
  'Error Handling'
];

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (insideQuotes && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === ',' && !insideQuotes) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && csv[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
  }

  return rows;
}

function mapTopic(topic: string): PHPTopic {
  const normalizedTopic = topic.toLocaleLowerCase('id');

  if (normalizedTopic.includes('array') || normalizedTopic === 'sorting') return 'Array';
  if (normalizedTopic.includes('string') || normalizedTopic === 'concatenation') return 'String';
  if (normalizedTopic.includes('database') || normalizedTopic.includes('sql') || normalizedTopic === 'query') {
    return 'Database / MySQL';
  }
  if (
    normalizedTopic.includes('oop') ||
    normalizedTopic === 'class' ||
    normalizedTopic === 'trait' ||
    normalizedTopic === 'interface' ||
    normalizedTopic.includes('design pattern') ||
    normalizedTopic.includes('solid') ||
    normalizedTopic.includes('dependency injection') ||
    normalizedTopic.includes('reflection') ||
    normalizedTopic.includes('static')
  ) {
    return 'Object Oriented Programming / OOP';
  }
  if (
    normalizedTopic.includes('function') ||
    normalizedTopic.includes('closure') ||
    normalizedTopic.includes('generator') ||
    normalizedTopic.includes('parameter') ||
    normalizedTopic.includes('variadic')
  ) {
    return 'Function';
  }
  if (
    normalizedTopic.includes('loop') ||
    normalizedTopic.includes('foreach') ||
    normalizedTopic === 'break' ||
    normalizedTopic === 'continue'
  ) {
    return 'Looping';
  }
  if (normalizedTopic.includes('percabangan') || normalizedTopic === 'switch') return 'Conditional';
  if (
    normalizedTopic.includes('operator') ||
    normalizedTopic.includes('perbandingan') ||
    normalizedTopic.includes('coalescing')
  ) {
    return 'Operator';
  }
  if (
    normalizedTopic.includes('tipe data') ||
    normalizedTopic.includes('variabel') ||
    normalizedTopic.includes('type system') ||
    normalizedTopic.includes('type declaration')
  ) {
    return 'Variabel dan Tipe Data';
  }
  if (normalizedTopic.includes('exception') || normalizedTopic.includes('error') || normalizedTopic.includes('try catch')) {
    return 'Error Handling';
  }
  if (
    normalizedTopic.includes('security') ||
    normalizedTopic.includes('keamanan') ||
    normalizedTopic.includes('validation') ||
    normalizedTopic.includes('form') ||
    normalizedTopic.includes('api') ||
    normalizedTopic.includes('http') ||
    normalizedTopic.includes('upload')
  ) {
    return 'CRUD';
  }

  return TOPICS.includes(topic as PHPTopic) ? (topic as PHPTopic) : 'Dasar PHP';
}

function loadBank(difficulty: PHPDifficulty, csv: string, idOffset: number): Question[] {
  const rows = parseCsv(csv.replace(/^\uFEFF/, ''));
  const headers = rows.shift()?.map((header) => header.trim());

  if (!headers) throw new Error(`Bank soal ${difficulty} kosong.`);

  const headerIndex = new Map(headers.map((header, index) => [header, index]));
  const requiredHeaders = [
    'No',
    'Level',
    'Topik',
    'Jenis Soal',
    'Pertanyaan',
    'Potongan Kode',
    'Pilihan A',
    'Pilihan B',
    'Pilihan C',
    'Pilihan D',
    'Kunci Jawaban',
    'Pembahasan'
  ];
  const missingHeader = requiredHeaders.find((header) => !headerIndex.has(header));
  if (missingHeader) throw new Error(`Kolom "${missingHeader}" tidak ditemukan pada bank soal ${difficulty}.`);

  return rows.map((values) => {
    const get = (name: string) => values[headerIndex.get(name)!]?.trim() ?? '';
    const rowDifficulty = get('Level');
    const question = get('Pertanyaan');
    const correctAnswer = get('Kunci Jawaban').toUpperCase();
    const options = ['A', 'B', 'C', 'D'].map((key) => ({
      key: key as 'A' | 'B' | 'C' | 'D',
      text: get(`Pilihan ${key}`)
    }));
    const questionNumber = Number(get('No'));

    if (
      rowDifficulty !== difficulty ||
      !Number.isInteger(questionNumber) ||
      questionNumber < 1 ||
      !question ||
      !['A', 'B', 'C', 'D'].includes(correctAnswer) ||
      options.some((option) => !option.text)
    ) {
      throw new Error(`Data soal tidak valid pada bank ${difficulty}, nomor ${get('No') || '?'}.`);
    }

    return {
      id: idOffset + questionNumber,
      question,
      codeSnippet: get('Potongan Kode') || undefined,
      options,
      correct_answer: correctAnswer as Question['correct_answer'],
      category: mapTopic(get('Topik')),
      difficulty,
      type: 'multiple_choice',
      explanation: get('Pembahasan') || undefined
    };
  });
}

const QUESTION_BANKS = BANKS.map(({ difficulty, csv, idOffset }) =>
  loadBank(difficulty, csv, idOffset)
);

function shuffled<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function getRandomInitialQuestions(): Question[] {
  const selectedQuestions = QUESTION_BANKS.flatMap((questions) => {
    if (questions.length < 10) {
      throw new Error('Setiap level pada bank soal harus memiliki minimal 10 soal.');
    }

    return shuffled(questions).slice(0, 10);
  });

  if (selectedQuestions.length !== 30) {
    throw new Error(`Tes awal harus berisi tepat 30 soal; ditemukan ${selectedQuestions.length}.`);
  }

  return shuffled(selectedQuestions);
}
