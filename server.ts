import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { OpenRouter } from '@openrouter/sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRetestQuestionsForAttempt } from './src/data/retestPools';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

app.use(express.json());

const YOUTUBE_RECOMMENDATIONS: Record<string, Array<{ title: string; url: string; embedVideoUrl: string; description: string; publisher: string; estimatedMinutes: number }>> = {
  'Dasar PHP': [{
    title: 'Pemrograman Dasar PHP untuk Pemula & Arsitektur Server Web',
    url: 'https://www.youtube.com/watch?v=l1W2OwV5rgY',
    embedVideoUrl: 'https://www.youtube.com/embed/l1W2OwV5rgY',
    description: 'Memahami struktur dasar PHP, eksekusi server, dan cara kerja bahasa ini di server-side web.',
    publisher: 'Web Programming UNPAS',
    estimatedMinutes: 25
  }],
  'Variabel dan Tipe Data': [{
    title: 'Kupas Tuntas Tipe Data PHP, Type Juggling & Strict Types',
    url: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
    embedVideoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c',
    description: 'Mempelajari type juggling, strict types, dan perilaku variabel pada tipe data non-sejenis.',
    publisher: 'Programmer Zaman Now',
    estimatedMinutes: 28
  }],
  'Operator': [{
    title: 'Operator Modern PHP: Null Coalescing, Spaceship & Nullsafe',
    url: 'https://www.youtube.com/watch?v=fX1dkh8tVpQ',
    embedVideoUrl: 'https://www.youtube.com/embed/fX1dkh8tVpQ',
    description: 'Kuasai operator PHP 7/8 yang umum dipakai pada logika aplikasi modern.',
    publisher: 'Traversy Media',
    estimatedMinutes: 22
  }],
  'Conditional': [{
    title: 'Struktur Kontrol PHP: If-Else, Switch Case, dan Match Expression',
    url: 'https://www.youtube.com/watch?v=243pQhCA4GE',
    embedVideoUrl: 'https://www.youtube.com/embed/243pQhCA4GE',
    description: 'Memahami keputusan logika, match expression, dan praktik branching yang aman.',
    publisher: 'Laracasts',
    estimatedMinutes: 24
  }],
  'Looping': [{
    title: 'Perulangan PHP Efisien: Foreach, For, While dan Generator',
    url: 'https://www.youtube.com/watch?v=1SnPKhCdLsU',
    embedVideoUrl: 'https://www.youtube.com/embed/1SnPKhCdLsU',
    description: 'Mempelajari kontrol iterasi dan teknik generator pada data berulang.',
    publisher: 'Web Programming UNPAS',
    estimatedMinutes: 26
  }],
  'Array': [{
    title: 'Belajar PHP Array & Associative Data Structure',
    url: 'https://www.youtube.com/watch?v=7qrQeBJ2Am4',
    embedVideoUrl: 'https://www.youtube.com/embed/7qrQeBJ2Am4',
    description: 'Memahami array numerik, associative, fungsi map/filter/reduce, dan manipulasi data.',
    publisher: 'CodewithHarshal',
    estimatedMinutes: 20
  }],
  'Function': [{
    title: 'Mengenal Function PHP untuk Kode Lebih Modular',
    url: 'https://www.youtube.com/watch?v=Qd4K5Q3R06E',
    embedVideoUrl: 'https://www.youtube.com/embed/Qd4K5Q3R06E',
    description: 'Belajar parameter, return value, scope, dan reuse function agar kode lebih bersih.',
    publisher: 'Tutorial PHP',
    estimatedMinutes: 18
  }],
  'Object Oriented Programming / OOP': [{
    title: 'PHP OOP untuk Pemula: Class, Object, Inheritance, dan Encapsulation',
    url: 'https://www.youtube.com/watch?v=2N2vnQ_YK0U',
    embedVideoUrl: 'https://www.youtube.com/embed/2N2vnQ_YK0U',
    description: 'Dasar OOP pada PHP yang sering dipakai pada aplikasi besar dan reusable code.',
    publisher: 'Programmer Zaman Now',
    estimatedMinutes: 30
  }],
  'Database & PDO': [{
    title: 'Belajar PDO PHP untuk Koneksi Database Aman',
    url: 'https://www.youtube.com/watch?v=4x_5zVqKcM0',
    embedVideoUrl: 'https://www.youtube.com/embed/4x_5zVqKcM0',
    description: 'Memahami koneksi database, prepared statement, dan penggunaan PDO yang aman.',
    publisher: 'DevMark',
    estimatedMinutes: 25
  }],
  'Error Handling': [{
    title: 'Error Handling di PHP: Try Catch, Exceptions dan Logging',
    url: 'https://www.youtube.com/watch?v=0_u6f827j2o',
    embedVideoUrl: 'https://www.youtube.com/embed/0_u6f827j2o',
    description: 'Menangani error secara profesional dan membuat aplikasi lebih mudah debug.',
    publisher: 'Code Politan',
    estimatedMinutes: 22
  }]
};

