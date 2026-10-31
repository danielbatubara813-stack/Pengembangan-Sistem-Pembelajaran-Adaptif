import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import type { Recommendation } from '../types';
import { requestApi } from '../services/api';

export const DashboardPage: React.FC = () => {
  const {
    initialResult,
    retestResult,
    navigateTo,
    user
  } = useApp();
  const [recommendedSources, setRecommendedSources] = useState<Recommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void requestApi<{ recommendations?: Recommendation[] }>('/api/recommendations')
      .then((response) => {
        if (isMounted) setRecommendedSources(Array.isArray(response.recommendations) ? response.recommendations : []);
      })
      .catch((error: unknown) => {
        if (isMounted) setRecommendationsError(error instanceof Error ? error.message : 'Sumber belajar belum dapat dimuat.');
      })
      .finally(() => { if (isMounted) setRecommendationsLoading(false); });
    return () => { isMounted = false; };
  }, [initialResult?.id, retestResult?.id]);

  if (!initialResult) {
    return null; // Protected by router
  }

  const sourceCount = recommendedSources.length;
  const recommendationTopics = [...new Set(recommendedSources.map((source) => source.topic))];
  const scoreDifference = retestResult && initialResult ? retestResult.score - initialResult.score : null;
  const topicScores = Object.values(initialResult.topicScores)
    .filter((topic) => topic.total > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);
  const suggestedSources = recommendedSources.slice(0, 2);

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                color: 'var(--color-primary)' // Indigo 500
              }}
            >
              Ruang belajar
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-secondary)',
                border: '1px solid var(--color-secondary)',
                color: 'var(--color-text-primary)'
              }}
            >
              Kurikulum PHP 8.x
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Selamat datang, {user?.name?.split(' ')[0] || 'Pelajar'} 👋
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Kenali posisimu hari ini. Tentukan langkah belajar berikutnya.
          </p>
        </div>

        {/* Quick Retest Action Button in Header */}
        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: 'var(--color-primary)', // Blue 500
            color: "var(--color-surface)"
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{retestResult ? 'Ukur lagi' : 'Buka kesiapan retest'}</span>
        </button>
      </div>

      {/* 4 Competency Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)', // Slate 900
            border: '1px solid var(--color-border)' // Slate 800
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Level Kemampuan
            </span>
            <span className="text-2xl sm:text-3xl font-black block" style={{ color: 'var(--color-primary)' }}>
              {retestResult ? retestResult.level : initialResult.level}
            </span>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {retestResult ? 'Hasil Validasi Retest' : 'Berdasarkan Tes Awal'}
          </span>
        </div>

        {/* Score Assessment */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Score Assessment
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: 'var(--color-primary)' }}>
              {initialResult.score}%
            </span>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {initialResult.correctCount} / {initialResult.totalQuestions} Soal Benar
          </span>
        </div>

        {/* Skill Gap */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              {retestResult ? 'Fokus belajar berikutnya' : 'Skill Gap Kunci'}
            </span>
            <div className="text-sm font-bold block break-words" style={{ color: 'var(--color-danger)' }}>
              {recommendationTopics.slice(0, 2).join(', ') || 'Tidak ada rekomendasi aktif'}
            </div>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {recommendationTopics.length} Topik direkomendasikan oleh Laravel
          </span>
        </div>

        {/* Progress Belajar */}
        <div
          className="p-5 rounded-2xl shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Sumber eksternal
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono block" style={{ color: 'var(--color-accent)' }}>
              {recommendationsLoading ? 'Memuat...' : `${sourceCount} sumber`}
            </span>
          </div>
          <span className="text-[10px] mt-2 block" style={{ color: 'var(--color-text-secondary)' }}>Sesuai kebutuhan belajarmu</span>
        </div>
      </div>

      {/* Retest Banner Callout */}
      {!retestResult ? (
        <div
          className="p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)'
          }}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Siap Melakukan Retest Maksimal 30 Soal PHP?
              </h3>
              <p className="text-xs mt-1 leading-relaxed max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
                Paket soal retest dihasilkan secara dinamis untuk menguji penguasaan pada topik kelemahan Anda. Soal berbeda dari tes awal.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('retest')}
            className="px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: "var(--color-surface)"
            }}
          >
            Mulai Retest Sekarang
          </button>
        </div>
      ) : (
        <div
          className="p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-accent)'
          }}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Retest selesai: skor {retestResult.score}%
              </h3>
              <p className="text-xs mt-1 leading-relaxed max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
                Skor tes awal {initialResult.score}% ke retest {retestResult.score}% ({scoreDifference !== null && scoreDifference > 0 ? '+' : ''}{scoreDifference}). Lihat kompetensi yang sudah dikuasai dan yang masih perlu latihan.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('retest_result')}
            className="px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: "var(--color-surface)"
            }}
          >
            Lihat Analisis Retest
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Peta kemampuanmu</h2>
            <button onClick={() => navigateTo('analysis')} className="text-indigo-600" aria-label="Buka analisis kemampuan"><BarChart3 size={18} /></button>
          </div>
          <p className="mb-4 text-xs text-slate-500">Mulai dari area dengan jarak terbesar menuju target.</p>
          <div className="space-y-3">
            {topicScores.map((topic) => (
              <div key={topic.topic}>
                <div className="mb-1 flex justify-between gap-3 text-xs">
                  <span className="font-medium text-slate-700">{topic.topic}</span>
                  <span className="text-slate-500">{topic.percentage}/100</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${topic.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Pilihan untuk langkah pertamamu</h2>
            <span className="status-pill status-primary">Personal</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recommendationsError && <p className="py-3 text-xs text-rose-600">{recommendationsError}</p>}
            {!recommendationsLoading && !recommendationsError && suggestedSources.length === 0 && <p className="py-3 text-xs text-slate-500">Belum ada sumber karena tidak ada skill gap yang perlu diperkuat.</p>}
            {suggestedSources.map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 py-3 text-slate-700 no-underline hover:text-indigo-600">
                <span className="min-w-0">
                  <strong className="block truncate text-xs font-semibold">{source.title}</strong>
                  <small className="mt-1 block truncate text-[10px] text-slate-500">{source.publisher} · {source.topic} · {source.gap?.score ?? 0}/100</small>
                </span>
                <ArrowRight size={16} className="shrink-0" />
              </a>
            ))}
          </div>
          <button onClick={() => navigateTo('recommendations')} className="mt-3 border-t border-slate-100 pt-3 text-xs font-semibold text-indigo-600">Lihat semua sumber yang direkomendasikan <ArrowRight size={13} className="inline" /></button>
        </section>
      </div>

    </div>
  );
};
