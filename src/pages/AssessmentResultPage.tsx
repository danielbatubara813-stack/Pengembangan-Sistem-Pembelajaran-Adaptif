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
        <p className="text-sm" style={{ color: '#94A3B8' }}>Data assessment belum tersedia.</p>
        <button
          onClick={() => navigateTo('assessment')}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
        >
          Mulai Assessment
        </button>
      </div>
    );
  }

  const { score, level, correctCount, totalQuestions, aiAnalysis, skillGaps } = initialResult;

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      {/* Header Document */}
      <div className="pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold" style={{ color: '#10B981' }}>
          <CheckCircle2 className="w-4 h-4" />
          <span>Hasil Evaluasi Kompetensi &bull; Tanggal: {initialResult.date}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
          Laporan Hasil Assessment PHP
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
          Pengukuran 50 butir soal komprehensif berbasis 12 materi pokok kurikulum PHP.
        </p>
      </div>

      {/* Main Score & Diagnostic Row */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        {/* Score & Level Display */}
        <div
          className="md:col-span-5 pr-0 md:pr-6"
          style={{ borderRight: '1px solid #1E293B' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#64748B' }}>
            Skor Kemampuan
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-5xl sm:text-6xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>
              {score}
            </span>
            <span className="text-2xl font-bold" style={{ color: '#64748B' }}>/100</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: '#94A3B8' }}>Level:</span>
            <span
              className="text-xs font-bold font-mono px-3 py-1 rounded-full shadow-xs"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#6366F1' // Indigo 500
              }}
            >
              {level}
            </span>
            <span className="text-xs" style={{ color: '#64748B' }}>
              ({correctCount}/50 benar)
            </span>
          </div>
        </div>

        {/* AI Diagnostic Explanation */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#8B5CF6' }}>
            <Zap className="w-4 h-4" />
            <span>Diagnosis Adaptif AI / LLM:</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#F8FAFC' }}>
            {aiAnalysis.summary}
          </p>
          <div
            className="pt-2.5 text-xs leading-relaxed"
            style={{ borderTop: '1px solid #1E293B', color: '#94A3B8' }}
          >
            <strong style={{ color: '#F8FAFC' }}>Rencana Aksi:</strong> {aiAnalysis.actionPlan}
          </div>
        </div>
      </div>

      {/* Skill Gaps Breakdown */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1E293B'
        }}
      >
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid #1E293B' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
              Skill Gap yang Teridentifikasi
            </h2>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              Topik dengan performa di bawah standar yang memerlukan penguatan sebelum retest
            </p>
          </div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
          >
            {skillGaps.length} Topik Perlu Penguatan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {skillGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl flex flex-col justify-between"
              style={{
                backgroundColor: '#1E293B', // Slate 800
                border: '1px solid #334155' // Slate 700
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: '#F8FAFC' }}>{gap.topic}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#EF4444' }}>{gap.score}%</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                  {gap.summary}
                </p>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between text-xs" style={{ borderTop: '1px solid #334155' }}>
                <span style={{ color: '#64748B' }}>Prioritas: {gap.priority}</span>
                <button
                  onClick={() => navigateTo('learning_detail', gap.topic)}
                  className="font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  style={{ color: '#3B82F6' }}
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
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
          }}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Buka Dashboard &amp; Rekomendasi</span>
        </button>

        <button
          onClick={() => navigateTo('retest')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: '#10B981', // Emerald 500
            color: '#F8FAFC'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Langsung ke Retest 50 Soal</span>
        </button>
      </div>
    </div>
  );
};
