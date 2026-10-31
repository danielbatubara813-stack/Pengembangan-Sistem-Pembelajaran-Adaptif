import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock,
  Send,
  Code2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  X,
  Keyboard
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { initialQuestions, loadInitialQuestions, submitInitialAssessment } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(3600); // 60 menit standar CBT
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const totalQuestions = initialQuestions.length;
  const currentQ = initialQuestions[currentIndex];
  const selectedAnswer = currentQ ? answers[currentQ.id] : undefined;
  const isFlagged = currentQ ? !!flaggedQuestions[currentQ.id] : false;

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  useEffect(() => {
    if (initialQuestions.length > 0) return;

    let isMounted = true;
    setIsLoadingQuestions(true);
    setQuestionError(null);
    void loadInitialQuestions()
      .catch((error) => {
        if (isMounted) setQuestionError(error instanceof Error ? error.message : 'Soal belum dapat dimuat.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingQuestions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialQuestions.length]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard Shortcuts (A, B, C, D, Left, Right, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (key === 'R') {
        toggleFlagCurrent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showSubmitModal]);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const toggleFlagCurrent = () => {
    if (!currentQ) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setQuestionError(null);
    try {
      await submitInitialAssessment(answers);
    } catch (error) {
      setQuestionError(error instanceof Error ? error.message : 'Jawaban assessment belum dapat dikirim.');
      setIsSubmitting(false);
    }
  };

  if (initialQuestions.length === 0) {
    return (
      <div className="page-content py-8">
        <div className="panel mx-auto max-w-xl p-6 text-center" role={questionError ? 'alert' : 'status'}>
          <h1 className="text-lg font-bold text-slate-900">{isLoadingQuestions ? 'Memuat soal assessment...' : 'Soal assessment belum tersedia'}</h1>
          <p className="mt-2 text-sm text-slate-600">{questionError || 'Soal akan dimuat dari bank soal Laravel.'}</p>
          {!isLoadingQuestions && (
            <button className="btn-primary mt-5" onClick={() => void loadInitialQuestions().catch((error) => setQuestionError(error instanceof Error ? error.message : 'Soal belum dapat dimuat.'))}>
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content py-2 sm:py-4">
      {/* CBT Status Top Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 mb-6"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-primary)' }}>
            Ujian Berbasis Komputer &bull; 12 Materi Pokok PHP
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Assessment Kemampuan PHP
          </h1>
        </div>

        {/* Timer & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Real-time Countdown Timer */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span>Sisa Waktu: {formatTime(secondsRemaining)}</span>
          </div>

          {/* Shortcut guide toggle */}
          <button
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className="p-1.5 rounded-xl text-xs transition-colors cursor-pointer hover:bg-slate-100"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)'
            }}
            title="Panduan Pintasan Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar (Collapsible) */}
      {showShortcutsHelp && (
        <div
          className="mb-6 p-3 rounded-xl text-[11px] flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>A</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>B</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>C</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>D</kbd> : Pilih Opsi
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>&larr;</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>&rarr;</kbd> : Navigasi Soal
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>R</kbd> : Tandai Ragu
            </span>
          </div>
          <button onClick={() => setShowShortcutsHelp(false)} className="hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Surface */}
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-xl"
            style={{
              backgroundColor: 'var(--color-surface)', // Slate 900
              border: '1px solid var(--color-border)' // Slate 800
            }}
          >
            {/* Header: Number & Ragu-ragu Checkbox */}
            <div
              className="flex items-center justify-between pb-4 mb-6"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-primary)'
                  }}
                >
                  Soal {currentIndex + 1} dari {totalQuestions}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Topik: <strong style={{ color: 'var(--color-text-primary)' }}>{currentQ.category}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFlagCurrent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: isFlagged ? '#FACC15' : 'var(--color-surface)',
                  border: isFlagged ? '1px solid #EAB308' : '1px solid var(--color-border)',
                  color: isFlagged ? '#422006' : 'var(--color-text-secondary)'
                }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                <span>{isFlagged ? 'Ditandai Ragu' : 'Ragu-ragu'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                {currentQ.question}
              </p>
            </div>

            {/* Code Snippet Box (if any) */}
            {currentQ.codeSnippet && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid var(--color-border)' }}>
                <div
                  className="px-4 py-2 flex items-center justify-between text-xs font-mono"
                  style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>PHP Script</span>
                  <span style={{ color: 'var(--color-primary)' }}>PHP 8.3 syntax</span>
                </div>
                <pre
                  className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                  style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-accent)' }}
                >
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className="p-4 rounded-xl flex items-start gap-3.5 transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'var(--color-surface)',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)'
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: isSelected ? 'var(--color-surface)' : 'var(--color-text-primary)'
                      }}
                    >
                      {opt.key}
                    </div>
                    <span
                      className="text-xs sm:text-sm pt-0.5 leading-relaxed font-normal"
                      style={{ color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                    >
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Kembali, Ragu, Berikutnya / Selesai */}
            <div
              className="mt-8 pt-6 flex items-center justify-between gap-3"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: "var(--color-surface)"
                    }}
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                    style={{
                      backgroundColor: 'var(--color-accent)', // Emerald 500
                      color: "var(--color-surface)"
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Selesai &amp; Evaluasi</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Number Palette & Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className="p-5 rounded-2xl shadow-xl sticky top-20"
            style={{
              backgroundColor: 'var(--color-surface)', // Slate 900
              border: '1px solid var(--color-border)' // Slate 800
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                Peta Soal Assessment ({totalQuestions})
              </h2>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                {answeredCount}/{totalQuestions} Terisi
              </span>
            </div>

            {/* Legend */}
            <div
              className="flex items-center justify-between text-[10px] pb-3 mb-4"
              style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FACC15' }} />
                <span>Ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-surface)' }} />
                <span>Belum</span>
              </div>
            </div>

            {/* Question Grid Numbers (10 per row) */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 mb-6">
              {initialQuestions.map((q, idx) => {
                const isAns = !!answers[q.id];
                const isFlg = !!flaggedQuestions[q.id];
                const isCurr = idx === currentIndex;

                let bg = 'var(--color-surface)';
                let textCol = 'var(--color-text-secondary)';
                let border = '1px solid var(--color-border)';

                if (isAns) {
                  bg = 'var(--color-accent)';
                  textCol = '#FFFFFF';
                  border = '1px solid var(--color-accent)';
                }
                if (isFlg) {
                  bg = '#dab812';
                  textCol = '#422006';
                  border = '1px solid #dab812';
                }
                if (isCurr) {
                  border = '2px solid var(--color-primary)';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className="h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer hover:scale-105 flex items-center justify-center"
                    style={{
                      backgroundColor: bg,
                      color: textCol,
                      border
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mb-6">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span>Kemajuan Pengerjaan</span>
                <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {Math.round((answeredCount / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                    backgroundColor: 'var(--color-accent)'
                  }}
                />
              </div>
            </div>

            {/* Final Submit Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
              style={{
                backgroundColor: 'var(--color-primary)', // Blue 500
                color: "var(--color-surface)"
              }}
            >
              <Send className="w-4 h-4" />
              <span>Kirimkan Jawaban Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'rgba(79, 70, 229, 0.15)', color: 'var(--color-primary)' }}
              >
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Konfirmasi Pengiriman Ujian
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Periksa kembali kelengkapan butir jawaban Anda
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl space-y-2 text-xs"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {questionError && <p className="mb-3 text-rose-600" role="alert">{questionError}</p>}
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Soal Terjawab:</span>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{answeredCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Ditandai Ragu-ragu:</span>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{flaggedCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Belum Dijawab:</span>
                <span className="font-bold" style={{ color: unansweredCount > 0 ? 'var(--color-danger)' : 'var(--color-accent)' }}>
                  {unansweredCount} butir
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-100"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void confirmSubmit()}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: "var(--color-surface)"
                }}
              >
                {isSubmitting ? 'Menganalisis Jawaban...' : 'Ya, Kirim Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
