import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Send,
  Code,
  X
} from 'lucide-react';

export const RetestPage: React.FC = () => {
  const {
    submitRetestAssessment,
    initialResult,
    retestAttempt,
    currentRetestQuestions,
    isGeneratingRetestQuestions,
    aiGenerationMessage,
    regenerateRetestQuestions
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegenerate = async () => {
    setAnswers({});
    setCurrentIndex(0);
    await regenerateRetestQuestions();
  };

  const totalQuestions = currentRetestQuestions.length; // Exactly 50
  const currentQ = currentRetestQuestions[currentIndex] || currentRetestQuestions[0];
  const selectedAnswer = currentQ ? answers[currentQ.id] : undefined;

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitRetestAssessment(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fast-fill for evaluators: 88% score demonstrating resolved skill gaps
  const handleQuickFillRetest = () => {
    const autoFilled: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    currentRetestQuestions.forEach((q, idx) => {
      if (idx % 8 === 0) {
        autoFilled[q.id] = q.correct_answer === 'A' ? 'C' : 'A';
      } else {
        autoFilled[q.id] = q.correct_answer;
      }
    });
    setAnswers(autoFilled);
  };

  return (
    <div className="py-2 sm:py-4 max-w-4xl mx-auto space-y-6">
      {/* Exam Pack Banner */}
      <div
        className="p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
            style={{ backgroundColor: '#10B981' }} // Emerald 500
          >
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#F8FAFC' }}>
                Paket Ujian Retest #{retestAttempt}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981'
                }}
              >
                50 Butir Soal Baru
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
              {aiGenerationMessage || 'Materi butir soal disesuaikan secara adaptif sesuai evaluasi skill gap Anda.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGeneratingRetestQuestions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            color: '#F8FAFC'
          }}
          title="Muat paket 50 butir soal baru"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isGeneratingRetestQuestions ? 'animate-spin' : ''}`} />
          <span>{isGeneratingRetestQuestions ? 'Memuat Soal...' : 'Ganti Paket Soal'}</span>
        </button>
      </div>

      {/* Retest Top Header & Simulation Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#10B981' }}>
            Tahap 2: Pengujian Ulang (Retest)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5" style={{ color: '#F8FAFC' }}>
            Retest Kemampuan PHP
          </h1>
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            Soal Berbeda dari Tes Awal &bull; Skor Tes Awal: {initialResult?.score || 0}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickFillRetest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981'
            }}
            title="Isi simulasi cepat jawaban untuk melihat lonjakan skor dan komparasi AI"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
            <span className="hidden sm:inline">Simulasi Retest (88%)</span>
          </button>

          <button
            onClick={() => setShowGridDrawer(!showGridDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
            style={{
              backgroundColor: showGridDrawer ? '#3B82F6' : '#111827',
              border: '1px solid #1E293B',
              color: '#F8FAFC'
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Peta Soal (50)</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold" style={{ color: '#F8FAFC' }}>
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span style={{ color: '#94A3B8' }}>
            Terjawab: <strong style={{ color: '#10B981' }}>{answeredCount}</strong> / {totalQuestions} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              backgroundColor: '#10B981'
            }}
          />
        </div>
      </div>

      {/* Grid Palette Drawer (if open) */}
      {showGridDrawer && (
        <div
          className="p-5 rounded-2xl shadow-xl animate-in fade-in duration-150"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F8FAFC' }}>
              Daftar 50 Butir Soal Retest
            </span>
            <button onClick={() => setShowGridDrawer(false)} className="hover:text-white" style={{ color: '#64748B' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {currentRetestQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowGridDrawer(false);
                  }}
                  className="h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center"
                  style={{
                    backgroundColor: isAnswered ? '#10B981' : '#1E293B',
                    color: isAnswered ? '#FFFFFF' : '#94A3B8',
                    border: isCurrent ? '2px solid #3B82F6' : '1px solid #334155'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-6" style={{ borderBottom: '1px solid #1E293B' }}>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-lg"
            style={{
              backgroundColor: '#1E293B',
              color: '#10B981'
            }}
          >
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
            Kategori: <strong style={{ color: '#F8FAFC' }}>{currentQ?.category}</strong>
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: '#F8FAFC' }}>
            {currentQ?.question}
          </p>
        </div>

        {/* Code Snippet Box */}
        {currentQ?.codeSnippet && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid #334155' }}>
            <div
              className="px-4 py-2 flex items-center justify-between text-xs font-mono"
              style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155' }}
            >
              <span style={{ color: '#94A3B8' }}>Studi Kasus PHP</span>
              <span style={{ color: '#10B981' }}>Retest Problem</span>
            </div>
            <pre
              className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
              style={{ backgroundColor: '#0B1020', color: '#10B981' }}
            >
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentQ?.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className="p-4 rounded-xl flex items-start gap-3.5 transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#1E293B',
                  border: isSelected ? '1px solid #10B981' : '1px solid #334155'
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#10B981' : '#0D1527',
                    color: '#F8FAFC'
                  }}
                >
                  {opt.key}
                </div>
                <span
                  className="text-xs sm:text-sm pt-0.5 leading-relaxed"
                  style={{ color: isSelected ? '#F8FAFC' : '#94A3B8' }}
                >
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid #1E293B' }}>
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
              style={{
                backgroundColor: '#10B981', // Emerald 500
                color: '#F8FAFC'
              }}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses Hasil...' : 'Selesai Retest'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
