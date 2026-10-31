import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  School,
  Mail,
  Award,
  RefreshCw,
  RotateCcw,
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
    navigateTo,
    openLaravelSpec
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="page-content py-2 sm:py-4 space-y-6">
      {/* Header */}
      <div className="pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-primary)' }}>
          Akun Akademik
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
          Profil Pengguna &amp; Status Sistem
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Informasi identitas mahasiswa dan rekam jejak capaian evaluasi adaptif.
        </p>
      </div>

      {/* User Card */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
        style={{
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'var(--color-primary)' }} // Indigo 500
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {user?.name || 'Mahasiswa'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {user?.institution || 'Fakultas Ilmu Komputer'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
              >
                NIM: {user?.nim || '21050974012'}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(4, 120, 87, 0.15)', color: 'var(--color-accent)' }}
              >
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text-secondary)' }}>
              Email Akademik
            </span>
            <span className="text-xs font-semibold break-words block mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
              {user?.email || 'mahasiswa@kampus.ac.id'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text-secondary)' }}>
              Institusi Pendidikan
            </span>
            <span className="text-xs font-semibold break-words block mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
              {user?.institution || 'Universitas Indonesia'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text-secondary)' }}>
              Level Kemampuan Terkini
            </span>
            <span className="text-xs font-bold font-mono block mt-0.5" style={{ color: 'var(--color-primary)' }}>
              {retestResult ? retestResult.level : initialResult ? initialResult.level : 'Belum Ditentukan'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text-secondary)' }}>
              Status Retest
            </span>
            <span className="text-xs font-bold block mt-0.5" style={{ color: retestResult ? 'var(--color-accent)' : 'var(--color-accent)' }}>
              {retestResult ? `Telah Retest (${retestResult.score}%)` : 'Menunggu Retest'}
            </span>
          </div>
        </div>
      </div>

      {/* Retest entry */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Retest</h3>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Buka halaman kesiapan saat ingin menguji pemahaman. Paket soal tidak disiapkan sampai Anda menekan “Saya Siap Retest”.</p>
        <button onClick={() => navigateTo('retest')} disabled={!initialResult} className="button-primary px-4 py-2.5 text-xs">
          Buka kesiapan retest <RotateCcw size={14} />
        </button>
      </div>

      {/* Reset Progress Section */}
      <div
        className="p-6 rounded-2xl shadow-xl space-y-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}
      >
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-danger)' }}>
          <Trash2 className="w-4 h-4" />
          <span>Reset Status Materi</span>
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Menghapus tanda materi selesai dari akun. Hasil tes, jawaban, nilai, dan riwayat assessment tetap tersimpan.
        </p>

        <div className="pt-2">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--color-danger)',
                color: 'var(--color-danger)'
              }}
            >
              Reset Status Materi
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
                  backgroundColor: 'var(--color-danger)', // Red 500
                  color: 'var(--color-text-primary)'
                }}
              >
                Konfirmasi Reset Status Materi
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-100"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
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
