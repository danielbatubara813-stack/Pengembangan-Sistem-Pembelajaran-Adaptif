import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, CircleDot, Flag, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PHPDifficulty, TopicScore } from '../types';

const levelCriteria: { level: PHPDifficulty; score: string; topics: string; description: string }[] = [
  { level: 'Beginner', score: 'Di bawah 70', topics: 'Belum semua topik mencapai 60', description: 'Bangun dasar PHP, variabel, tipe data, dan alur kontrol.' },
  { level: 'Intermediate', score: '70–84', topics: 'Semua topik minimal 60', description: 'Terapkan OOP, database, dan pola kode yang lebih terstruktur.' },
  { level: 'Advanced', score: '85 atau lebih', topics: 'Semua topik minimal 80', description: 'Kuasai konsep lintas topik dan pilih pendekatan implementasi yang tepat.' }
];

const useScores = () => {
  const { initialResult, retestResult } = useApp();
  const result = retestResult || initialResult;
  const scores = result
    ? Object.values(result.topicScores).filter((topic) => topic.total > 0).sort((a, b) => a.percentage - b.percentage)
    : [];
  return { result, scores };
};

const PageTitle = ({ eyebrow, title, description, action }: {
  eyebrow: string; title: string; description: string; action?: React.ReactNode;
}) => (
  <header className="flex flex-wrap items-start justify-between gap-4 mb-5">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
    {action}
  </header>
);

