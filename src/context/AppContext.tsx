import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AssessmentResult,
  CompletedMaterial,
  CompetencyStatus,
  HistoryItem,
  PHPTopic,
  PublicQuestion,
  RetestComparison,
  User
} from '../types';
import { ApiError, requestApi } from '../services/api';

export type AppPage =
  | 'landing'
  | 'register'
  | 'login'
  | 'assessment'
  | 'assessment_result'
  | 'dashboard'
  | 'analysis'
  | 'classification'
  | 'skill_gap'
  | 'recommendations'
  | 'learning_detail'
  | 'retest'
  | 'retest_result'
  | 'progress'
  | 'history'
  | 'profile';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authLoadError: string | null;
  currentPage: AppPage;
  initialResult: AssessmentResult | null;
  retestResult: AssessmentResult | null;
  retestComparison: RetestComparison | null;
  initialQuestions: PublicQuestion[];
  history: HistoryItem[];
  selectedTopicForDetail: PHPTopic | null;
  selectedCompetencyKeyForDetail: string | null;
  completedMaterials: string[];
  completedMaterialDetails: Record<string, CompletedMaterial>;
  competencyStatus: Partial<Record<PHPTopic, CompetencyStatus>>;
  activeVideoEmbed: { title: string; embedUrl: string } | null;
  isLaravelSpecOpen: boolean;
  retestAttempt: number;
  currentRetestQuestions: PublicQuestion[];
  isGeneratingRetestQuestions: boolean;
  aiGenerationMessage: string | null;
  // Navigation & Actions
  setCurrentPage: (page: AppPage) => void;
  retryLoadSession: () => void;
  navigateTo: (page: AppPage, topic?: PHPTopic, competencyKey?: string) => void;
  loadInitialQuestions: () => Promise<PublicQuestion[]>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, nim: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  submitInitialAssessment: (
    answers: Record<number, 'A' | 'B' | 'C' | 'D'>
  ) => Promise<AssessmentResult>;
  submitRetestAssessment: (answers: Record<number, 'A' | 'B' | 'C' | 'D'>) => Promise<{
    retestRes: AssessmentResult;
    comparison: RetestComparison;
  }>;
  regenerateRetestQuestions: (forcedAttempt?: number) => Promise<PublicQuestion[]>;
  markMaterialCompleted: (id: string, material?: Pick<CompletedMaterial, 'title' | 'topic' | 'kind'>) => void;
  openVideoModal: (title: string, embedUrl: string) => void;
  closeVideoModal: () => void;
  openLaravelSpec: () => void;
  closeLaravelSpec: () => void;
  resetAllProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface ProgressSnapshot {
  currentPage: AppPage;
  initialResult?: AssessmentResult | null;
  retestResult?: AssessmentResult | null;
  retestComparison?: RetestComparison | null;
  history?: HistoryItem[];
  completedMaterials?: string[];
  completedMaterialDetails?: Record<string, CompletedMaterial>;
  competencyStatus?: Partial<Record<PHPTopic, CompetencyStatus>>;
  retestAttempt?: number;
}

