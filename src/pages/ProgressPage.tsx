import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Flag,
  BookOpen,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { PHPTopic } from '../types';

const topicLabels: Partial<Record<PHPTopic, string>> = {
  'Dasar PHP': 'Dasar PHP',
  'Variabel dan Tipe Data': 'Variabel & tipe data',
  Operator: 'Operator',
  Conditional: 'Conditional',
  Looping: 'Looping',
  Array: 'Array',
  Function: 'Function',
  String: 'String',
  'Object Oriented Programming / OOP': 'OOP',
  'Database / MySQL': 'Database / MySQL',
  CRUD: 'CRUD',
  'Error Handling': 'Error handling'
};

const scoreY = (score: number) => 170 - (Math.max(0, Math.min(100, score)) / 100) * 140;

export const ProgressPage: React.FC = () => {
  const {
    initialResult,
    retestResult,
    retestComparison,
    navigateTo,
    competencyStatus,
    completedMaterials,
    completedMaterialDetails,
    markMaterialCompleted,
  } = useApp();

  if (!initialResult) {
    return (
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <p className="text-sm text-slate-600">Selesaikan tes awal terlebih dahulu untuk melihat perkembangan kemampuanmu.</p>
        <button onClick={() => navigateTo('assessment')} className="button-primary mt-4 px-5 py-2.5 text-xs">
          Mulai tes awal <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  const initialScore = initialResult.score;
  const retestScore = retestResult?.score ?? null;
  const scoreDiff = retestScore === null ? null : retestScore - initialScore;
  const resolvedCount = retestComparison?.resolvedSkillGaps.length ?? 0;
  const topics = (Object.keys(initialResult.topicScores) as PHPTopic[])
    .filter((topic) => initialResult.topicScores[topic]?.total > 0)
    .map((topic) => {
      const initial = initialResult.topicScores[topic].percentage;
      const latest = retestResult?.topicScores[topic]?.total
        ? retestResult.topicScores[topic].percentage
        : initial;
      return { topic, initial, latest, difference: latest - initial };
    })
    .sort((a, b) => a.latest - b.latest);

  const learnedMaterials = completedMaterials
    .map((id) => completedMaterialDetails[id] ?? {
      id,
      title: 'Materi yang sudah ditandai',
      topic: 'Topik tersimpan',
    })
    .sort((a, b) => (b.completedAt ? Date.parse(b.completedAt) : 0) - (a.completedAt ? Date.parse(a.completedAt) : 0));

  const chartPoints = retestScore === null
    ? [{ x: 100, score: initialScore }]
    : [{ x: 100, score: initialScore }, { x: 500, score: retestScore }];

  return (
    <div className="page-content progress-page space-y-4 py-1 sm:py-2">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Kemajuanmu, terlihat lebih jelas</h1>
          <p className="mt-1 text-sm text-slate-500">
            {retestResult
              ? `Perkembangan berdasarkan 2 evaluasi selesai · ${initialResult.date} – ${retestResult.date}`
              : `Hasil dari 1 evaluasi selesai · Tes awal ${initialResult.date}`}
          </p>
        </div>
        <button onClick={() => navigateTo('recommendations')} className="button-primary self-start px-4 py-2.5 text-xs sm:self-auto">
          Lihat rekomendasi <ArrowRight size={15} />
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Ringkasan kemajuan">
        <article className="panel p-3.5 sm:p-4">
          <p className="text-xs text-slate-500">{retestResult ? 'Skor terbaru' : 'Skor tes awal'}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{retestScore ?? initialScore}<span className="text-base font-semibold">/100</span></p>
          <p className="mt-2 text-xs text-slate-500">{retestResult ? `Naik dari ${initialScore} pada tes awal` : `${initialResult.correctCount} dari ${initialResult.totalQuestions} soal benar`}</p>
        </article>
        <article className="panel p-3.5 sm:p-4">
          <p className="text-xs text-slate-500">Peningkatan kemampuan</p>
          <p className={`mt-2 text-2xl font-bold ${scoreDiff === null ? 'text-slate-500' : scoreDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {scoreDiff === null ? '—' : `${scoreDiff > 0 ? '+' : ''}${scoreDiff} poin`}
          </p>
          <p className="mt-2 text-xs text-slate-500">{retestResult ? `${initialResult.date} ke ${retestResult.date}` : 'Selesaikan retest untuk melihat perubahan'}</p>
        </article>
        <article className="panel p-3.5 sm:p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-xs text-slate-500">Level terbaru</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{retestResult?.level ?? initialResult.level}</p>
          <p className="mt-2 text-xs text-slate-500">
            {retestResult ? `Sebelumnya ${initialResult.level}` : `${initialResult.skillGaps.length} topik perlu penguatan`}
          </p>
        </article>
      </section>

      <section className="panel p-4" aria-label="Status penguasaan kompetensi">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Status penguasaan kompetensi</h2>
          <p className="mt-1 text-xs text-slate-500">Status berasal dari jawaban tes. Tanda materi dipelajari tidak mengubah hasil evaluasi.</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(competencyStatus).map(([topic, competency]) => {
            if (!competency) return null;
            const label = competency.status === 'mastered' ? 'Dikuasai' : competency.status === 'needs_review' ? 'Perlu penguatan' : 'Belum dievaluasi';
            const style = competency.status === 'mastered' ? 'status-success' : competency.status === 'needs_review' ? 'status-warning' : 'status-neutral';
            return <div key={topic} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2"><span className="text-xs font-medium text-slate-700">{topic}</span><span className={`status-pill ${style}`}>{label}{competency.status !== 'not_assessed' ? ` · ${competency.score}%` : ''}</span></div>;
          })}
        </div>
      </section>

      <section className="panel p-4" aria-label="Materi yang sudah dipelajari">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-700"><BookOpen size={18} /></span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Materi yang sudah dipelajari</h2>
              <p className="mt-1 text-xs text-slate-500">Catatan ini tersimpan di akunmu dan akan muncul lagi saat kamu login.</p>
            </div>
          </div>
          <span className="status-pill status-primary">{learnedMaterials.length} materi</span>
        </div>
        {learnedMaterials.length ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {learnedMaterials.map((material) => (
              <li key={material.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{material.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{material.topic}{material.kind === 'exercise' ? ' · Latihan' : material.kind === 'example' ? ' · Contoh kode' : material.kind === 'source' ? ' · Sumber belajar' : ''}</p>
                  {material.completedAt && <p className="mt-1 text-[10px] text-slate-400">Ditandai {new Date(material.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => markMaterialCompleted(material.id, { title: material.title, topic: material.topic, kind: material.kind })}
                  className="shrink-0 text-[11px] font-semibold text-slate-500 hover:text-rose-700"
                  aria-label={`Hapus tanda dipelajari: ${material.title}`}
                >
                  Hapus tanda
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-600">Belum ada materi yang ditandai selesai.</p>
            <button onClick={() => navigateTo('recommendations')} className="mt-2 text-xs font-semibold text-indigo-600 hover:underline">Buka rekomendasi belajar <ArrowRight size={12} className="inline" /></button>
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <article className="panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Perkembangan skor</h2>
              <p className="mt-1 text-xs text-slate-500">Perubahan nilai dari hasil evaluasi yang sudah diselesaikan.</p>
            </div>
            <span className="status-pill status-neutral">{retestResult ? 'Tes awal → Retest' : 'Tes awal'}</span>
          </div>
          <div className="mt-4 overflow-hidden" role="img" aria-label={retestResult
            ? `Grafik skor meningkat dari ${initialScore} pada tes awal menjadi ${retestScore} pada retest`
            : `Grafik menampilkan satu hasil tes awal dengan skor ${initialScore}`}>
            <svg viewBox="0 0 600 220" className="h-36 w-full sm:h-40" preserveAspectRatio="none" aria-hidden="true">
              {[0, 25, 50, 75, 100].map((tick) => {
                const y = scoreY(tick);
                return (
                  <g key={tick}>
                    <text x="4" y={y + 4} fill="#94a3b8" fontSize="10">{tick}</text>
                    <line x1="48" x2="585" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray={tick === 0 ? undefined : '3 4'} />
                  </g>
                );
              })}
              {retestResult && (
                <line
                  x1={chartPoints[0].x}
                  y1={scoreY(chartPoints[0].score)}
                  x2={chartPoints[1].x}
                  y2={scoreY(chartPoints[1].score)}
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {chartPoints.map((point, index) => (
                <g key={`${point.x}-${point.score}`}>
                  <circle cx={point.x} cy={scoreY(point.score)} r="5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                  <text x={point.x} y={scoreY(point.score) - 13} textAnchor="middle" fill="#4f46e5" fontSize="12" fontWeight="700">{point.score}</text>
                  <text x={point.x} y="205" textAnchor="middle" fill="#64748b" fontSize="10">
                    {index === 0 ? 'Tes awal' : 'Retest'}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500">
            <span>{initialResult.date} · Tes awal</span>
            {retestResult && <span>{retestResult.date} · Retest</span>}
          </div>
        </article>

        <article className="panel p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Kemajuan per topik</h2>
              <p className="mt-1 text-xs text-slate-500">{retestResult ? 'Tes awal dibandingkan dengan retest' : 'Persentase benar dari tes awal'}</p>
            </div>
            {retestResult && <span className="text-[10px] text-slate-500">Awal → Retest</span>}
          </div>
          {topics.length ? (
            <div className="mt-3 space-y-3">
              {topics.map(({ topic, initial, latest, difference }) => (
                <div key={topic}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
                    <span className="truncate font-medium text-slate-700">{topicLabels[topic] ?? topic}</span>
                    <span className="shrink-0 font-semibold text-emerald-700">
                      {retestResult ? `${initial}% → ${latest}% (${difference > 0 ? '+' : ''}${difference})` : `${latest}%`}
                    </span>
                  </div>
                  <div
                    className="relative h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`Skor ${topicLabels[topic] ?? topic}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={latest}
                  >
                    <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-500" style={{ width: `${latest}%` }} />
                    {retestResult && (
                      <span className="absolute top-0 h-full w-0.5 bg-indigo-600" style={{ left: `calc(${initial}% - 1px)` }} aria-hidden="true" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-500">Belum ada topik terukur pada evaluasi ini.</p>
          )}
        </article>
      </section>

      <section className="panel p-4">
        <h2 className="text-base font-semibold text-slate-900">Tonggak perjalananmu</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={18} /></span>
            <div>
              <p className="text-xs font-semibold text-slate-800">Titik awal ditemukan</p>
              <p className="mt-1 text-[11px] text-slate-500">{initialResult.date}</p>
              <p className="mt-1 text-[11px] text-slate-500">Tes awal {initialScore}/100 · {initialResult.level}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${retestResult ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {retestResult ? <TrendingUp size={18} /> : <RotateCcw size={18} />}
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">{retestResult ? `Naik ke ${retestResult.level}` : 'Langkah berikutnya: retest'}</p>
              <p className="mt-1 text-[11px] text-slate-500">{retestResult ? retestResult.date : 'Ukur kembali kemajuan setelah belajar'}</p>
              <p className="mt-1 text-[11px] text-slate-500">{retestResult ? `Retest ${retestScore}/100 · ${scoreDiff !== null && scoreDiff > 0 ? '+' : ''}${scoreDiff} poin` : 'Bandingkan hasil antar evaluasi'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500"><Flag size={17} /></span>
            <div>
              <p className="text-xs font-semibold text-slate-800">Menuju level berikutnya</p>
              <p className="mt-1 text-[11px] text-slate-500">Target belajar: {retestResult?.level ?? initialResult.level}</p>
              <p className="mt-1 text-[11px] text-slate-500">Level ditentukan dari skor total dan penguasaan topik.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-3 text-[11px] text-slate-500 sm:flex-row sm:items-center">
        <p>Progres mencerminkan kemampuan yang terukur. Membuka sumber belajar tidak berarti kursus telah selesai.</p>
        <button onClick={() => navigateTo('retest')} className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800">
          <Award size={14} /> {retestResult ? 'Ukur kemajuan lagi' : 'Mulai retest'} <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
