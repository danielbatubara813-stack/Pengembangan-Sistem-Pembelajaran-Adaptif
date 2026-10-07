import {
  AssessmentResult,
  PHPDifficulty,
  PHPTopic,
  Question,
  RetestComparison,
  SkillGapItem,
  TopicScore
} from '../types';

export function calculateAssessmentResult(
  userId: string,
  type: 'initial' | 'retest',
  questions: Question[],
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>
): AssessmentResult {
  let correctCount = 0;
  const topicMap: Record<PHPTopic, { total: number; correct: number }> = {
    'Dasar PHP': { total: 0, correct: 0 },
    'Variabel dan Tipe Data': { total: 0, correct: 0 },
    'Operator': { total: 0, correct: 0 },
    'Conditional': { total: 0, correct: 0 },
    'Looping': { total: 0, correct: 0 },
    'Array': { total: 0, correct: 0 },
    'Function': { total: 0, correct: 0 },
    'String': { total: 0, correct: 0 },
    'Object Oriented Programming / OOP': { total: 0, correct: 0 },
    'Database / MySQL': { total: 0, correct: 0 },
    'CRUD': { total: 0, correct: 0 },
    'Error Handling': { total: 0, correct: 0 }
  };

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_answer;
    if (isCorrect) correctCount++;

    if (topicMap[q.category]) {
      topicMap[q.category].total += 1;
      if (isCorrect) {
        topicMap[q.category].correct += 1;
      }
    }
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / (totalQuestions || 1)) * 100);

  // Aturan Level:
  // Score < 60 -> Beginner
  // 60 <= Score < 80 -> Intermediate
  // Score >= 80 -> Advanced
  let level: PHPDifficulty = 'Beginner';
  if (score >= 80) {
    level = 'Advanced';
  } else if (score >= 60) {
    level = 'Intermediate';
  }

  // Topic Scores & Status
  const topicScores: Record<PHPTopic, TopicScore> = {} as any;
  const skillGaps: SkillGapItem[] = [];

  const topicKeys = Object.keys(topicMap) as PHPTopic[];
  topicKeys.forEach((topic) => {
    const data = topicMap[topic];
    const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

    let status: 'Mahir' | 'Cukup' | 'Perlu Peningkatan' = 'Perlu Peningkatan';
    if (percentage >= 80) {
      status = 'Mahir';
    } else if (percentage >= 60) {
      status = 'Cukup';
    }

    topicScores[topic] = {
      topic,
      total: data.total,
      correct: data.correct,
      percentage,
      status
    };

    // Skill Gap: Performa rendah pada topik (< 70% atau status Cukup/Perlu Peningkatan)
    if (percentage < 70) {
      const priority = percentage < 50 ? 'Tinggi' : 'Sedang';
      skillGaps.push({
        topic,
        score: percentage,
        priority,
        summary: `Pemahaman pada materi ${topic} masih membutuhkan penguatan (${percentage}% benar).`,
        recommendationFocus: getTopicFocusArea(topic)
      });
    }
  });

  // Urutkan skill gaps dari yang paling rendah persentasenya
  skillGaps.sort((a, b) => a.score - b.score);

  // Jika semua topik > 70%, ambil 1 atau 2 topik yang persentasenya relatif paling rendah sebagai area optimasi
  if (skillGaps.length === 0) {
    const sortedTopics = [...topicKeys].sort((a, b) => topicScores[a].percentage - topicScores[b].percentage);
    const lowest = sortedTopics[0];
    skillGaps.push({
      topic: lowest,
      score: topicScores[lowest].percentage,
      priority: 'Rendah',
      summary: `Kemampuan Anda secara umum sangat baik. Penguatan lebih lanjut disarankan pada topik ${lowest}.`,
      recommendationFocus: getTopicFocusArea(lowest)
    });
  }

  // Generate Analisis AI Singkat
  const strengths = topicKeys
    .filter((t) => topicScores[t].percentage >= 75)
    .map((t) => `${t} (${topicScores[t].percentage}%)`);

  const weaknesses = skillGaps.map((sg) => `${sg.topic} (${sg.score}%)`);

  const summary = generateAISummary(level, score, strengths, weaknesses, type);
  const actionPlan = generateActionPlan(level, skillGaps);

  return {
    id: `assess-${Date.now()}`,
    user_id: userId,
    type,
    score,
    totalQuestions,
    correctCount,
    level,
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    answers,
    topicScores,
    skillGaps,
    aiAnalysis: {
      summary,
      strengths: strengths.length > 0 ? strengths : ['Fondasi Dasar Pemrograman'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Tidak ada gap kritis terdeteksi'],
      actionPlan
    }
  };
}

