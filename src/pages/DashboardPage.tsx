import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileText,
  Play,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { TOPIC_RECOMMENDATIONS } from '../data/learningMaterials';

export const DashboardPage: React.FC = () => {
  const {
    initialResult,
    retestResult,
    navigateTo,
    completedMaterials,
    openVideoModal
  } = useApp();

  if (!initialResult) {
    return null; // Protected by router
  }

  // Calculate overall learning progress percentage
  const skillGapTopics = initialResult.skillGaps.map((s) => s.topic);
  const relevantRecs = skillGapTopics.flatMap((t) => TOPIC_RECOMMENDATIONS[t] || []);
  const totalRelevant = relevantRecs.length || 1;
  const completedCount = completedMaterials.filter((id) =>
    relevantRecs.some((r) => r.id === id)
  ).length;

  const baseProgress = retestResult ? 100 : Math.min(85, Math.round((completedCount / totalRelevant) * 100) + 20);

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#6366F1' // Indigo 500
              }}
            >
              Dashboard Evaluasi Siswa
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#F59E0B' // Amber 500
              }}
            >
              Kurikulum PHP 8.x
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
            Progress Kemampuan PHP
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
            Pantau status kompetensi, atasi skill gap melalui materi rekomendasi, dan validasi kenaikan skor via retest.
          </p>
        </div>

        {/* Quick Retest Action Button in Header */}
        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mulai Retest 50 Soal</span>
        </button>
      </div>

      {/* 4 Competency Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: '#111827', // Slate 900
            border: '1px solid #1E293B' // Slate 800
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#64748B' }}>
              Level Kemampuan
            </span>
            <span className="text-2xl sm:text-3xl font-black block" style={{ color: '#6366F1' }}>
              {retestResult ? retestResult.level : initialResult.level}
            </span>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: '#94A3B8' }}>
            {retestResult ? 'Hasil Validasi Retest' : 'Berdasarkan Tes Awal'}
          </span>
        </div>

        {/* Score Assessment */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#64748B' }}>
              Score Assessment
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: '#3B82F6' }}>
              {initialResult.score}%
            </span>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: '#94A3B8' }}>
            {initialResult.correctCount} / {initialResult.totalQuestions} Soal Benar
          </span>
        </div>

        {/* Skill Gap */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#64748B' }}>
              Skill Gap Kunci
            </span>
            <div className="text-sm font-bold truncate block" style={{ color: '#EF4444' }}>
              {initialResult.skillGaps.map((s) => s.topic).slice(0, 2).join(', ') || 'Nihil'}
            </div>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: '#94A3B8' }}>
            {initialResult.skillGaps.length} Topik Perlu Penguatan
          </span>
        </div>

        {/* Progress Belajar */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#64748B' }}>
              Progress Pembelajaran
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: '#10B981' }}>
              {baseProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden mt-3" style={{ backgroundColor: '#1E293B' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${baseProgress}%`, backgroundColor: '#10B981' }}
            />
          </div>
        </div>
      </div>

      {/* Retest Banner Callout */}
      {!retestResult ? (
        <div
          className="p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #3B82F6'
          }}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
                Siap Melakukan Retest 50 Soal PHP?
              </h3>
              <p className="text-xs mt-1 leading-relaxed max-w-xl" style={{ color: '#94A3B8' }}>
                Paket soal retest dihasilkan secara dinamis untuk menguji penguasaan pada topik kelemahan Anda. Soal berbeda dari tes awal.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('retest')}
            className="px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
            style={{
              backgroundColor: '#3B82F6',
              color: '#F8FAFC'
            }}
          >
            Mulai Retest Sekarang
          </button>
        </div>
      ) : (
        <div
          className="p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #10B981'
          }}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#10B981' }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
                Retest Selesai: Nilai Meningkat ke {retestResult.score}%
              </h3>
              <p className="text-xs mt-1 leading-relaxed max-w-xl" style={{ color: '#94A3B8' }}>
                Terjadi lonjakan dari skor awal {initialResult.score}% ke {retestResult.score}%. Lihat perbandingan topik dan penuntasan skill gap.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('retest_result')}
            className="px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
            style={{
              backgroundColor: '#10B981',
              color: '#F8FAFC'
            }}
          >
            Lihat Analisis Retest
          </button>
        </div>
      )}

      {/* Suggested Focus Materials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid #1E293B' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
              Materi yang Disarankan untuk Anda
            </h2>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              Bahan ajar terarah disesuaikan dengan hasil analisis evaluasi skill gap
            </p>
          </div>
          <button
            onClick={() => navigateTo('recommendations')}
            className="flex items-center gap-1 text-xs font-bold cursor-pointer hover:underline"
            style={{ color: '#3B82F6' }}
          >
            <span>Lihat Semua Rekomendasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {initialResult.skillGaps.slice(0, 3).map((gap, i) => {
            const recs = TOPIC_RECOMMENDATIONS[gap.topic] || [];
            const videoRec = recs.find((r) => r.type === 'video');

            return (
              <div
                key={i}
                className="p-5 rounded-2xl shadow-xl flex flex-col justify-between transition-all hover:border-blue-500"
                style={{
                  backgroundColor: '#111827', // Slate 900
                  border: '1px solid #1E293B' // Slate 800
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#EF4444'
                      }}
                    >
                      Skill Gap
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: '#94A3B8' }}>
                      {gap.score}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mb-1.5" style={{ color: '#F8FAFC' }}>
                    {gap.topic}
                  </h3>
                  <p className="text-xs line-clamp-2 leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                    {gap.summary}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #1E293B' }}>
                  <button
                    onClick={() => navigateTo('learning_detail', gap.topic)}
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline"
                    style={{ color: '#3B82F6' }}
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {videoRec && videoRec.embedVideoUrl && (
                    <button
                      onClick={() => openVideoModal(videoRec.title, videoRec.embedVideoUrl!)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      style={{ color: '#EF4444' }}
                      title="Tonton Video Pembelajaran Langsung"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
