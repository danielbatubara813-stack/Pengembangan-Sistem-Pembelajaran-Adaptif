import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  BarChart3,
  History,
  Zap
} from 'lucide-react';

export const RetestResultPage: React.FC = () => {
  const {
    retestResult,
    retestComparison,
    initialResult,
    navigateTo,
    retestAttempt
  } = useApp();

  const handleStartNextRetest = () => {
    navigateTo('retest');
  };

  if (!retestResult || !retestComparison) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Hasil retest belum tersedia.</p>
        <button
          onClick={() => navigateTo('retest')}
          className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          style={{ backgroundColor: 'var(--color-primary)', color: "var(--color-surface)" }}
        >
          Mulai Retest
        </button>
      </div>
    );
  }

  const { score, level, correctCount, totalQuestions } = retestResult;
  const {
    initialScore,
    retestScore,
    scoreDifference,
    initialLevel,
    currentLevel,
    topicComparisons,
    aiComparativeAnalysis,
    resolvedSkillGaps,
    remainingSkillGaps
  } = retestComparison;

  const isScorePositive = scoreDifference >= 0;
  const aiSource = retestResult.aiAnalysis.source;
  const aiStatusLabel = aiSource === 'configured_ai'
    ? `Analisis AI berhasil${retestResult.aiAnalysis.provider ? ` (${retestResult.aiAnalysis.provider})` : ''}`
    : aiSource === 'provider_failure_fallback'
      ? 'Provider AI gagal; analisis fallback backend digunakan'
      : aiSource === 'invalid_response_fallback'
        ? 'Respons AI tidak valid; analisis fallback backend digunakan'
        : aiSource === 'local_engine'
          ? 'Analisis aturan backend; provider AI belum dikonfigurasi'
          : 'Status AI tidak tercatat untuk hasil ini';

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Header Document */}
      <div className="pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
          style={{
            backgroundColor: 'rgba(4, 120, 87, 0.15)',
            border: '1px solid rgba(4, 120, 87, 0.3)',
            color: 'var(--color-accent)'
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Retest Selesai &amp; Dikomparasi (Maks. 30 Soal)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Hasil Retest Kemampuan PHP
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Evaluasi komparasi capaian tes awal vs retest setelah mempelajari bahan ajar rekomendasi.
        </p>
      </div>

      {/* Main Score Banner */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl text-center"
        style={{
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Skor Hasil Retest
        </span>
        <div className="flex items-baseline justify-center gap-1 font-mono">
          <span className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text-secondary)' }}>/100</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Level Baru:</span>
          <span
            className="text-xs font-bold font-mono px-3 py-1 rounded-full shadow-xs"
            style={{
              backgroundColor: 'rgba(4, 120, 87, 0.2)',
              border: '1px solid rgba(4, 120, 87, 0.4)',
              color: 'var(--color-accent)'
            }}
          >
            {level}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            ({correctCount} dari {totalQuestions} soal benar)
          </span>
        </div>

        {/* 3 Metrics Row */}
        <div
          className="grid grid-cols-3 gap-3 mt-8 pt-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Skor Tes Awal
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono" style={{ color: 'var(--color-text-secondary)' }}>
              {initialScore}%
            </span>
            <span className="text-[10px] block mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Level: {initialLevel}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Perkembangan Skor
            </span>
            <span
              className="text-xl sm:text-2xl font-black font-mono"
              style={{ color: isScorePositive ? 'var(--color-accent)' : 'var(--color-danger)' }}
            >
              {isScorePositive ? `+${scoreDifference}%` : `${scoreDifference}%`}
            </span>
            <span className="text-[10px] block mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {isScorePositive ? 'Peningkatan Positif' : 'Perlu Pengulangan'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Status Level
            </span>
            <span className="text-xl sm:text-2xl font-black" style={{ color: 'var(--color-primary)' }}>
              {currentLevel}
            </span>
            <span className="text-[10px] block mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {initialLevel !== currentLevel ? `Naik dari ${initialLevel}` : 'Stabil'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Comparative Diagnostic Box */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
          <Zap className="w-4 h-4" />
          <span>{aiStatusLabel}</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          {aiComparativeAnalysis}
        </p>
      </div>

      {/* Resolved Skill Gaps Confirmation */}
      {resolvedSkillGaps.length > 0 && (
        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{
            backgroundColor: 'rgba(4, 120, 87, 0.1)',
            border: '1px solid rgba(4, 120, 87, 0.3)'
          }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>Skill Gap yang Berhasil Dituntaskan:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {resolvedSkillGaps.map((g, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}
              >
                &bull; {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {remainingSkillGaps.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
            <AlertCircle className="h-4 w-4" />
            Kompetensi yang masih perlu diperkuat
          </h3>
          <div className="flex flex-wrap gap-2">
            {remainingSkillGaps.map((gap, index) => (
              <span key={`${gap}-${index}`} className="rounded-lg border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-900">{gap}</span>
            ))}
          </div>
          <button onClick={() => navigateTo('recommendations')} className="mt-3 text-xs font-bold text-amber-900 underline">
            Lihat rekomendasi lanjutan
          </button>
        </div>
      )}

      {/* Topic-by-Topic Comparative Progress Bars */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Komparasi Performa per Topik (Awal vs Retest)
        </h3>

        <div className="space-y-4 pt-2">
          {topicComparisons.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {item.topic}
                </span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  Awal: <strong style={{ color: 'var(--color-text-secondary)' }}>{item.initialPercentage}%</strong> &rarr; Retest:{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>{item.retestPercentage}%</strong>{' '}
                  <span style={{ color: item.retestPercentage >= item.initialPercentage ? 'var(--color-accent)' : 'var(--color-danger)' }}>
                    ({item.status === 'Belum diuji' ? 'belum diuji' : item.retestPercentage >= item.initialPercentage ? `+${item.retestPercentage - item.initialPercentage}%` : `${item.retestPercentage - item.initialPercentage}%`})
                  </span>
                </span>
              </div>

              {/* Dual Bar */}
              <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.initialPercentage}%`, backgroundColor: 'var(--color-primary)' }}
                    title={`Awal: ${item.initialPercentage}%`}
                  />
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.retestPercentage}%`, backgroundColor: 'var(--color-accent)' }}
                    title={`Retest: ${item.retestPercentage}%`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          onClick={handleStartNextRetest}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: 'var(--color-primary)', // Blue 500
            color: "var(--color-surface)"
          }}
          title="Mulai retest berikutnya dengan maksimal 30 butir soal baru"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retest Ulang (Paket Maks. 30 Soal Baru #{retestAttempt})</span>
        </button>

        <button
          onClick={() => navigateTo('progress')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: 'var(--color-primary)', // Indigo 500
            color: "var(--color-surface)"
          }}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Grafik Progress</span>
        </button>

        <button
          onClick={() => navigateTo('dashboard')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-slate-100"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
        >
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};
