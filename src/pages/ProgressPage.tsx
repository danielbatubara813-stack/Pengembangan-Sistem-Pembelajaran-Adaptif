import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  BarChart2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const {
    initialResult,
    retestResult,
    retestComparison,
    navigateTo
  } = useApp();

  if (!initialResult) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: '#94A3B8' }}>Selesaikan assessment awal terlebih dahulu.</p>
        <button
          onClick={() => navigateTo('assessment')}
          className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
        >
          Mulai Assessment
        </button>
      </div>
    );
  }

  const initialScore = initialResult.score;
  const retestScore = retestResult ? retestResult.score : null;
  const scoreDiff = retestResult ? retestResult.score - initialResult.score : null;
  const initialLevel = initialResult.level;
  const currentLevel = retestResult ? retestResult.level : initialResult.level;

  const initialSkillGaps = initialResult.skillGaps.map((s) => s.topic);
  const currentSkillGaps = retestResult
    ? retestResult.skillGaps.map((s) => s.topic)
    : initialSkillGaps;

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#6366F1' }}>
            Laporan Perkembangan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: '#F8FAFC' }}>
            Grafik Perkembangan Kompetensi
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
            Pemantauan visual kenaikan nilai dan penyelesaian skill gap dari waktu ke waktu.
          </p>
        </div>

        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retest Ulang 50 Soal</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
        >
          <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#64748B' }}>
            Skor Tes Awal
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: '#94A3B8' }}>
            {initialScore}%
          </span>
          <span className="text-[10px] mt-1 block" style={{ color: '#64748B' }}>
            Level: {initialLevel}
          </span>
        </div>

        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
        >
          <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#64748B' }}>
            Skor Retest Terkini
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: retestScore ? '#10B981' : '#64748B' }}>
            {retestScore !== null ? `${retestScore}%` : 'Belum Retest'}
          </span>
          <span className="text-[10px] mt-1 block" style={{ color: '#64748B' }}>
            Level: {currentLevel}
          </span>
        </div>

        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
        >
          <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#64748B' }}>
            Perubahan Skor
          </span>
          <span
            className="text-2xl sm:text-3xl font-black font-mono block"
            style={{ color: scoreDiff && scoreDiff >= 0 ? '#10B981' : scoreDiff ? '#EF4444' : '#64748B' }}
          >
            {scoreDiff !== null ? (scoreDiff >= 0 ? `+${scoreDiff}%` : `${scoreDiff}%`) : '0%'}
          </span>
          <span className="text-[10px] mt-1 block" style={{ color: '#64748B' }}>
            Delta Performa
          </span>
        </div>

        <div
          className="p-5 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
        >
          <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: '#64748B' }}>
            Status Skill Gap
          </span>
          <span className="text-2xl sm:text-3xl font-black block" style={{ color: '#F59E0B' }}>
            {retestComparison?.resolvedSkillGaps?.length || 0} Tuntas
          </span>
          <span className="text-[10px] mt-1 block" style={{ color: '#64748B' }}>
            Dari {initialSkillGaps.length} Target
          </span>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-5"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <h2 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
          Grafik Perbandingan Nilai Evaluasi
        </h2>

        <div className="space-y-4 pt-2">
          {/* Initial Assessment Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: '#F8FAFC' }}>
                Assessment Awal (50 Soal)
              </span>
              <span className="font-mono font-bold" style={{ color: '#94A3B8' }}>
                {initialScore}% (Level {initialLevel})
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${initialScore}%`, backgroundColor: '#6366F1' }}
              />
            </div>
          </div>

          {/* Retest Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: '#F8FAFC' }}>
                Retest Adaptif (50 Soal)
              </span>
              <span className="font-mono font-bold" style={{ color: retestScore ? '#10B981' : '#64748B' }}>
                {retestScore !== null ? `${retestScore}% (Level ${currentLevel})` : 'Belum Ditempuh'}
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${retestScore || 0}%`,
                  backgroundColor: '#10B981'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Evolution of Skill Gaps */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1E293B'
        }}
      >
        <h3 className="text-sm font-bold" style={{ color: '#F8FAFC' }}>
          Evolusi Status Skill Gap
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {initialResult.skillGaps.map((gap, i) => {
            const isResolved = retestComparison?.resolvedSkillGaps?.includes(gap.topic);
            return (
              <div
                key={i}
                className="p-4 rounded-xl flex items-center justify-between"
                style={{
                  backgroundColor: '#1E293B',
                  border: isResolved ? '1px solid #10B981' : '1px solid #334155'
                }}
              >
                <div>
                  <span className="text-xs font-bold block" style={{ color: '#F8FAFC' }}>
                    {gap.topic}
                  </span>
                  <span className="text-[11px]" style={{ color: '#94A3B8' }}>
                    Skor Awal: {gap.score}%
                  </span>
                </div>

                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: isResolved ? '#10B981' : '#EF4444'
                  }}
                >
                  {isResolved ? 'Tuntas' : 'Perlu Penguatan'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
