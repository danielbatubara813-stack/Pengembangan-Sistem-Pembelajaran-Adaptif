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
    <div className="py-2 sm:py-4 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#6366F1' }}>
            Log Aktivitas Penilaian
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: '#F8FAFC' }}>
            Riwayat Assessment &amp; Retest
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
            Daftar kronologis pelaksanaan ujian kemampuan PHP dan capaian level adaptif.
          </p>
        </div>

        <button
          onClick={() => navigateTo('progress')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
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
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Tanggal &amp; Waktu</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Jenis Ujian</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Nilai</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Level PHP</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#1E293B' }}>
              {displayHistory.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-800/50"
                  style={{ color: '#F8FAFC' }}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" style={{ color: '#64748B' }} />
                      <span className="font-mono text-xs">{row.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: row.type === 'Assessment Awal' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: row.type === 'Assessment Awal' ? '#6366F1' : '#10B981'
                      }}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-sm" style={{ color: '#F8FAFC' }}>
                    {row.score}/100
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className="px-2 py-0.5 rounded font-mono font-bold text-xs"
                      style={{
                        backgroundColor: '#1E293B',
                        color: row.level === 'Advanced' ? '#10B981' : row.level === 'Intermediate' ? '#3B82F6' : '#F59E0B'
                      }}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-xs" style={{ color: '#10B981' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => navigateTo(row.type === 'Assessment Awal' ? 'assessment_result' : 'retest_result')}
                      className="font-bold hover:underline cursor-pointer"
                      style={{ color: '#3B82F6' }}
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
