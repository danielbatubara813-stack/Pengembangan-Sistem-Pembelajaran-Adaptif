export type PHPDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type PHPTopic =
  | 'Dasar PHP'
  | 'Variabel dan Tipe Data'
  | 'Operator'
  | 'Conditional'
  | 'Looping'
  | 'Array'
  | 'Function'
  | 'String'
  | 'Object Oriented Programming / OOP'
  | 'Database / MySQL'
  | 'CRUD'
  | 'Error Handling';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nim?: string;
  institution?: string;
}

export interface CompletedMaterial {
  id: string;
  title: string;
  topic: string;
  kind?: 'source' | 'example' | 'exercise' | null;
  completedAt?: string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  question: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correct_answer: 'A' | 'B' | 'C' | 'D';
  category: PHPTopic;
  difficulty: PHPDifficulty;
  type: 'multiple_choice';
  explanation?: string;
}

export type PublicQuestion = Omit<Question, 'correct_answer'>;

export interface AnswerRecord {
  question_id: number;
  answer: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean;
  category: PHPTopic;
}

export interface TopicScore {
  topic: PHPTopic;
  total: number;
  correct: number;
  percentage: number;
  status: 'Mahir' | 'Cukup' | 'Perlu Peningkatan';
}

export interface SkillGapItem {
  topic: PHPTopic;
  score: number;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  summary: string;
  recommendationFocus: string;
  competencyKey?: string;
  competencyName?: string;
  learningObjective?: string;
  exampleCode?: string | null;
  practicePrompt?: string | null;
  targetScore?: number;
  resultId?: number;
  difficultyScores?: Record<string, { total: number; correct: number; score: number }>;
  evidence?: Array<{ questionId: number; difficulty: string; isCorrect: boolean; question: string }>;
  status?: 'mastered' | 'needs_review';
}

export interface CompetencyStatus {
  status: 'mastered' | 'needs_review' | 'not_assessed';
  score: number;
  targetScore: number;
  evaluatedAt: string | null;
}

export type RecommendationType =
  | 'video'
  | 'artikel'
  | 'dokumentasi'
  | 'jurnal'
  | 'website'
  | 'latihan';

export interface Recommendation {
  id: string;
  topic: PHPTopic;
  type: RecommendationType;
  title: string;
  url: string;
  description: string;
  embedVideoUrl?: string;
  publisher?: string;
  readTime?: string;
  estimatedMinutes?: number;
  completed?: boolean;
  reason?: string;
  priority?: 'Tinggi' | 'Sedang' | 'Rendah';
  sequence?: number;
  targetScore?: number;
  prerequisiteTopics?: PHPTopic[];
  linkKind?: 'direct' | 'search';
  competencyKey?: string;
  competencyName?: string;
  learningObjective?: string;
  exampleCode?: string | null;
  practicePrompt?: string | null;
  sourceDomain?: string;
  validationStatus?: string;
  contentStatus?: string;
  embeddingStatus?: string;
  matchScore?: number;
  validation?: {
    urlValid: boolean;
    pageReachable: boolean;
    contentRelevant: boolean;
    videoPlayable: boolean;
    httpStatus: number | null;
  };
  gap?: SkillGapItem;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  type: 'initial' | 'retest';
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  level: PHPDifficulty;
  date: string;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  topicScores: Record<PHPTopic, TopicScore>;
  skillGaps: SkillGapItem[];
  aiAnalysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionPlan: string;
    source?: 'configured_ai' | 'local_engine' | 'provider_failure_fallback' | 'invalid_response_fallback' | 'legacy_unknown' | string;
    status?: 'succeeded' | 'not_configured' | 'provider_failed' | 'invalid_response' | 'unknown' | string;
    provider?: 'gemini' | 'openrouter' | null;
    providerConfigured?: boolean;
  };
}

export interface RetestComparison {
  initialScore: number;
  retestScore: number;
  scoreDifference: number; // e.g. +12
  initialLevel: PHPDifficulty;
  currentLevel: PHPDifficulty;
  initialDate: string;
  retestDate: string;
  topicComparisons: Array<{
    topic: PHPTopic;
    initialPercentage: number;
    retestPercentage: number;
    difference: number;
    status: 'Meningkat' | 'Stabil' | 'Menurun' | 'Belum diuji';
  }>;
  aiComparativeAnalysis: string;
  resolvedSkillGaps: string[];
  remainingSkillGaps: string[];
}

export interface HistoryItem {
  id: string;
  date: string;
  type: 'Assessment Awal' | 'Retest';
  score: number;
  level: PHPDifficulty;
  status: 'Selesai' | 'Dianalisis AI' | 'Analisis aturan' | 'Fallback: provider gagal' | 'Fallback: respons AI tidak valid' | 'Status AI tidak tercatat';
}
