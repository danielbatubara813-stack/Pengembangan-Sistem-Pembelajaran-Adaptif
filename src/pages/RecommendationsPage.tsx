import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, FileText, PlayCircle, GraduationCap, Code2, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecommendationType } from '../types';
import type { Recommendation, SkillGapItem } from '../types';
import { requestApi } from '../services/api';

const filters: { id: 'all' | RecommendationType; label: string }[] = [
  { id: 'all', label: 'Semua sumber' },
  { id: 'dokumentasi', label: 'Dokumentasi' },
  { id: 'video', label: 'Video' },
  { id: 'artikel', label: 'Tutorial' },
  { id: 'website', label: 'Kursus' }
];

const sourceIcon = (type: RecommendationType) => {
  if (type === 'video') return <PlayCircle size={18} />;
  if (type === 'dokumentasi') return <BookOpen size={18} />;
  if (type === 'latihan') return <Code2 size={18} />;
  return <FileText size={18} />;
};

const externalLink = (url: string) => {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
};

interface LearningPathItem extends SkillGapItem {
  sequence: number;
  targetScore: number;
  reason: string;
  nextCompetency?: boolean;
  prerequisiteTopics: string[];
  resources: Recommendation[];
  searchStatus?: { status: string; candidateCount: number; acceptedCount: number; rejected: Record<string, number> };
}

interface RecommendationsResponse {
  source: string;
  assessment?: { score: number; level: string; type: string };
  learningPath: LearningPathItem[];
  recommendations: Recommendation[];
  emptyMessage?: string | null;
}

