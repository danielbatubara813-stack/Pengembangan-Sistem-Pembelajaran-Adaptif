import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Flame, Sparkles, User, Award, CheckCircle } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { currentPage, initialResult, retestResult, user, navigateTo } = useApp();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Pembelajaran';
      case 'assessment':
        return 'Assessment Awal (50 Soal PHP)';
      case 'assessment_result':
        return 'Hasil Evaluasi Assessment Awal';
      case 'recommendations':
        return 'Rekomendasi Materi Terarah';
      case 'learning_detail':
        return 'Detail Modul Pembelajaran';
      case 'retest':
        return 'Retest Kemampuan (50 Soal Baru)';
      case 'retest_result':
        return 'Hasil Retest & Analisis Komparasi';
      case 'progress':
        return 'Grafik Perkembangan Kompetensi';
      case 'history':
        return 'Riwayat Pengujian & Evaluasi';
      case 'profile':
        return 'Profil Mahasiswa & Status Sistem';
      default:
        return 'Portal Pembelajaran Adaptif';
    }
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#0D1527', // Midnight Blue
        borderBottom: '1px solid #334155' // Slate 700
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg md:hidden hover:bg-slate-800 transition-colors cursor-pointer"
          style={{ color: '#94A3B8' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Page Title */}
        <div>
          <h2 className="text-sm sm:text-base font-bold tracking-tight truncate max-w-[200px] sm:max-w-md" style={{ color: '#F8FAFC' }}>
            {getPageTitle()}
          </h2>
          <p className="text-[11px] hidden sm:block" style={{ color: '#64748B' }}>
            Kurikulum Standar PHP 8.x &bull; Evaluasi Adaptif
          </p>
        </div>
      </div>

      {/* Right Header Status Widgets */}
      <div className="flex items-center gap-3">
        {/* Streak XP Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F59E0B' // Amber 500
          }}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>3 Hari &bull; 180 XP</span>
        </div>

        {/* Score & Level Badge */}
        {initialResult && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-lg"
            style={{
              backgroundColor: '#111827', // Slate 900
              border: '1px solid #1E293B' // Slate 800
            }}
          >
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider block font-bold" style={{ color: '#64748B' }}>
                Level
              </span>
              <span className="text-xs font-bold font-mono" style={{ color: '#3B82F6' }}>
                {retestResult ? retestResult.level : initialResult.level}
              </span>
            </div>
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs font-mono"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981' // Emerald 500
              }}
            >
              {retestResult ? `${retestResult.score}%` : `${initialResult.score}%`}
            </div>
          </div>
        )}

        {/* Quick User Avatar */}
        <button
          onClick={() => navigateTo('profile')}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Buka Profil"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: '#6366F1' }} // Indigo 500
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </button>
      </div>
    </header>
  );
};
