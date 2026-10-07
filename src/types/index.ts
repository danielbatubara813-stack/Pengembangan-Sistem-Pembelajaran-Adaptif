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
    status: 'Meningkat' | 'Stabil' | 'Menurun';
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
  status: 'Selesai' | 'Dianalisis AI';
}