export const RecommendationsPage: React.FC = () => {
  const { initialResult, retestResult, navigateTo, markMaterialCompleted, completedMaterials, openVideoModal } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | RecommendationType>('all');
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const result = retestResult || initialResult;

  useEffect(() => {
    let isMounted = true;
    if (!result) {
      setData(null);
      setIsLoading(false);
      return () => { isMounted = false; };
    }

    setIsLoading(true);
    setLoadError(null);
    void requestApi<RecommendationsResponse>('/api/recommendations')
      .then((response) => { if (isMounted) setData(response); })
      .catch((error: unknown) => {
        if (isMounted) setLoadError(error instanceof Error ? error.message : 'Rekomendasi belum dapat dimuat.');
      })
      .finally(() => { if (isMounted) setIsLoading(false); });

    return () => { isMounted = false; };
  }, [result?.id]);

  const sources = (data?.recommendations ?? []).filter((source) =>
    externalLink(source.url) && (selectedFilter === 'all' || source.type === selectedFilter)
  );

  if (!result) return <div className="panel p-6 text-sm text-slate-600">Selesaikan tes awal untuk mendapatkan rekomendasi personal.</div>;

  return (
    <div className="page-content">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Belajar dari sumber tepercaya</span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Sumber yang tepat untuk langkahmu</h1>
          <p className="mt-1 text-sm text-slate-500">Berdasarkan {data?.assessment?.type === 'retest' ? 'retest' : 'tes awal'} {data?.assessment?.score ?? result.score}/100 · Prioritas ditentukan dari jawaban, kompetensi, dan tingkat kesulitan soal.</p>
        </div>
        <span className="status-pill status-primary"><GraduationCap size={13} className="mr-1" /> Sumber eksternal</span>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${selectedFilter === filter.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}
          >
            {filter.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">Urutan: paling relevan</span>
      </div>

      {isLoading && <div className="panel p-5 text-sm text-slate-600" role="status">Memuat progres dan learning path dari Laravel...</div>}
      {loadError && <div className="panel p-5 text-sm text-rose-700" role="alert">Rekomendasi gagal dimuat: {loadError}</div>}

      {!isLoading && !loadError && (data?.learningPath ?? []).length > 0 && (
        <section className="panel p-4 sm:p-5" aria-label="Learning path adaptif">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">Learning path sesuai hasil tes</h2>
            <p className="mt-1 text-xs text-slate-500">Rekomendasi mengikuti skor dan prasyarat. Pilih, ulang, lewati, atau pindah topik sesuka hati; tidak ada urutan wajib.</p>
          </div>
          <ol className="grid gap-3 md:grid-cols-2">
            {data!.learningPath.map((step) => {
              const videoResource = step.resources?.find((r) => r.type === 'video' && r.embedVideoUrl);
              return (
                <li key={step.topic} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="status-pill status-primary">Kompetensi {step.sequence}</span>
                      <span className="status-pill status-neutral">Prioritas {step.priority}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">{step.competencyName || step.topic}</h3>
                    <span className="mt-1 inline-flex status-pill status-neutral">{step.topic} · {step.score}/100</span>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{step.reason}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-700"><strong>Tujuan:</strong> {step.learningObjective || step.recommendationFocus}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Target penguasaan: {step.targetScore}/100 · {step.searchStatus?.acceptedCount ?? step.resources?.length ?? 0} sumber lolos validasi dari {step.searchStatus?.candidateCount ?? step.resources?.length ?? 0} kandidat.</p>

                    {step.exampleCode && <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100"><code>{step.exampleCode}</code></pre>}
                    {step.practicePrompt && <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs leading-5 text-indigo-900"><strong>Latihan:</strong> {step.practicePrompt}</p>}

                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                        <p className="text-[11px] font-semibold text-slate-700">Sumber belajar internet terverifikasi:</p>
                        <div className="flex flex-col gap-1.5">
                          {step.resources.map((res) => (
                            <div key={res.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs hover:bg-slate-100/80 transition-colors">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded text-xs ${res.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                  {res.type === 'video' ? <Play size={11} className="fill-current" /> : <BookOpen size={11} />}
                                </span>
                                <span className="truncate text-[11px] font-medium text-slate-800" title={res.title}>{res.title}</span>
                                <span className="shrink-0 text-[10px] text-slate-400">({res.publisher || (res.type === 'video' ? 'YouTube' : 'Web')})</span>
                              </div>
                              <div className="shrink-0 flex items-center gap-1.5">
                                {res.type === 'video' && res.embedVideoUrl ? (
                                  <button
                                    onClick={() => openVideoModal(res.title, res.embedVideoUrl!)}
                                    className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
                                  >
                                    <Play size={11} className="fill-current" /> Putar
                                  </button>
                                ) : (
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200 px-2 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                                  >
                                    Buka <ExternalLink size={11} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!step.resources || step.resources.length === 0) && (step.searchStatus?.status === 'no_results' || step.searchStatus?.status === 'no_matching_sources' || step.searchStatus?.status === 'search_unavailable')
                      ? <p className="mt-2 text-xs text-amber-700">Belum ditemukan sumber yang dapat direkomendasikan setelah validasi.</p>
                      : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => navigateTo('learning_detail', step.topic, step.competencyKey)}
                      className="button-primary min-h-8 px-3 text-xs flex items-center gap-1.5"
                    >
                      Buka Materi & Latihan <ArrowRight size={13} />
                    </button>
                    {videoResource && (
                      <button
                        onClick={() => openVideoModal(videoResource.title, videoResource.embedVideoUrl!)}
                        className="button-secondary min-h-8 px-3 text-xs flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Play size={12} className="fill-current" /> Tonton Video
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {!isLoading && !loadError && sources.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sources.map((source) => (
            <article key={source.id} className="panel flex min-h-52 flex-col p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">{sourceIcon(source.type)}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{source.publisher || 'Sumber eksternal'}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{source.type === 'dokumentasi' ? 'Dokumentasi PHP' : source.type === 'video' ? 'Video' : source.type === 'website' ? 'Kursus / website' : 'Tutorial'}</p>
                  </div>
                </div>
                <a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Buka ${source.title} di tab baru`} className="text-slate-500 hover:text-indigo-600"><ExternalLink size={16} /></a>
              </div>
              <h2 className="mt-3 text-base font-semibold">{source.title}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="status-pill status-primary">{source.topic}</span>
                <span className="status-pill status-neutral">{result.level}</span>
                {source.linkKind === 'search' && <span className="status-pill status-neutral">Hasil pencarian</span>}
                {source.validation?.contentRelevant && <span className="status-pill status-success">Konten relevan</span>}
                {source.type === 'video' && source.validation?.videoPlayable && <span className="status-pill status-success">Video dapat diputar</span>}
              </div>
              {source.competencyName && <p className="mt-2 text-xs font-medium text-slate-700">Untuk: {source.competencyName}</p>}
              <p className="mt-1 flex-1 text-xs leading-5 text-slate-500">{source.description}</p>
              {source.reason && <p className="mt-2 text-[11px] leading-5 text-slate-600">Alasan cocok: {source.reason}</p>}
              {source.validation && <p className="mt-1 text-[10px] text-slate-500">URL valid · halaman {source.validation.httpStatus ?? 'tersedia'} · konten diperiksa{source.type === 'video' ? ' · pemutaran diverifikasi' : ''}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div>
                  <p className="text-[11px] text-slate-500">Skor {source.gap?.score ?? 0}/100 · {source.gap?.recommendationFocus || 'Materi penguatan sesuai skill gap.'}</p>
                  {(source.readTime || source.estimatedMinutes) && <p className="mt-1 text-[10px] text-slate-500">Durasi: {source.readTime || `${source.estimatedMinutes} menit`}</p>}
                  <button className="mt-1 text-[11px] font-semibold text-indigo-600 hover:underline" onClick={() => navigateTo('learning_detail', source.topic, source.competencyKey)}>Detail rekomendasi <ArrowRight size={12} className="inline" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => markMaterialCompleted(source.id, { title: source.title, topic: source.topic, kind: 'source' })} className="text-[11px] font-semibold text-indigo-600 hover:underline">
                    {completedMaterials.includes(source.id) ? 'Hapus catatan dipelajari' : 'Catat dipelajari'}
                  </button>
                  {source.type === 'video' && source.embedVideoUrl ? (
                    <button onClick={() => openVideoModal(source.title, source.embedVideoUrl!)} className="button-primary min-h-9 px-3 text-xs">
                      Putar video <Play size={14} />
                    </button>
                  ) : (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="button-primary min-h-9 px-3 text-xs">Buka sumber <ExternalLink size={14} /></a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !isLoading && !loadError ? (
        <div className="panel p-8 text-center">
          <BookOpen className="mx-auto text-slate-400" size={24} />
          <p className="mt-3 text-sm font-medium text-slate-700">{selectedFilter === 'all' ? (data?.emptyMessage || 'Belum ditemukan sumber belajar yang sesuai dan lolos validasi.') : 'Belum ada sumber untuk filter ini.'}</p>
          {selectedFilter !== 'all' && <button onClick={() => setSelectedFilter('all')} className="mt-3 text-xs font-semibold text-indigo-600">Lihat semua sumber</button>}
        </div>
      ) : null}

      <div className="notice-panel mt-4">
        <BookOpen size={17} />
        <p className="text-xs leading-5 text-slate-600">Menonton atau mencatat materi sebagai dipelajari tidak mengubah status penguasaan. Kompetensi hanya diperbarui berdasarkan jawaban retest.</p>
      </div>
    </div>
  );
};
