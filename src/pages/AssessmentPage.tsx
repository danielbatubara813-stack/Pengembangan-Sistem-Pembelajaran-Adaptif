import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock,
  Sparkles,
  Send,
  Code2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  X,
  Keyboard
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { submitInitialAssessment } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(3600); // 60 menit standar CBT
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = INITIAL_QUESTIONS.length; // 50 soal
  const currentQ = INITIAL_QUESTIONS[currentIndex];
  const selectedAnswer = answers[currentQ.id];
  const isFlagged = !!flaggedQuestions[currentQ.id];

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

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
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const toggleFlagCurrent = () => {
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

  const confirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitInitialAssessment(answers);
    }, 400);
  };

  // Fast-fill for evaluators/reviewers
  const handleQuickFill = () => {
    const autoFilled: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    INITIAL_QUESTIONS.forEach((q, idx) => {
      if (
        (q.category === 'Object Oriented Programming / OOP' && (q.id === 36 || q.id === 37 || q.id === 39)) ||
        (q.category === 'Database / MySQL' && (q.id === 41 || q.id === 44)) ||
        (q.category === 'Error Handling' && q.id === 50) ||
        (idx % 4 === 0)
      ) {
        autoFilled[q.id] = q.correct_answer === 'A' ? 'B' : 'A';
      } else {
        autoFilled[q.id] = q.correct_answer;
      }
    });
    setAnswers(autoFilled);
  };

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto">
      {/* CBT Status Top Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 mb-6"
        style={{ borderBottom: '1px solid #334155' }}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest block" style={{ color: '#6366F1' }}>
            Ujian Berbasis Komputer &bull; 12 Materi Pokok PHP
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
            Assessment Kemampuan PHP
          </h1>
        </div>

        {/* Timer & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Real-time Countdown Timer */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1E293B',
              color: '#F8FAFC'
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
            <span>Sisa Waktu: {formatTime(secondsRemaining)}</span>
          </div>

          {/* Shortcut guide toggle */}
          <button
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className="p-1.5 rounded-xl text-xs transition-colors cursor-pointer hover:bg-slate-800"
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1E293B',
              color: '#94A3B8'
            }}
            title="Panduan Pintasan Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Reviewer Simulation Helper */}
          <button
            onClick={handleQuickFill}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#6366F1'
            }}
            title="Isi otomatis contoh jawaban untuk menguji analisis AI langsung"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
            <span className="hidden md:inline">Simulasi Jawaban (74%)</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar (Collapsible) */}
      {showShortcutsHelp && (
        <div
          className="mb-6 p-3 rounded-xl text-[11px] flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B',
            color: '#94A3B8'
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>A</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>B</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>C</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>D</kbd> : Pilih Opsi
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>&larr;</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>&rarr;</kbd> : Navigasi Soal
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>R</kbd> : Tandai Ragu
            </span>
          </div>
          <button onClick={() => setShowShortcutsHelp(false)} className="hover:text-white" style={{ color: '#64748B' }}>
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
              backgroundColor: '#111827', // Slate 900
              border: '1px solid #1E293B' // Slate 800
            }}
          >
            {/* Header: Number & Ragu-ragu Checkbox */}
            <div
              className="flex items-center justify-between pb-4 mb-6"
              style={{ borderBottom: '1px solid #1E293B' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-lg"
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#3B82F6'
                  }}
                >
                  Soal {currentIndex + 1} dari {totalQuestions}
                </span>
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                  Topik: <strong style={{ color: '#F8FAFC' }}>{currentQ.category}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFlagCurrent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: isFlagged ? 'rgba(245, 158, 11, 0.15)' : '#1E293B',
                  border: isFlagged ? '1px solid #F59E0B' : '1px solid #334155',
                  color: isFlagged ? '#F59E0B' : '#94A3B8'
                }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                <span>{isFlagged ? 'Ditandai Ragu' : 'Ragu-ragu'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: '#F8FAFC' }}>
                {currentQ.question}
              </p>
            </div>

            {/* Code Snippet Box (if any) */}
            {currentQ.codeSnippet && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid #334155' }}>
                <div
                  className="px-4 py-2 flex items-center justify-between text-xs font-mono"
                  style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155' }}
                >
                  <span style={{ color: '#94A3B8' }}>PHP Script</span>
                  <span style={{ color: '#6366F1' }}>PHP 8.3 syntax</span>
                </div>
                <pre
                  className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                  style={{ backgroundColor: '#0B1020', color: '#10B981' }}
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
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : '#1E293B',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid #334155'
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? '#3B82F6' : '#0D1527',
                        color: '#F8FAFC'
                      }}
                    >
                      {opt.key}
                    </div>
                    <span
                      className="text-xs sm:text-sm pt-0.5 leading-relaxed font-normal"
                      style={{ color: isSelected ? '#F8FAFC' : '#94A3B8' }}
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
              style={{ borderTop: '1px solid #1E293B' }}
            >
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 cursor-pointer"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
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
                      backgroundColor: '#3B82F6',
                      color: '#F8FAFC'
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
                      backgroundColor: '#10B981', // Emerald 500
                      color: '#F8FAFC'
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
              backgroundColor: '#111827', // Slate 900
              border: '1px solid #1E293B' // Slate 800
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F8FAFC' }}>
                Peta Soal Assessment (50)
              </h2>
              <span className="text-xs font-mono font-bold" style={{ color: '#10B981' }}>
                {answeredCount}/{totalQuestions} Terisi
              </span>
            </div>

            {/* Legend */}
            <div
              className="flex items-center justify-between text-[10px] pb-3 mb-4"
              style={{ borderBottom: '1px solid #1E293B', color: '#94A3B8' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <span>Ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1E293B' }} />
                <span>Belum</span>
              </div>
            </div>

            {/* Question Grid Numbers (10 per row) */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 mb-6">
              {INITIAL_QUESTIONS.map((q, idx) => {
                const isAns = !!answers[q.id];
                const isFlg = !!flaggedQuestions[q.id];
                const isCurr = idx === currentIndex;

                let bg = '#1E293B';
                let textCol = '#94A3B8';
                let border = '1px solid #334155';

                if (isAns) {
                  bg = '#10B981';
                  textCol = '#FFFFFF';
                  border = '1px solid #10B981';
                }
                if (isFlg) {
                  bg = '#F59E0B';
                  textCol = '#FFFFFF';
                  border = '1px solid #F59E0B';
                }
                if (isCurr) {
                  border = '2px solid #3B82F6';
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
              <div className="flex items-center justify-between text-xs" style={{ color: '#94A3B8' }}>
                <span>Kemajuan Pengerjaan</span>
                <span className="font-mono font-bold" style={{ color: '#F8FAFC' }}>
                  {Math.round((answeredCount / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                    backgroundColor: '#10B981'
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
                backgroundColor: '#3B82F6', // Blue 500
                color: '#F8FAFC'
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
              backgroundColor: '#111827',
              border: '1px solid #1E293B'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}
              >
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
                  Konfirmasi Pengiriman Ujian
                </h3>
                <p className="text-xs" style={{ color: '#94A3B8' }}>
                  Periksa kembali kelengkapan butir jawaban Anda
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl space-y-2 text-xs"
              style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
            >
              <div className="flex justify-between">
                <span style={{ color: '#94A3B8' }}>Soal Terjawab:</span>
                <span className="font-bold" style={{ color: '#10B981' }}>{answeredCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#94A3B8' }}>Ditandai Ragu-ragu:</span>
                <span className="font-bold" style={{ color: '#F59E0B' }}>{flaggedCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#94A3B8' }}>Belum Dijawab:</span>
                <span className="font-bold" style={{ color: unansweredCount > 0 ? '#EF4444' : '#10B981' }}>
                  {unansweredCount} butir
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-800"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#94A3B8'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#F8FAFC'
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