export function compareAssessments(
  initial: AssessmentResult,
  retest: AssessmentResult
): RetestComparison {
  const scoreDifference = retest.score - initial.score;

  const topicComparisons = (Object.keys(initial.topicScores) as PHPTopic[]).map((topic) => {
    const initialPerc = initial.topicScores[topic]?.percentage ?? 0;
    const retestPerc = retest.topicScores[topic]?.percentage ?? 0;
    const diff = retestPerc - initialPerc;
    let status: 'Meningkat' | 'Stabil' | 'Menurun' = 'Stabil';
    if (diff > 0) status = 'Meningkat';
    else if (diff < 0) status = 'Menurun';

    return {
      topic,
      initialPercentage: initialPerc,
      retestPercentage: retestPerc,
      difference: diff,
      status
    };
  });

  const resolvedSkillGaps: string[] = [];
  const remainingSkillGaps: string[] = [];

  initial.skillGaps.forEach((sg) => {
    const retestScore = retest.topicScores[sg.topic]?.percentage ?? 0;
    if (retestScore >= 70) {
      resolvedSkillGaps.push(`${sg.topic} (dari ${sg.score}% naik menjadi ${retestScore}%)`);
    } else {
      remainingSkillGaps.push(`${sg.topic} (${retestScore}%)`);
    }
  });

  // AI Comparative Analysis Text
  let aiComparativeAnalysis = '';
  if (scoreDifference > 0) {
    aiComparativeAnalysis = `Hasil evaluasi adaptif menunjukkan peningkatan signifikan sebesar +${scoreDifference}% dari assessment awal (${initial.score}%) menuju retest (${retest.score}%). Level kemampuan Anda berhasil bertransisi dari ${initial.level} menjadi ${retest.level}. Pemahaman Anda terhadap materi yang sebelumnya teridentifikasi sebagai skill gap seperti ${resolvedSkillGaps.slice(0, 2).join(' dan ') || 'topik utama'} telah terbukti meningkat secara substantif setelah mempelajari rekomendasi materi.`;
  } else if (scoreDifference === 0) {
    aiComparativeAnalysis = `Skor retest Anda konsisten stabil di angka ${retest.score}% dengan level ${retest.level}. Terdapat penguasaan yang solid pada materi dasar, namun disarankan memperdalam latihan praktik pada topik-topik tingkat lanjut.`;
  } else {
    aiComparativeAnalysis = `Skor retest Anda tercatat ${retest.score}% (${scoreDifference}% dibandingkan tes awal). Variasi tingkat kesulitan pada retest menguji pemahaman konsep secara lebih mendalam. Fokuskan kembali pembelajaran pada topik prioritas yang direkomendasikan.`;
  }

  return {
    initialScore: initial.score,
    retestScore: retest.score,
    scoreDifference,
    initialLevel: initial.level,
    currentLevel: retest.level,
    initialDate: initial.date,
    retestDate: retest.date,
    topicComparisons,
    aiComparativeAnalysis,
    resolvedSkillGaps,
    remainingSkillGaps
  };
}

