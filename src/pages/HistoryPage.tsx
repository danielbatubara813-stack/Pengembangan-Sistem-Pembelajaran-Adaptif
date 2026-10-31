import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Calendar, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { history, navigateTo, initialResult, retestResult } = useApp();

  const displayHistory = history.length > 0 ? history : [
    ...(initialResult ? [{
      id: 'h-init',
      date: initialResult.date,
      type: 'Assessment Awal' as const,
      score: initialResult.score,
      level: initialResult.level,
      status: 'Selesai' as const
    }] : []),
    ...(retestResult ? [{
      id: 'h-retest',
      date: retestResult.date,
      type: 'Retest' as const,
      score: retestResult.score,
      level: retestResult.level,
      status: 'Selesai' as const
    }] : [])
  ];

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-primary)' }}>
            Log Aktivitas Penilaian
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
            Riwayat Assessment &amp; Retest
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Daftar kronologis pelaksanaan ujian kemampuan PHP dan capaian level adaptif.
          </p>
        </div>

        <button
          onClick={() => navigateTo('progress')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: 'var(--color-primary)', // Blue 500
            color: "var(--color-surface)"
          }}
        >
          <span>Buka Grafik Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* History Table Surface */}
      <div
        className="rounded-2xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Tanggal &amp; Waktu</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Jenis Ujian</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Nilai</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Level PHP</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {displayHistory.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-100"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-text-secondary)' }} />
                      <span className="font-mono text-xs">{row.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: row.type === 'Assessment Awal' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(4, 120, 87, 0.15)',
                        color: row.type === 'Assessment Awal' ? 'var(--color-primary)' : 'var(--color-accent)'
                      }}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {row.score}/100
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className="px-2 py-0.5 rounded font-mono font-bold text-xs"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: row.level === 'Advanced' ? 'var(--color-accent)' : row.level === 'Intermediate' ? 'var(--color-primary)' : 'var(--color-accent)'
                      }}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-xs" style={{ color: 'var(--color-accent)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => navigateTo(row.type === 'Assessment Awal' ? 'assessment_result' : 'retest_result')}
                      className="font-bold hover:underline cursor-pointer"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Lihat Hasil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
