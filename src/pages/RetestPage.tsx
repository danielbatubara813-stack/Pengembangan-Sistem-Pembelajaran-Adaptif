import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  Send,
  Code,
  X
} from 'lucide-react';

export const RetestPage: React.FC = () => {
  const {
    submitRetestAssessment,
    navigateTo,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const handleRegenerate = async () => {
    setAnswers({});
    setCurrentIndex(0);
    await regenerateRetestQuestions();
  };

  const totalQuestions = currentRetestQuestions.length;
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
    setSubmitError(null);
    try {
      await submitRetestAssessment(answers);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Jawaban retest belum dapat dikirim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentRetestQuestions.length === 0) {
    return (
      <div className="page-content py-8">
        <div className="panel mx-auto max-w-xl p-6 text-center" role={isGeneratingRetestQuestions ? 'status' : 'region'} aria-label="Pilihan memulai retest">
          <h1 className="text-lg font-bold text-slate-900">{isGeneratingRetestQuestions ? 'Menyiapkan paket retest...' : 'Retest dimulai saat Anda siap'}</h1>
          <p className="mt-2 text-sm text-slate-600">{aiGenerationMessage || 'Anda boleh belajar satu materi, sebagian materi, mengulang, atau langsung retest. Tidak ada materi yang wajib diselesaikan.'}</p>
          {!isGeneratingRetestQuestions && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button className="btn-primary" onClick={() => void handleRegenerate()}>
                Saya Siap Retest
              </button>
              <button className="button-secondary" onClick={() => navigateTo('recommendations')}>
                Lanjut belajar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Exam Pack Banner */}
      <div
        className="p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
            style={{ backgroundColor: 'var(--color-accent)' }} // Emerald 500
          >
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Paket Ujian Retest #{retestAttempt}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(4, 120, 87, 0.15)',
                  color: 'var(--color-accent)'
                }}
              >
                {totalQuestions} Butir Soal Baru
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {aiGenerationMessage || 'Materi butir soal disesuaikan secara adaptif sesuai evaluasi skill gap Anda.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGeneratingRetestQuestions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
          title="Muat paket maksimal 30 butir soal baru"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isGeneratingRetestQuestions ? 'animate-spin' : ''}`} />
          <span>{isGeneratingRetestQuestions ? 'Memuat Soal...' : 'Ganti Paket Soal'}</span>
        </button>
      </div>

      {/* Paket retest and navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-accent)' }}>
            Tahap 2: Pengujian Ulang (Retest)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
            Retest Kemampuan PHP
          </h1>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Soal Berbeda dari Tes Awal &bull; Skor Tes Awal: {initialResult?.score || 0}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGridDrawer(!showGridDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
            style={{
              backgroundColor: showGridDrawer ? 'var(--color-primary)' : 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Peta Soal ({totalQuestions})</span>
          </button>
        </div>
      </div>

      {submitError && <p className="notice-panel text-sm text-rose-700" role="alert">{submitError}</p>}

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Terjawab: <strong style={{ color: 'var(--color-accent)' }}>{answeredCount}</strong> / {totalQuestions} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              backgroundColor: 'var(--color-accent)'
            }}
          />
        </div>
      </div>

      {/* Grid Palette Drawer (if open) */}
      {showGridDrawer && (
        <div
          className="p-5 rounded-2xl shadow-xl animate-in fade-in duration-150"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
              Daftar {totalQuestions} Butir Soal Retest
            </span>
            <button onClick={() => setShowGridDrawer(false)} className="hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>
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
                    backgroundColor: isAnswered ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: isAnswered ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
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
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-lg"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-accent)'
            }}
          >
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Kategori: <strong style={{ color: 'var(--color-text-primary)' }}>{currentQ?.category}</strong>
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
            {currentQ?.question}
          </p>
        </div>

        {/* Code Snippet Box */}
        {currentQ?.codeSnippet && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid var(--color-border)' }}>
            <div
              className="px-4 py-2 flex items-center justify-between text-xs font-mono"
              style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>Studi Kasus PHP</span>
              <span style={{ color: 'var(--color-accent)' }}>Retest Problem</span>
            </div>
            <pre
              className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
              style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-accent)' }}
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
                  backgroundColor: isSelected ? 'rgba(4, 120, 87, 0.15)' : 'var(--color-surface)',
                  border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)'
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: isSelected ? 'var(--color-surface)' : 'var(--color-text-primary)'
                  }}
                >
                  {opt.key}
                </div>
                <span
                  className="text-xs sm:text-sm pt-0.5 leading-relaxed"
                  style={{ color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                >
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
              style={{
                backgroundColor: 'var(--color-accent)', // Emerald 500
                color: "var(--color-surface)"
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
