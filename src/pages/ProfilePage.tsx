import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  School,
  Mail,
  Award,
  RefreshCw,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Database
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    initialResult,
    retestResult,
    resetAllProgress,
    simulateCompleteInitial,
    simulateCompleteRetest,
    navigateTo,
    openLaravelSpec
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="py-2 sm:py-4 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#6366F1' }}>
          Akun Akademik
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: '#F8FAFC' }}>
          Profil Pengguna &amp; Status Sistem
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
          Informasi identitas mahasiswa dan rekam jejak capaian evaluasi adaptif.
        </p>
      </div>

      {/* User Card */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: '#6366F1' }} // Indigo 500
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>
              {user?.name || 'Mahasiswa'}
            </h2>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              {user?.institution || 'Fakultas Ilmu Komputer'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: '#1E293B', color: '#6366F1', border: '1px solid #334155' }}
              >
                NIM: {user?.nim || '21050974012'}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}
              >
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#64748B' }}>
              Email Akademik
            </span>
            <span className="text-xs font-semibold truncate block mt-0.5" style={{ color: '#F8FAFC' }}>
              {user?.email || 'mahasiswa@kampus.ac.id'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#64748B' }}>
              Institusi Pendidikan
            </span>
            <span className="text-xs font-semibold truncate block mt-0.5" style={{ color: '#F8FAFC' }}>
              {user?.institution || 'Universitas Indonesia'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#64748B' }}>
              Level Kemampuan Terkini
            </span>
            <span className="text-xs font-bold font-mono block mt-0.5" style={{ color: '#3B82F6' }}>
              {retestResult ? retestResult.level : initialResult ? initialResult.level : 'Belum Ditentukan'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#64748B' }}>
              Status Retest
            </span>
            <span className="text-xs font-bold block mt-0.5" style={{ color: retestResult ? '#10B981' : '#F59E0B' }}>
              {retestResult ? `Telah Retest (${retestResult.score}%)` : 'Menunggu Retest'}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Tools for Reviewers */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1E293B'
        }}
      >
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#F8FAFC' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span>Alat Simulasi Cepat (Penguji / Reviewer)</span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
            Gunakan tombol cepat di bawah untuk mensimulasikan hasil tanpa mengisi 50 soal manual:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => simulateCompleteInitial('Intermediate')}
            className="p-3 rounded-xl text-left transition-colors cursor-pointer hover:border-blue-500"
            style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
          >
            <div className="text-xs font-bold" style={{ color: '#3B82F6' }}>Simulasi Tes Awal (74%)</div>
            <div className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
              Menghasilkan level Intermediate dengan skill gap OOP &amp; Database.
            </div>
          </button>

          <button
            onClick={simulateCompleteRetest}
            className="p-3 rounded-xl text-left transition-colors cursor-pointer hover:border-emerald-500"
            style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
          >
            <div className="text-xs font-bold" style={{ color: '#10B981' }}>Simulasi Retest (88%)</div>
            <div className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
              Menghasilkan lonjakan skor ke level Advanced dan menuntaskan gap.
            </div>
          </button>
        </div>
      </div>

      {/* Reset Progress Section */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-3"
        style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}
      >
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#EF4444' }}>
          <Trash2 className="w-4 h-4" />
          <span>Reset Semua Data Pengujian</span>
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
          Menghapus riwayat assessment awal, hasil retest, dan kembali ke kondisi awal untuk memulai pengujian baru dari nol.
        </p>

        <div className="pt-2">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#EF4444'
              }}
            >
              Reset Data &amp; Mulai Ulang
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetAllProgress();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: '#EF4444', // Red 500
                  color: '#F8FAFC'
                }}
              >
                Konfirmasi Hapus Semua
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-800"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#94A3B8'
                }}
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