const normalizeTopicName = (topic: string) => {
  const value = String(topic || '').trim();
  const lowered = value.toLowerCase();

  if (lowered.includes('oop') || lowered.includes('object')) return 'Object Oriented Programming / OOP';
  if (lowered.includes('pdo') || lowered.includes('database')) return 'Database & PDO';
  if (lowered.includes('error')) return 'Error Handling';
  if (lowered.includes('array')) return 'Array';
  if (lowered.includes('loop')) return 'Looping';
  if (lowered.includes('condition')) return 'Conditional';
  if (lowered.includes('operator')) return 'Operator';
  if (lowered.includes('function')) return 'Function';
  if (lowered.includes('variabel') || lowered.includes('tipe')) return 'Variabel dan Tipe Data';
  if (lowered.includes('dasar') || lowered.includes('php')) return 'Dasar PHP';
  return value || 'Dasar PHP';
};

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

const getYoutubeRecommendations = (skillGaps: string[], requestSeed?: number) => {
  const uniqueTopics = Array.from(new Set((skillGaps || []).map(normalizeTopicName)));
  const seed = requestSeed ?? Date.now() + (skillGaps || []).join('').length;

  const fallbackTopics = ['Dasar PHP', 'Variabel dan Tipe Data', 'Function', 'Object Oriented Programming / OOP', 'Database & PDO'];
  const topicsToUse = uniqueTopics.length ? uniqueTopics : fallbackTopics;

  const shuffledTopics = shuffleWithSeed(topicsToUse, seed);
  const result = shuffledTopics.flatMap((topic) => {
    const items = YOUTUBE_RECOMMENDATIONS[topic] || YOUTUBE_RECOMMENDATIONS['Dasar PHP'];
    return shuffleWithSeed(items, seed + topic.length).slice(0, 2);
  });

  return result.slice(0, 5);
};

const parseGeneratedQuestionJson = (rawText: string) => {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
};

const apiKey = process.env.GEMINI_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const openRouterModel = process.env.OPENROUTER_MODEL || 'nvidia/llama-nemotron-embed-vl-1b-v2:free';
const openRouterChatModel = process.env.OPENROUTER_CHAT_MODEL || 'openai/gpt-4o-mini';
let ai: GoogleGenAI | null = null;
let openrouter: OpenRouter | null = null;

