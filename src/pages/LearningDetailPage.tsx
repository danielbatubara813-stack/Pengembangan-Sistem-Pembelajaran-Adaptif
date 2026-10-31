import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Globe2, Sparkles, Play, BookOpen, Code2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PHPTopic, Recommendation } from '../types';
import { requestApi } from '../services/api';
import { LEARNING_DETAILS } from '../data/learningMaterials';

interface LearningPathItem {
  topic: PHPTopic;
  competencyKey?: string;
  competencyName?: string;
  learningObjective?: string;
  exampleCode?: string | null;
  practicePrompt?: string | null;
  score: number;
  priority: string;
  targetScore: number;
  reason: string;
  nextCompetency?: boolean;
  prerequisiteTopics: PHPTopic[];
  resources: Recommendation[];
}

export const LearningDetailPage: React.FC = () => {
  const { selectedTopicForDetail, selectedCompetencyKeyForDetail, initialResult, retestResult, navigateTo, markMaterialCompleted, completedMaterials, competencyStatus, openVideoModal } = useApp();
  const result = retestResult || initialResult;
  const [learningPath, setLearningPath] = useState<LearningPathItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [shownSolutions, setShownSolutions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    if (!result) {
      setLearningPath([]);
      setIsLoading(false);
      return () => { isMounted = false; };
    }
    setIsLoading(true);
    setLoadError(null);
    void requestApi<{ learningPath?: LearningPathItem[] }>('/api/recommendations')
      .then((response) => { if (isMounted) setLearningPath(Array.isArray(response.learningPath) ? response.learningPath : []); })
      .catch((error: unknown) => { if (isMounted) setLoadError(error instanceof Error ? error.message : 'Materi belum dapat dimuat.'); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [result?.id]);

  if (!result) return <div className="panel p-6 text-sm text-slate-600">Selesaikan tes awal untuk melihat detail rekomendasi.</div>;

  const selectedStep = learningPath.find((item) => item.competencyKey === selectedCompetencyKeyForDetail);
  const activeTopic: PHPTopic = selectedStep?.topic || selectedTopicForDetail || learningPath[0]?.topic || result.skillGaps[0]?.topic || 'Dasar PHP';
  const step = selectedStep || learningPath.find((item) => item.topic === activeTopic);
  const learning = LEARNING_DETAILS[activeTopic];
  const topicSources = step?.resources ?? [];
  const videoSource = topicSources.find((item) => item.type === 'video');
  const source = topicSources.find((item) => item.type !== 'video') ?? topicSources[0];
  const gap = result.skillGaps.find((item) => item.competencyKey && item.competencyKey === step?.competencyKey)
    || result.skillGaps.find((item) => item.topic === activeTopic);
  const competency = competencyStatus[activeTopic];
  const assessedScore = competency?.status === 'not_assessed'
    ? null
    : competency?.score ?? gap?.score ?? step?.score ?? (result.topicScores[activeTopic]?.total ? result.topicScores[activeTopic].percentage : null);
  const sourceHost = source ? (source.publisher || new URL(source.url).hostname.replace(/^www\./, '')) : '';
  const topicSlug = activeTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="page-content">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Rekomendasi / Detail</span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">{step?.competencyName || source?.title || activeTopic}</h1>
          <p className="mt-1 text-sm text-slate-500">Sumber belajar eksternal · {source?.publisher || 'Sumber tepercaya'}</p>
        </div>
        <button onClick={() => navigateTo('recommendations')} className="button-secondary"><ArrowLeft size={15} /> Kembali ke rekomendasi</button>
      </header>

      <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
        <label className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          Pilih topik
          <select value={activeTopic} onChange={(event) => navigateTo('learning_detail', event.target.value as PHPTopic)} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            {Object.keys(LEARNING_DETAILS).map((topic) => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </label>
        {competency && (
          <span className={`status-pill ${competency.status === 'mastered' ? 'status-success' : competency.status === 'needs_review' ? 'status-warning' : 'status-neutral'}`}>
            {competency.status === 'mastered' ? `Dikuasai lewat evaluasi (${competency.score}%)` : competency.status === 'needs_review' ? `Perlu penguatan (${competency.score}%)` : 'Belum dievaluasi'}
          </span>
        )}
      </div>

      {!isLoading && !loadError && topicSources.length === 0 && (
        <section className="panel mt-4 p-5" role="status">
          <h2 className="text-sm font-semibold">Belum ditemukan sumber eksternal yang sesuai</h2>
          <p className="mt-2 text-xs leading-5 text-slate-600">Tautan hanya muncul setelah Laravel memeriksa URL, akses halaman, isi, dan kecocokannya dengan kompetensi ini.</p>
        </section>
      )}

      {step && <section className="panel mt-4 p-5">
        <h2 className="text-base font-semibold">Kompetensi: {step.competencyName || step.topic}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{step.learningObjective || step.reason}</p>
        {step.exampleCode && <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100"><code>{step.exampleCode}</code></pre>}
        {step.practicePrompt && <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs leading-5 text-indigo-900"><strong>Latihan:</strong> {step.practicePrompt}</p>}
      </section>}

      {isLoading && <div className="panel p-4 text-sm text-slate-600" role="status">Memuat detail learning path...</div>}
      {loadError && <div className="panel p-4 text-sm text-rose-700" role="alert">Materi gagal dimuat: {loadError}</div>}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-5 sm:p-6">
          <span className="status-pill status-success">Materi sesuai topik</span>
          <div className="mt-4 flex items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Globe2 size={26} /></span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{source?.publisher || activeTopic}</h2>
              <p className="mt-1 text-xs text-slate-500">{source?.type || 'Sumber belajar'} · {sourceHost}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{step?.reason || source?.description || `Belum ada skill gap aktif pada ${activeTopic}.`}</p>
          <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">
            <strong>Target belajar:</strong> {step ? `${step.targetScore}/100` : 'Materi pilihan Anda. Tidak perlu menyelesaikan materi lain.'}
            {step?.prerequisiteTopics.length ? <span className="mt-1 block"><strong>Prasyarat:</strong> {step.prerequisiteTopics.join(', ')}</span> : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 py-4 text-xs">
            <div><span className="text-slate-500">Topik</span><strong className="mt-1 block">{activeTopic}</strong></div>
            <div><span className="text-slate-500">Skor kompetensi terakhir</span><strong className="mt-1 block">{competency ? `${competency.score}/100` : 'Belum diukur'}</strong></div>
            <div><span className="text-slate-500">Bahasa</span><strong className="mt-1 block">Sesuai sumber</strong></div>
            <div><span className="text-slate-500">Durasi</span><strong className="mt-1 block">{source?.readTime || (source?.estimatedMinutes ? `${source.estimatedMinutes} menit` : 'Tidak diketahui')}</strong></div>
          </div>
          {source && (
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500">Tujuan situs asli</span>
              <p className="mt-1 break-all text-xs text-indigo-600">{source.url}</p>
            </div>
          )}
          {videoSource?.embedVideoUrl && (
            <button onClick={() => openVideoModal(videoSource.title, videoSource.embedVideoUrl!)} className="button-primary mt-4 w-full">
              <Play size={15} /> Putar video: {videoSource.title}
            </button>
          )}
          {source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="button-secondary mt-2 w-full">Buka dokumentasi {sourceHost} <ExternalLink size={15} /></a>}
        </section>

        <div className="space-y-4">
          <section className="panel p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold"><Sparkles className="text-indigo-600" size={18} /> Mengapa untukmu?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{assessedScore === null ? `${activeTopic} belum pernah diukur dalam evaluasi.` : `Hasil evaluasi terakhir menunjukkan ${activeTopic} mendapat skor ${assessedScore}/100.`} Prioritas: {step?.priority ?? gap?.priority ?? 'belum ada'}.</p>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold">Fokus belajar</h3>
              <p className="mt-2 text-sm leading-5 text-slate-500">{gap?.recommendationFocus || `Perkuat pemahaman dan praktik pada ${activeTopic}.`}</p>
            </div>
          </section>
          <section className="notice-panel">
            <Sparkles size={17} />
            <div>
              <h2 className="text-sm font-semibold">Belajar di sumber asli</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Video dapat diputar di sini. Melihat atau menonton materi tidak mengubah status penguasaan; nilai hanya diperbarui lewat evaluasi.</p>
            </div>
          </section>
        </div>
      </div>

      {topicSources.length > 0 && (
        <section className="panel mt-4 p-5">
          <h2 className="text-base font-semibold">Urutan sumber belajar</h2>
          <ol className="mt-3 space-y-3">
            {topicSources.map((item, index) => {
              const materialId = item.id.startsWith('resource:') ? item.id : `resource:${topicSlug}:${item.type === 'video' ? 'video' : 'manual'}`;
              return (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{index + 1}. {item.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{item.publisher} | {item.type === 'video' ? 'video pembelajaran spesifik' : 'dokumentasi resmi PHP'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => markMaterialCompleted(materialId, { title: item.title, topic: activeTopic, kind: 'source' })} className="text-[11px] font-semibold text-indigo-600 hover:underline">
                    {completedMaterials.includes(materialId) ? 'Hapus catatan dipelajari' : 'Catat dipelajari'}
                  </button>
                  {item.type === 'video' && item.embedVideoUrl ? (
                    <button onClick={() => openVideoModal(item.title, item.embedVideoUrl!)} className="button-secondary min-h-8 px-3 text-xs"><Play size={13} /> Putar</button>
                  ) : <a href={item.url} target="_blank" rel="noopener noreferrer" className="button-secondary min-h-8 px-3 text-xs">Buka <ExternalLink size={13} /></a>}
                </div>
              </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="panel mt-4 p-5">
        <div className="flex items-center gap-2"><BookOpen size={18} className="text-indigo-600" /><h2 className="text-base font-semibold">Materi dan contoh kode: {learning.title}</h2></div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{learning.overview}</p>
        <div className="mt-4 space-y-3">
          {learning.keyConcepts.map((concept, index) => {
            const materialId = `resource:${topicSlug}:example-${index + 1}`;
            return (
              <article key={concept.heading} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="text-sm font-semibold">{concept.heading}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{concept.description}</p></div>
                  <button onClick={() => markMaterialCompleted(materialId, { title: concept.heading, topic: activeTopic, kind: 'example' })} className="text-[11px] font-semibold text-indigo-600 hover:underline">
                    {completedMaterials.includes(materialId) ? 'Hapus catatan dipelajari' : 'Catat contoh dipelajari'}
                  </button>
                </div>
                {concept.codeExample && <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100"><code>{concept.codeExample}</code></pre>}
              </article>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-rose-50 p-4"><h3 className="text-sm font-semibold text-rose-900">Kesalahan yang sering terjadi</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-rose-900">{learning.commonPitfalls.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="rounded-xl bg-emerald-50 p-4"><h3 className="text-sm font-semibold text-emerald-900">Praktik yang disarankan</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-emerald-900">{learning.bestPractices.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="panel mt-4 p-5">
        <div className="flex items-center gap-2"><Code2 size={18} className="text-indigo-600" /><h2 className="text-base font-semibold">Latihan sesuai topik</h2></div>
        <div className="mt-3 space-y-3">
          {learning.exercises.map((exercise, index) => {
            const materialId = `resource:${topicSlug}:exercise-${index + 1}`;
            const isSolutionVisible = !!shownSolutions[index];
            return (
              <article key={exercise.title} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">{exercise.title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{exercise.prompt}</p><p className="mt-2 text-xs text-slate-500"><strong>Petunjuk:</strong> {exercise.hint}</p></div>
                  <button onClick={() => markMaterialCompleted(materialId, { title: exercise.title, topic: activeTopic, kind: 'exercise' })} className="text-[11px] font-semibold text-indigo-600 hover:underline">{completedMaterials.includes(materialId) ? 'Hapus catatan dipelajari' : 'Catat latihan dipelajari'}</button>
                </div>
                <button onClick={() => setShownSolutions((previous) => ({ ...previous, [index]: !previous[index] }))} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  {isSolutionVisible ? <EyeOff size={14} /> : <Eye size={14} />}{isSolutionVisible ? 'Sembunyikan contoh solusi' : 'Lihat contoh solusi'}
                </button>
                {isSolutionVisible && <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100"><code>{exercise.solution}</code></pre>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel mt-4 flex flex-wrap items-center justify-between gap-4 p-5">
        <div><h2 className="font-semibold">Pilih sendiri kapan ingin retest.</h2><p className="mt-1 text-xs text-slate-500">Anda boleh belajar sebagian, mengulang, berpindah topik, atau retest sekarang tanpa menyelesaikan semua materi.</p></div>
        <button onClick={() => navigateTo('retest')} className="button-primary">Buka kesiapan retest <ArrowRight size={16} /></button>
      </section>
    </div>
  );
};