function getTopicFocusArea(topic: PHPTopic): string {
  switch (topic) {
    case 'Dasar PHP':
      return 'Sintaks dasar, eksekusi skrip, dan penulisan tag sesuai standar PSR-12.';
    case 'Variabel dan Tipe Data':
      return 'Type coercion, strict typing mode, dan pemanfaatan tipe data PHP 8.';
    case 'Operator':
      return 'Null coalescing (??), operator spaceship (<=>), dan operator nullsafe (?->).';
    case 'Conditional':
      return 'Ekspresi match PHP 8 dan perancangan alur kontrol guard clauses.';
    case 'Looping':
      return 'Foreach referensial, efisiensi iterasi, dan pemanfaatan yield generator.';
    case 'Array':
      return 'Functional array methods (map, filter, reduce) serta penggabungan array union (+).';
    case 'Function':
      return 'Deklarasi closure, binding scope dengan keyword use, dan named arguments.';
    case 'String':
      return 'Helper string PHP 8 (str_starts_with, str_contains) dan sanitasi keamanan XSS.';
    case 'Object Oriented Programming / OOP':
      return 'Enkapsulasi, abstract class, implementasi interface, dan constructor promotion.';
    case 'Database / MySQL':
      return 'Prepared statements PDO, binding parameter, dan transaksi atomik ACID.';
    case 'CRUD':
      return 'Pola Post-Redirect-Get (PRG), token anti-CSRF, dan password hashing aman.';
    case 'Error Handling':
      return 'Penanganan interface Throwable, blok try-catch-finally, dan logging produksi.';
    default:
      return 'Konsep dan praktik pemrograman PHP modern.';
  }
}

function generateAISummary(
  level: PHPDifficulty,
  score: number,
  strengths: string[],
  weaknesses: string[],
  type: 'initial' | 'retest'
): string {
  const prefix = type === 'initial' ? 'Kemampuan PHP Anda pada Assessment Awal' : 'Hasil evaluasi Retest PHP Anda';

  if (level === 'Advanced') {
    return `${prefix} berada pada level Advanced (${score}/100). Anda memiliki penguasaan yang sangat solid terhadap sintaksis, logika alur kontrol, dan konsep arsitektur PHP. ${
      weaknesses.length > 0
        ? `Area minor yang masih dapat disempurnakan adalah ${weaknesses.join(', ')}.`
        : 'Pertahankan pemahaman menyeluruh ini dan lanjutkan ke penerapan framework web skala besar.'
    }`;
  } else if (level === 'Intermediate') {
    return `${prefix} berada pada level Intermediate (${score}/100). Anda sudah memahami konsep dasar PHP, struktur kontrol, dan sintaks umum dengan baik. Namun sistem AI mengidentifikasi bahwa Anda masih perlu meningkatkan pemahaman mendalam pada beberapa topik spesifik, terutama ${
      weaknesses.slice(0, 3).join(', ') || 'OOP dan Database'
    }.`;
  } else {
    return `${prefix} berada pada level Beginner (${score}/100). Anda sedang membangun fondasi awal dalam pemrograman PHP. Sangat dianjurkan untuk mempelajari modul dasar secara terstruktur, terutama penguatan pada ${
      weaknesses.slice(0, 3).join(', ') || 'Variabel, Looping, dan Array'
    } sebelum melanjutkan ke konsep lanjutan.`;
  }
}

function generateActionPlan(level: PHPDifficulty, skillGaps: SkillGapItem[]): string {
  if (skillGaps.length === 0) {
    return 'Pelajari best practices penulisan kode berstandar industri dan ikuti retest untuk menguji daya tahan penguasaan Anda.';
  }

  const primaryGaps = skillGaps.slice(0, 3).map((s) => s.topic).join(', ');
  return `Fokuskan 70% waktu belajar Anda pada modul rekomendasi untuk topik ${primaryGaps}. Tonton materi video langsung di sistem, cermati contoh kode implementasi, kemudian uji kembali perkembangan pemahaman Anda melalui Retest 50 Soal.`;
}