const withAiTimeout = async <T>(task: Promise<T>, timeoutMs = 15000): Promise<T> => {
  return Promise.race([
    task,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`AI request timeout after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
};

const buildFallbackRetestQuestions = (skillGaps: string[] = [], attempt = 1) => {
  const fallbackPool = getRetestQuestionsForAttempt(attempt, skillGaps);
  return fallbackPool.slice(0, 4).map((question, index) => ({
    ...question,
    id: 900 + (attempt * 10) + index,
    category: skillGaps[0] || question.category,
    difficulty: question.difficulty || 'Intermediate'
  }));
};

const normalizeOpenRouterText = (content: unknown): string => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') return part.text;
        return '';
      })
      .join('');
  }
  if (content && typeof content === 'object' && 'text' in content && typeof content.text === 'string') return content.text;
  return '';
};

const generateAiText = async (prompt: string, asJson = false): Promise<string> => {
  if (openrouter && openRouterApiKey) {
    const response = await withAiTimeout(
      openrouter.chat.send({
        chatRequest: {
          model: openRouterChatModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          maxTokens: asJson ? 2000 : 1200,
        }
      })
    );

    const result = response as any;
    const text = normalizeOpenRouterText(
      result?.choices?.[0]?.message?.content ?? result?.message?.content ?? result?.content ?? ''
    );
    if (!text) {
      throw new Error('OpenRouter returned empty content');
    }
    return text;
  }

  if (ai && apiKey) {
    const response = await withAiTimeout(
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        ...(asJson ? { config: { responseMimeType: 'application/json' } } : {}),
      })
    );
    return response.text || '';
  }

  throw new Error('No AI provider configured');
};

if (openRouterApiKey) {
  try {
    openrouter = new OpenRouter({ apiKey: openRouterApiKey });
    console.log('OpenRouter aktif dengan model:', openRouterModel);
  } catch (err) {
    console.error('Gagal menginisialisasi OpenRouter:', err);
  }
}

if (apiKey && !openrouter) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Gagal menginisialisasi GoogleGenAI:', err);
  }
}

// Endpoint: AI Analisis Assessment
app.post('/api/ai/analyze-assessment', async (req: Request, res: Response) => {
  const { score, level, topicScores, skillGaps, type, userName } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      source: 'local_engine',
      summary: `Kemampuan PHP Anda (${userName || 'Pengguna'}) berada pada level ${level} dengan skor ${score}/100. Analisis diagnostik menunjukkan perlunya penguatan pada topik: ${skillGaps?.map((s: any) => s.topic).join(', ') || 'OOP dan Database'}.`,
      actionPlan: `Fokuskan pembelajaran adaptif pada topik yang memiliki performa di bawah standar, lalu lakukan retest untuk memvalidasi kenaikan skor.`
    });
  }

  try {
    const prompt = `Anda adalah sistem AI pakar dalam evaluasi pembelajaran adaptif pemrograman PHP.
Pengguna: ${userName || 'Mahasiswa'}
Jenis Tes: ${type === 'initial' ? 'Assessment Awal (50 Soal)' : 'Retest (50 Soal)'}
Nilai: ${score}/100
Level Kemampuan: ${level} (Aturan: <60 Beginner, 60-79 Intermediate, >=80 Advanced)
Hasil Performa Topik: ${JSON.stringify(topicScores)}
Skill Gap Terdeteksi: ${JSON.stringify(skillGaps)}

Tugas:
Berikan analisis akademik yang mendalam, profesional, dan ringkas (dalam Bahasa Indonesia yang santun):
1. Evaluasi singkat kemampuan pengguna (2-3 kalimat).
2. Analisis akar penyebab pada skill gap yang teridentifikasi (1-2 kalimat).
3. Rencana aksi pembelajaran adaptif konkret yang harus dilakukan sebelum retest.

Kembalikan jawaban dalam format teks langsung tanpa markdown berlebihan.`;

    const aiText = await generateAiText(prompt);
    return res.json({
      success: true,
      source: openrouter ? 'openrouter_api' : 'gemini_api',
      analysis: aiText
    });
  } catch (error: any) {
    console.warn('Gemini API call failed, falling back to local adaptive engine:', error?.message);
    return res.json({
      success: true,
      source: 'local_engine_fallback',
      summary: `Kemampuan PHP Anda berada pada level ${level} (${score}/100). Berdasarkan evaluasi sistem, Anda disarankan fokus memperdalam materi ${skillGaps?.map((s: any) => s.topic).join(', ') || 'spesifik'}.`,
    });
  }
});

// Endpoint: AI Analisis Komparasi Retest
app.post('/api/ai/compare-retest', async (req: Request, res: Response) => {
  const { initialScore, retestScore, initialLevel, retestLevel, topicComparisons, resolvedGaps } = req.body;

  if (!ai) {
    const diff = retestScore - initialScore;
    return res.json({
      success: true,
      source: 'local_engine',
      comparativeAnalysis: `Evaluasi komparatif mencatat perkembangan ${diff >= 0 ? '+' + diff : diff}% dari assessment awal (${initialScore}%, Level ${initialLevel}) ke retest (${retestScore}%, Level ${retestLevel}). Topik yang mengalami peningkatan signifikan menandakan efektivitas materi rekomendasi yang telah dipelajari.`
    });
  }

  try {
    const prompt = `Anda adalah AI Evaluator Pembelajaran Adaptif Pemrograman PHP.
Data Komparasi:
- Nilai Assessment Awal: ${initialScore}% (Level: ${initialLevel})
- Nilai Retest: ${retestScore}% (Level: ${retestLevel})
- Perubahan Skor: ${retestScore - initialScore}%
- Perkembangan Topik: ${JSON.stringify(topicComparisons)}
- Skill Gap yang Berhasil Dituntaskan: ${JSON.stringify(resolvedGaps)}

Tugas:
Tuliskan 1 paragraf analisis komparatif (3-4 kalimat) yang objektif, memberikan motivasi akademik, dan menjelaskan dampak nyata dari materi pembelajaran yang telah diselesaikan. Gunakan Bahasa Indonesia profesional.`;

    const comparativeText = await generateAiText(prompt);

    return res.json({
      success: true,
      source: openrouter ? 'openrouter_api' : 'gemini_api',
      comparativeAnalysis: comparativeText
    });
  } catch (error: any) {
    console.warn('Gemini compare failed, using local engine fallback:', error?.message);
    const diff = retestScore - initialScore;
    return res.json({
      success: true,
      source: 'local_fallback',
      comparativeAnalysis: `Perkembangan skor menunjukkan perubahan ${diff >= 0 ? '+' + diff : diff}% dari assessment awal (${initialScore}%) ke retest (${retestScore}%). Hasil ini mengonfirmasi efektivitas proses pembelajaran adaptif yang telah dilalui.`
    });
  }
});

// Endpoint: AI Dynamic Retest Question Generator
app.post('/api/ai/generate-retest-questions', async (req: Request, res: Response) => {
  const { skillGaps = [], level = 'Intermediate', attempt = 1 } = req.body;

  try {
    if ((!ai || !apiKey) && (!openrouter || !openRouterApiKey)) {
      return res.json({
        success: false,
        source: 'missing_ai_key',
        attempt,
        customAiQuestions: [],
        message: 'API key AI belum diatur. Silakan isi GEMINI_API_KEY atau OPENROUTER_API_KEY di file .env.'
      });
    }

    const prompt = `Anda adalah AI generator bank soal adaptif pemrograman PHP.
Skill gap mahasiswa yang terdeteksi: ${JSON.stringify(skillGaps)}
Level kemampuan: ${level}
Percobaan Retest ke: ${attempt}

Tugas:
Hasilkan 4 butir soal studi kasus kode PHP pilihan ganda (A, B, C, D) yang BARU dan menantang untuk menguji penguasaan mahasiswa pada materi skill gap di atas.
Keluaran HARUS berupa JSON array valid, tanpa markdown dan tanpa teks tambahan.
Format JSON array:
[
  {
    "id": 901,
    "question": "teks pertanyaan spesifik",
    "codeSnippet": "<?php ... ?>",
    "options": [
      {"key": "A", "text": "jawaban A"},
      {"key": "B", "text": "jawaban B"},
      {"key": "C", "text": "jawaban C"},
      {"key": "D", "text": "jawaban D"}
    ],
    "correct_answer": "A",
    "category": "${skillGaps[0] || 'Object Oriented Programming / OOP'}",
    "difficulty": "${level}",
    "explanation": "penjelasan kunci jawaban"
  }
]`;

    const rawText = await generateAiText(prompt, true);
    const generatedSnippet = parseGeneratedQuestionJson(rawText);

    if (!Array.isArray(generatedSnippet) || generatedSnippet.length === 0) {
      throw new Error('Gemini response is empty or not valid JSON');
    }

    return res.json({
      success: true,
      source: openrouter ? 'openrouter_api' : 'gemini_api',
      attempt,
      customAiQuestions: generatedSnippet,
      message: `50 Soal Retest Baru Berhasil Dihasilkan oleh AI untuk Percobaan #${attempt}`
    });
  } catch (err: any) {
    const localQuestions = buildFallbackRetestQuestions(skillGaps, attempt);
    console.warn('Gemini question generation error, fallback to dynamic retest pool:', err?.message);
    return res.json({
      success: true,
      source: 'adaptive_pool_engine',
      attempt,
      customAiQuestions: localQuestions,
      message: `50 Soal Retest Baru Berhasil Dihasilkan untuk Percobaan #${attempt}`
    });
  }
});