const ScoreBars = ({ scores, threshold }: { scores: TopicScore[]; threshold?: number }) => (
  <div className="space-y-4">
    {scores.map(({ topic, percentage }) => (
      <div key={topic}>
        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-slate-800">{topic}</span>
          <span className="font-semibold text-slate-600">{percentage}/100</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
          {threshold !== undefined && <span className="absolute top-0 bottom-0 z-10 w-px bg-slate-500" style={{ left: `${threshold}%` }} />}
          <span className="block h-full rounded-full bg-indigo-600" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const DataUnavailable = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
    Selesaikan tes awal untuk melihat analisis kemampuanmu.
  </div>
);

export const AnalysisPage: React.FC = () => {
  const { result, scores } = useScores();
  const { navigateTo } = useApp();
  if (!result) return <DataUnavailable />;
  const strongCount = scores.filter((topic) => topic.percentage >= 60).length;
  const gaps = scores.filter((topic) => topic.percentage < 60);

  return (
    <div className="page-content">
      <PageTitle
        eyebrow="Kemampuan"
        title="Pahami kekuatan dan celahmu"
        description={`Peta kemampuan berdasarkan ${result.type === 'retest' ? 'retest' : 'tes awal'} pada ${result.date}.`}
        action={<button className="button-secondary" onClick={() => navigateTo('classification')}>Lihat klasifikasi level <ArrowRight size={16} /></button>}
      />
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="panel p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold">Sebaran kemampuan PHP</h2>
            <span className="status-pill status-primary">Tes {result.score}/100</span>
          </div>
          <ScoreBars scores={scores} threshold={60} />
        </section>
        <div className="space-y-4">
          <section className="panel p-5">
            <CheckCircle2 className="mb-3 text-emerald-700" size={20} />
            <h2 className="text-base font-semibold">Fondasi menjadi kekuatan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{strongCount} dari {scores.length} topik telah mencapai batas minimum 60.</p>
          </section>
          <section className="notice-panel">
            <Sparkles size={18} />
            <div>
              <h2 className="text-sm font-semibold">Area yang perlu perhatian</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {gaps.length ? gaps.map((topic) => topic.topic).join(', ') : 'Pertahankan konsistensi dan lanjutkan latihan lintas topik.'}
              </p>
            </div>
          </section>
        </div>
      </div>
      <section className="panel mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Topik</th><th>Skor</th><th>Status</th><th>Interpretasi</th></tr></thead>
            <tbody>{scores.map((item) => (
              <tr key={item.topic}>
                <td className="font-semibold text-slate-800">{item.topic}</td>
                <td>{item.percentage}/100</td>
                <td><span className={`status-pill ${item.percentage >= 70 ? 'status-success' : item.percentage >= 60 ? 'status-neutral' : 'status-primary'}`}>{item.percentage >= 70 ? 'Kuat' : item.percentage >= 60 ? 'Cukup' : 'Prioritas'}</span></td>
                <td>{item.percentage >= 60 ? 'Pertahankan pemahaman dan gunakan pada latihan berikutnya.' : 'Perkuat konsep dasar dan coba contoh bertahap.'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">Analisis dihitung dari jawaban pada soal yang tersedia untuk setiap topik.</p>
    </div>
  );
};

export const ClassificationPage: React.FC = () => {
  const { result, scores } = useScores();
  const { navigateTo } = useApp();
  if (!result) return <DataUnavailable />;

  return (
    <div className="page-content">
      <PageTitle eyebrow="Kemampuan" title={`Level kemampuanmu: ${result.level}`} description="Level menunjukkan langkah belajar yang relevan, bukan batas kemampuan." />
      <section className="level-banner">
        <div className="level-banner-icon"><CircleDot size={24} /></div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold">Terus tumbuh selangkah demi selangkah.</h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">Skor {result.score}/100 pada evaluasi {result.date}. Fokuskan latihan pada topik yang belum mencapai target berikutnya.</p>
        </div>
        <div className="shrink-0 text-right">
          <strong className="text-3xl">{result.score}</strong><span className="ml-1 text-sm text-slate-300">/ 100</span>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {levelCriteria.map((criteria) => (
          <article key={criteria.level} className={`panel p-5 ${result.level === criteria.level ? 'level-card-current' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <Flag size={18} className="text-indigo-600" />
              {result.level === criteria.level && <span className="status-pill status-primary">Level saat ini</span>}
            </div>
            <h2 className="mt-4 text-xl font-semibold">{criteria.level}</h2>
            <p className="mt-2 text-xs font-semibold text-indigo-600">Skor {criteria.score} · {criteria.topics}</p>
            <p className="mt-3 min-h-12 text-sm leading-5 text-slate-500">{criteria.description}</p>
            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">{criteria.topics}</div>
          </article>
        ))}
      </div>
      <section className="notice-panel mt-4">
        <Sparkles size={18} />
        <div>
          <h2 className="text-sm font-semibold">Apa yang dibutuhkan untuk naik level?</h2>
          <p className="mt-1 text-sm text-slate-600">Kenaikan level memerlukan skor keseluruhan dan capaian minimum pada setiap topik. Level diperbarui setelah tes atau retest selesai.</p>
        </div>
      </section>
      <div className="mt-4 flex justify-end">
        <button className="button-primary" onClick={() => navigateTo('skill_gap')}>Lihat skill gap <ArrowRight size={16} /></button>
      </div>
    </div>
  );
};

export const SkillGapPage: React.FC = () => {
  const { result, scores } = useScores();
  const { navigateTo } = useApp();
  if (!result) return <DataUnavailable />;
  const nextLevel = result.level === 'Beginner' ? 'Intermediate' : result.level === 'Intermediate' ? 'Advanced' : 'Advanced';
  const minimumTopicScore = result.level === 'Beginner' ? 60 : 80;
  const targetScore = result.level === 'Beginner' ? 70 : 85;
  const gaps = scores.filter((topic) => topic.percentage < minimumTopicScore);

  return (
    <div className="page-content">
      <PageTitle eyebrow="Kemampuan" title="Fokus pada jarak yang paling berarti" description={`Bandingkan kemampuan saat ini dengan batas minimum untuk level ${nextLevel}.`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5"><span className="text-xs text-slate-500">Target level</span><strong className="mt-2 block text-xl">{nextLevel}</strong><span className="mt-2 block text-xs text-slate-500">Skor ≥ {targetScore} · tiap topik ≥ {minimumTopicScore}</span></div>
        <div className="panel p-5"><span className="text-xs text-slate-500">Jarak skor keseluruhan</span><strong className="mt-2 block text-xl">{Math.max(0, targetScore - result.score)} poin</strong><span className="mt-2 block text-xs text-slate-500">Dari {result.score} menuju minimal {targetScore}</span></div>
        <div className="panel p-5"><span className="text-xs text-slate-500">Topik di bawah batas</span><strong className="mt-2 block text-xl">{gaps.length} dari {scores.length}</strong><span className="mt-2 block text-xs text-slate-500">{gaps.length ? gaps.map((topic) => topic.topic).join(', ') : 'Tidak ada topik di bawah batas'}</span></div>
      </div>
      <section className="panel mt-4 overflow-hidden">
        <div className="flex items-center justify-between p-5"><h2 className="text-base font-semibold">Jarak menuju target</h2><span className="status-pill status-neutral">Batas topik: {minimumTopicScore}/100</span></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Topik</th><th>Saat ini</th><th>Target min.</th><th>Selisih</th><th>Posisi kemampuan</th><th>Status</th></tr></thead>
            <tbody>{scores.map((topic) => {
              const difference = Math.max(0, minimumTopicScore - topic.percentage);
              return (
                <tr key={topic.topic}>
                  <td className="font-semibold text-slate-800">{topic.topic}</td><td>{topic.percentage}</td><td>{minimumTopicScore}</td>
                  <td className={difference ? 'font-semibold text-indigo-600' : 'font-semibold text-emerald-700'}>{difference ? `${difference} poin lagi` : 'Terpenuhi'}</td>
                  <td><div className="min-w-24"><ScoreBars scores={[topic]} threshold={minimumTopicScore} /></div></td>
                  <td><span className={`status-pill ${difference ? 'status-primary' : 'status-success'}`}>{difference ? 'Prioritas' : 'Tercapai'}</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </section>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {gaps.slice(0, 2).map((topic, index) => (
          <article key={topic.topic} className="panel flex items-start gap-3 p-5">
            <span className="status-pill status-primary">{String(index + 1).padStart(2, '0')}</span>
            <div className="flex-1"><h2 className="font-semibold">Mulai dari {topic.topic}</h2><p className="mt-2 text-sm leading-5 text-slate-500">Skor saat ini {topic.percentage}/100. Pelajari sumber eksternal yang direkomendasikan untuk memperkuat konsep ini.</p></div>
            <BookOpen size={18} className="text-indigo-600" />
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="button-primary" onClick={() => navigateTo('recommendations')}>Temukan sumber belajar <ArrowRight size={16} /></button>
      </div>
      <p className="mt-4 text-xs text-slate-500"><TrendingUp size={14} className="mr-1 inline" />Rekomendasi belajar berasal dari sumber eksternal; perkembangan diukur melalui hasil evaluasi.</p>
    </div>
  );
};