interface AuthResponse {
  user: User;
  progress: ProgressSnapshot | null;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authLoadError, setAuthLoadError] = useState<string | null>(null);
  const [sessionRetry, setSessionRetry] = useState(0);
  const [isProgressHydrated, setIsProgressHydrated] = useState(false);
  const [initialResult, setInitialResult] = useState<AssessmentResult | null>(null);
  const [retestResult, setRetestResult] = useState<AssessmentResult | null>(null);
  const [retestComparison, setRetestComparison] = useState<RetestComparison | null>(null);
  const [initialQuestions, setInitialQuestions] = useState<PublicQuestion[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [completedMaterials, setCompletedMaterials] = useState<string[]>([]);
  const [completedMaterialDetails, setCompletedMaterialDetails] = useState<Record<string, CompletedMaterial>>({});
  const [competencyStatus, setCompetencyStatus] = useState<Partial<Record<PHPTopic, CompetencyStatus>>>({});

  const [retestAttempt, setRetestAttempt] = useState<number>(1);
  const [currentRetestQuestions, setCurrentRetestQuestions] = useState<PublicQuestion[]>([]);
  const [isGeneratingRetestQuestions, setIsGeneratingRetestQuestions] = useState(false);
  const [aiGenerationMessage, setAiGenerationMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedTopicForDetail, setSelectedTopicForDetail] = useState<PHPTopic | null>(null);
  const [selectedCompetencyKeyForDetail, setSelectedCompetencyKeyForDetail] = useState<string | null>(null);
  const [activeVideoEmbed, setActiveVideoEmbed] = useState<{ title: string; embedUrl: string } | null>(null);
  const [isLaravelSpecOpen, setIsLaravelSpecOpen] = useState(false);
  const materialProgressWrite = useRef<Promise<void>>(Promise.resolve());

  const openLaravelSpec = () => setIsLaravelSpecOpen(true);
  const closeLaravelSpec = () => setIsLaravelSpecOpen(false);

  const applyProgress = (progress: ProgressSnapshot | null) => {
    const nextInitialResult = progress?.initialResult ?? null;
    const nextRetestResult = progress?.retestResult ?? null;
    const savedRetestAttempt = progress?.retestAttempt ?? 1;
    const nextRetestAttempt = Number.isInteger(savedRetestAttempt)
      ? Math.max(1, savedRetestAttempt)
      : 1;

    setInitialResult(nextInitialResult);
    setRetestResult(nextRetestResult);
    setRetestComparison(progress?.retestComparison ?? null);
    setInitialQuestions([]);
    setHistory(Array.isArray(progress?.history) ? progress!.history : []);
    setCompletedMaterials(Array.isArray(progress?.completedMaterials) ? progress!.completedMaterials : []);
    setCompletedMaterialDetails(
      progress?.completedMaterialDetails && typeof progress.completedMaterialDetails === 'object'
        ? progress.completedMaterialDetails
        : {}
    );
    setCompetencyStatus(progress?.competencyStatus ?? {});
    setRetestAttempt(nextRetestAttempt);
    setCurrentRetestQuestions([]);

    const savedPages: AppPage[] = [
      'landing', 'assessment', 'assessment_result', 'dashboard', 'analysis', 'classification',
      'skill_gap', 'recommendations', 'learning_detail', 'retest', 'retest_result', 'progress',
      'history', 'profile'
    ];
    const protectedPages: AppPage[] = [
      'dashboard', 'analysis', 'classification', 'skill_gap', 'recommendations',
      'learning_detail', 'retest', 'retest_result', 'progress', 'history', 'profile'
    ];
    let page = progress?.currentPage && savedPages.includes(progress.currentPage)
      ? progress.currentPage
      : (nextInitialResult ? 'dashboard' : 'assessment');
    if (!nextInitialResult && protectedPages.includes(page)) page = 'assessment';
    if (page === 'retest_result' && !nextRetestResult) page = 'dashboard';
    setCurrentPage(page);
    setIsProgressHydrated(true);
  };

  useEffect(() => {
    let isMounted = true;
    setIsAuthLoading(true);
    setAuthLoadError(null);
    void requestApi<AuthResponse>('/api/auth/me')
      .then((response) => {
        if (!isMounted) return;
        setUser(response.user);
        applyProgress(response.progress);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
          setCurrentPage('landing');
          setIsProgressHydrated(false);
          return;
        }
        setAuthLoadError(error instanceof Error ? error.message : 'Profil dan progres belum dapat dimuat.');
      })
      .finally(() => {
        if (isMounted) setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionRetry]);

  const retryLoadSession = () => setSessionRetry((attempt) => attempt + 1);

  useEffect(() => {
    if (!user || !isProgressHydrated || isAuthLoading) return;

    const timer = window.setTimeout(() => {
      void requestApi('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPage,
          retestAttempt
        })
      }).catch((error) => console.error('Gagal menyimpan progress akun.', error));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [
    user, isProgressHydrated, isAuthLoading, currentPage, retestAttempt
  ]);

  const loadInitialQuestions = async (): Promise<PublicQuestion[]> => {
    const response = await requestApi<{ questions: PublicQuestion[] }>('/api/assessment/questions');
    setInitialQuestions(response.questions);
    return response.questions;
  };

  // Dynamic AI Retest Question Generator
  const regenerateRetestQuestions = async (forcedAttempt?: number): Promise<PublicQuestion[]> => {
    const targetAttempt = forcedAttempt ?? retestAttempt;
    setIsGeneratingRetestQuestions(true);
    setAiGenerationMessage(`Sistem sedang menyiapkan maksimal 30 butir soal retest baru untuk Percobaan #${targetAttempt}...`);

    try {
      const data = await requestApi<{ questions: PublicQuestion[]; message?: string }>('/api/retest/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt: targetAttempt })
      });
      const questions = Array.isArray(data.questions) ? data.questions : [];
      setCurrentRetestQuestions(questions);
      setAiGenerationMessage(data.message || `Paket soal retest siap untuk Percobaan #${targetAttempt}.`);
      return questions;
    } catch (error) {
      setAiGenerationMessage(error instanceof Error ? error.message : 'Paket soal retest belum dapat dimuat.');
      return [];
    } finally {
      setIsGeneratingRetestQuestions(false);
    }
  };

  const isAuthenticated = !!user;

  // Strict Navigation Guard:
  // Dashboard & subsequent pages cannot be accessed unless Initial Assessment is completed!
  const navigateTo = (page: AppPage, topic?: PHPTopic, competencyKey?: string) => {
    if (topic) {
      setSelectedTopicForDetail(topic);
    }
    setSelectedCompetencyKeyForDetail(page === 'learning_detail' ? competencyKey ?? null : null);

    // Protection rule
    const protectedPages: AppPage[] = [
      'dashboard',
      'analysis',
      'classification',
      'skill_gap',
      'recommendations',
      'learning_detail',
      'retest',
      'retest_result',
      'progress',
      'history',
      'profile'
    ];

    if (protectedPages.includes(page)) {
      if (!user) {
        setCurrentPage('login');
        return;
      }
      if (!initialResult) {
        // Must complete initial assessment first!
        setCurrentPage('assessment');
        return;
      }
    }

    if (page === 'retest_result' && !retestResult) {
      setCurrentPage('dashboard');
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = async (email: string, password: string) => {
    const response = await requestApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setUser(response.user);
    applyProgress(response.progress);
  };

  const registerUser = async (name: string, email: string, nim: string, password: string) => {
    const response = await requestApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, nim, password })
    });
    setUser(response.user);
    applyProgress(response.progress);
  };

  const logoutUser = async () => {
    if (user && isProgressHydrated) {
      try {
        await materialProgressWrite.current;
        await requestApi('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPage, retestAttempt })
        });
      } catch (error) {
        console.error('Gagal menyimpan progress sebelum keluar.', error);
      }
    }
    try {
      await requestApi('/api/auth/logout', { method: 'POST' });
    } catch {
      // Clear the local account view even when the server is unreachable.
    }
    setUser(null);
    setIsProgressHydrated(false);
    setInitialResult(null);
    setRetestResult(null);
    setRetestComparison(null);
    setInitialQuestions([]);
    setHistory([]);
    setCompletedMaterials([]);
    setCompletedMaterialDetails({});
    setCompetencyStatus({});
    setRetestAttempt(1);
    setCurrentRetestQuestions([]);
    setCurrentPage('landing');
  };

  const submitInitialAssessment = async (
    answers: Record<number, 'A' | 'B' | 'C' | 'D'>
  ): Promise<AssessmentResult> => {
    const response = await requestApi<{ result: AssessmentResult; competencyStatus: Partial<Record<PHPTopic, CompetencyStatus>> }>('/api/assessment/submit-initial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const result = response.result;
    setInitialResult(result);
    setCompetencyStatus(response.competencyStatus ?? {});

    // Update history
    const historyItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      date: result.date,
      type: 'Assessment Awal',
      score: result.score,
      level: result.level,
      status: result.aiAnalysis.source === 'configured_ai'
        ? 'Dianalisis AI'
        : result.aiAnalysis.source === 'provider_failure_fallback'
          ? 'Fallback: provider gagal'
          : result.aiAnalysis.source === 'invalid_response_fallback'
            ? 'Fallback: respons AI tidak valid'
            : result.aiAnalysis.source === 'local_engine'
              ? 'Analisis aturan'
              : 'Status AI tidak tercatat'
    };
    setHistory((prev) => [historyItem, ...prev.filter((h) => h.type !== 'Assessment Awal')]);

    setCurrentPage('assessment_result');
    return result;
  };

  const submitRetestAssessment = async (answers: Record<number, 'A' | 'B' | 'C' | 'D'>) => {
    const { retestRes, comparison, competencyStatus: nextCompetencyStatus } = await requestApi<{
      retestRes: AssessmentResult;
      comparison: RetestComparison;
      competencyStatus: Partial<Record<PHPTopic, CompetencyStatus>>;
    }>('/api/retest/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    setRetestResult(retestRes);
    setRetestComparison(comparison);
    setCompetencyStatus(nextCompetencyStatus ?? {});

    const nextAttempt = retestAttempt + 1;
    setRetestAttempt(nextAttempt);

    setCurrentRetestQuestions([]);
    setAiGenerationMessage('Anda bisa belajar lagi atau membuka retest berikutnya kapan saja.');

    // Append to history
    const histItem: HistoryItem = {
      id: `hist-retest-${Date.now()}`,
      date: retestRes.date,
      type: 'Retest',
      score: retestRes.score,
      level: retestRes.level,
      status: 'Selesai'
    };
    setHistory((prev) => [histItem, ...prev]);

    setCurrentPage('retest_result');
    return { retestRes, comparison };
  };

  const markMaterialCompleted = (
    id: string,
    material?: Pick<CompletedMaterial, 'title' | 'topic' | 'kind'>
  ) => {
    const completed = !completedMaterials.includes(id);
    setCompletedMaterials((prev) => {
      return completed
        ? (prev.includes(id) ? prev : [...prev, id])
        : prev.filter((item) => item !== id);
    });
    if (completed && material) {
      setCompletedMaterialDetails((previous) => ({
        ...previous,
        [id]: { id, ...material },
      }));
    } else if (!completed) {
      setCompletedMaterialDetails((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    }

    const write = materialProgressWrite.current.then(async () => {
      const response = await requestApi<{
        completedMaterials: string[];
        completedMaterialDetails: Record<string, CompletedMaterial>;
      }>('/api/progress/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed, material: completed ? material : undefined })
      });
      setCompletedMaterials(response.completedMaterials);
      setCompletedMaterialDetails(response.completedMaterialDetails ?? {});
    });
    materialProgressWrite.current = write.catch(async (error) => {
      console.error('Gagal menyimpan status materi.', error);
      try {
        const response = await requestApi<{ progress: ProgressSnapshot }>('/api/progress');
        setCompletedMaterials(response.progress.completedMaterials ?? []);
        setCompletedMaterialDetails(response.progress.completedMaterialDetails ?? {});
      } catch {
        // The visible state remains optimistic until the next successful session load.
      }
    });
  };

  const openVideoModal = (title: string, embedUrl: string) => {
    setActiveVideoEmbed({ title, embedUrl });
  };

  const closeVideoModal = () => {
    setActiveVideoEmbed(null);
  };

  const resetAllProgress = () => {
    setCompletedMaterials([]);
    setCompletedMaterialDetails({});
    setCurrentRetestQuestions([]);
    setCurrentPage(initialResult ? 'dashboard' : 'assessment');
    const reset = materialProgressWrite.current.then(async () => {
      await requestApi('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPage: initialResult ? 'dashboard' : 'assessment', completedMaterials: [], completedMaterialDetails: {} })
      });
    });
    materialProgressWrite.current = reset.catch((error) => console.error('Gagal mereset status materi.', error));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        authLoadError,
        currentPage,
        initialResult,
        retestResult,
        retestComparison,
        initialQuestions,
        history,
        selectedTopicForDetail,
        selectedCompetencyKeyForDetail,
        completedMaterials,
        completedMaterialDetails,
        competencyStatus,
        activeVideoEmbed,
        isLaravelSpecOpen,
        retestAttempt,
        currentRetestQuestions,
        isGeneratingRetestQuestions,
        aiGenerationMessage,
        setCurrentPage,
        retryLoadSession,
        navigateTo,
        loadInitialQuestions,
        loginUser,
        registerUser,
        logoutUser,
        submitInitialAssessment,
        submitRetestAssessment,
        regenerateRetestQuestions,
        markMaterialCompleted,
        openVideoModal,
        closeVideoModal,
        openLaravelSpec,
        closeLaravelSpec,
        resetAllProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