// Endpoint: YouTube recommendation berdasarkan skill gap
app.post('/api/ai/recommend-youtube', async (req: Request, res: Response) => {
  const { skillGaps = [] } = req.body;

  try {
    const recommendations = getYoutubeRecommendations(skillGaps, Date.now() + skillGaps.join('').length);
    return res.json({
      success: true,
      source: 'skill_gap_mapping',
      recommendations
    });
  } catch (error: any) {
    console.warn('YouTube recommendation failed:', error?.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat rekomendasi YouTube.'
    });
  }
});

// Endpoint: AI Companion Contextual Tip
app.post('/api/ai/companion-tip', async (req: Request, res: Response) => {
  const { currentRoute, score, level, skillGaps } = req.body;

  const quickTips: Record<string, string> = {
    landing: 'Selamat datang! Sistem adaptif ini akan memetakan kemampuan PHP Anda secara objektif melalui 50 butir soal komprehensif.',
    assessment: 'Jawablah setiap soal dengan teliti. Soal mencakup 12 materi pokok dari konsep dasar hingga PDO dan Error Handling.',
    hasil_assessment: `Hasil awal Anda adalah ${score || 0}% (${level || 'Evaluasi'}). Jangan khawatir terhadap materi yang belum dikuasai, sistem telah menyiapkan rekomendasi khusus untuk Anda.`,
    dashboard: 'Dashboard ini memuat peta kompetensi Anda. Buka menu Rekomendasi Pembelajaran untuk mempelajari materi skill gap sebelum memulai Retest.',
    rekomendasi: 'Rekomendasi materi di bawah telah dipersonalisasi secara khusus untuk menuntaskan skill gap Anda.',
    detail_belajar: 'Pelajari konsep utama, cermati contoh kode implementasi, dan perhatikan jebakan umum (pitfalls) yang sering terjadi di PHP.',
    retest: 'Soal Retest dirancang berbeda dari tes awal untuk menguji daya tahan dan pemahaman konseptual Anda setelah belajar.',
    hasil_retest: 'Selamat telah menyelesaikan Retest! Perhatikan grafik perkembangan perbandingan di bawah untuk melihat peningkatan nyata.',
    progress: 'Grafik ini menampilkan jejak lonjakan kompetensi Anda dari tes awal hingga retest.',
    riwayat: 'Semua rekam jejak pengujian disimpan teratur untuk pemantauan portofolio belajar Anda.',
    profil: 'Kelola informasi profil akademik Anda di sini. Anda juga dapat melakukan reset data simulasi jika diperlukan.'
  };

  const defaultTip = quickTips[currentRoute] || 'Terus tingkatkan pemahaman sintaksis dan arsitektur PHP Anda langkah demi langkah!';

  return res.json({
    success: true,
    tip: defaultTip
  });
});

// Vite Middleware for SPA Frontend
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Pembelajaran Adaptif PHP berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
