import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Zap
} from 'lucide-react';

export const AssessmentResultPage: React.FC = () => {
  const { initialResult, navigateTo } = useApp();

  if (!initialResult) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Data assessment belum tersedia.</p>
        <button
          onClick={() => navigateTo('assessment')}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          style={{ backgroundColor: 'var(--color-primary)', color: "var(--color-surface)" }}
        >
          Mulai Assessment
        </button>
      </div>
    );
  }

  const { score, level, correctCount, totalQuestions, aiAnalysis, skillGaps } = initialResult;
  const aiStatusLabel = aiAnalysis.source === 'configured_ai'
    ? `Analisis AI berhasil${aiAnalysis.provider ? ` (${aiAnalysis.provider})` : ''}`
    : aiAnalysis.source === 'provider_failure_fallback'
      ? 'Provider AI gagal; analisis fallback backend digunakan'
      : aiAnalysis.source === 'invalid_response_fallback'
        ? 'Respons AI tidak valid; analisis fallback backend digunakan'
        : aiAnalysis.source === 'local_engine'
          ? 'Analisis aturan backend; provider AI belum dikonfigurasi'
          : 'Status AI tidak tercatat untuk hasil ini';

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Header Document */}
      <div className="pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
          <CheckCircle2 className="w-4 h-4" />
          <span>Hasil Evaluasi Kompetensi &bull; Tanggal: {initialResult.date}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Titik awalmu sudah terlihat.
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Hasil tes awal &bull; {totalQuestions} soal selesai &bull; {correctCount} jawaban benar.
        </p>
      </div>

      {/* Main Score & Diagnostic Row */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
        style={{
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        {/* Score & Level Display */}
        <div
          className="md:col-span-5 pr-0 md:pr-6"
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Skor Kemampuan
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              {score}
            </span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-secondary)' }}>/100</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Level:</span>
            <span
              className="text-xs font-bold font-mono px-3 py-1 rounded-full shadow-xs"
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                border: '1px solid rgba(79, 70, 229, 0.4)',
                color: 'var(--color-primary)' // Indigo 500
              }}
            >
              {level}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              ({correctCount}/{totalQuestions} benar)
            </span>
          </div>
        </div>

        {/* AI Diagnostic Explanation */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            <Zap className="w-4 h-4" />
            <span>{aiStatusLabel}</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
            {aiAnalysis.summary}
          </p>
          <div
            className="pt-2.5 text-xs leading-relaxed"
            style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <strong style={{ color: 'var(--color-text-primary)' }}>Rencana Aksi:</strong> {aiAnalysis.actionPlan}
          </div>
        </div>
      </div>

      {/* Skill Gaps Breakdown */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Skill Gap yang Teridentifikasi
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Kompetensi di bawah target. Pilih materi yang berguna untukmu; tidak ada materi wajib sebelum retest.
            </p>
          </div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)' }}
          >
            {skillGaps.length} Kompetensi Perlu Penguatan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {skillGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface)', // Slate 800
                border: '1px solid var(--color-border)' // Slate 700
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{gap.topic}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-danger)' }}>{gap.score}%</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {gap.summary}
                </p>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Prioritas: {gap.priority}</span>
                <button
                  onClick={() => navigateTo('learning_detail', gap.topic)}
                  className="font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <span>Pelajari Materi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          onClick={() => navigateTo('dashboard')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: 'var(--color-primary)', // Blue 500
            color: "var(--color-surface)"
          }}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Buka Dashboard &amp; Rekomendasi</span>
        </button>

        <button
          onClick={() => navigateTo('retest')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: 'var(--color-accent)', // Emerald 500
            color: "var(--color-surface)"
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Buka kesiapan retest</span>
        </button>
      </div>
    </div>
  );
};
