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
    retestAttempt,
    regenerateRetestQuestions
  } = useApp();

  const handleStartNextRetest = async () => {
    await regenerateRetestQuestions();
    navigateTo('retest');
  };

  if (!retestResult || !retestComparison) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: '#94A3B8' }}>Hasil retest belum tersedia.</p>
        <button
          onClick={() => navigateTo('retest')}
          className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
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
    resolvedSkillGaps
  } = retestComparison;

  const isScorePositive = scoreDifference >= 0;

  return (
    <div className="py-2 sm:py-4 max-w-4xl mx-auto space-y-6">
      {/* Header Document */}
      <div className="pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10B981'
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Retest 50 Soal Selesai &amp; Dikomparasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
          Hasil Retest Kemampuan PHP
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
          Evaluasi komparasi capaian tes awal vs retest setelah mempelajari bahan ajar rekomendasi.
        </p>
      </div>

      {/* Main Score Banner */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl text-center"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: '#64748B' }}>
          Skor Hasil Retest
        </span>
        <div className="flex items-baseline justify-center gap-1 font-mono">
          <span className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#64748B' }}>/100</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Level Baru:</span>
          <span
            className="text-xs font-bold font-mono px-3 py-1 rounded-full shadow-xs"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981'
            }}
          >
            {level}
          </span>
          <span className="text-xs" style={{ color: '#64748B' }}>
            ({correctCount} dari {totalQuestions} soal benar)
          </span>
        </div>

        {/* 3 Metrics Row */}
        <div
          className="grid grid-cols-3 gap-3 mt-8 pt-6"
          style={{ borderTop: '1px solid #1E293B' }}
        >
          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#94A3B8' }}>
              Skor Tes Awal
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono" style={{ color: '#94A3B8' }}>
              {initialScore}%
            </span>
            <span className="text-[10px] block mt-1" style={{ color: '#64748B' }}>
              Level: {initialLevel}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#94A3B8' }}>
              Perkembangan Skor
            </span>
            <span
              className="text-xl sm:text-2xl font-black font-mono"
              style={{ color: isScorePositive ? '#10B981' : '#EF4444' }}
            >
              {isScorePositive ? `+${scoreDifference}%` : `${scoreDifference}%`}
            </span>
            <span className="text-[10px] block mt-1" style={{ color: '#64748B' }}>
              {isScorePositive ? 'Peningkatan Positif' : 'Perlu Pengulangan'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#94A3B8' }}>
              Status Level
            </span>
            <span className="text-xl sm:text-2xl font-black" style={{ color: '#6366F1' }}>
              {currentLevel}
            </span>
            <span className="text-[10px] block mt-1" style={{ color: '#64748B' }}>
              {initialLevel !== currentLevel ? `Naik dari ${initialLevel}` : 'Stabil'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Comparative Diagnostic Box */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-3"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1E293B'
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#8B5CF6' }}>
          <Zap className="w-4 h-4" />
          <span>Analisis Komparatif Evaluasi Adaptif:</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#F8FAFC' }}>
          {aiComparativeAnalysis}
        </p>
      </div>

      {/* Resolved Skill Gaps Confirmation */}
      {resolvedSkillGaps.length > 0 && (
        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#10B981' }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>Skill Gap yang Berhasil Dituntaskan:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {resolvedSkillGaps.map((g, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ backgroundColor: '#111827', color: '#10B981', border: '1px solid #1E293B' }}
              >
                &bull; {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Topic-by-Topic Comparative Progress Bars */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1E293B'
        }}
      >
        <h3 className="text-sm font-bold" style={{ color: '#F8FAFC' }}>
          Komparasi Performa per Topik (Awal vs Retest)
        </h3>

        <div className="space-y-4 pt-2">
          {topicComparisons.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold" style={{ color: '#F8FAFC' }}>
                  {item.topic}
                </span>
                <span className="font-mono text-[11px]" style={{ color: '#94A3B8' }}>
                  Awal: <strong style={{ color: '#94A3B8' }}>{item.initialPercentage}%</strong> &rarr; Retest:{' '}
                  <strong style={{ color: '#10B981' }}>{item.retestPercentage}%</strong>{' '}
                  <span style={{ color: item.retestPercentage >= item.initialPercentage ? '#10B981' : '#EF4444' }}>
                    ({item.retestPercentage >= item.initialPercentage ? `+${item.retestPercentage - item.initialPercentage}%` : `${item.retestPercentage - item.initialPercentage}%`})
                  </span>
                </span>
              </div>

              {/* Dual Bar */}
              <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.initialPercentage}%`, backgroundColor: '#6366F1' }}
                    title={`Awal: ${item.initialPercentage}%`}
                  />
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.retestPercentage}%`, backgroundColor: '#10B981' }}
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
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
          }}
          title="Mulai retest berikutnya dengan 50 butir soal baru yang digenerate AI"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retest Ulang (Paket 50 Soal Baru #{retestAttempt})</span>
        </button>

        <button
          onClick={() => navigateTo('progress')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: '#6366F1', // Indigo 500
            color: '#F8FAFC'
          }}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Grafik Progress</span>
        </button>

        <button
          onClick={() => navigateTo('dashboard')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-slate-800"
          style={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            color: '#F8FAFC'
          }}
        >
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};
