import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Bell, ChevronRight } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { currentPage, user, navigateTo } = useApp();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Pembelajaran';
      case 'assessment':
        return 'Tes Awal';
      case 'assessment_result':
        return 'Hasil Tes';
      case 'analysis':
        return 'Analisis Kemampuan';
      case 'classification':
        return 'Klasifikasi Level';
      case 'skill_gap':
        return 'Skill Gap';
      case 'recommendations':
        return 'Rekomendasi';
      case 'learning_detail':
        return 'Rekomendasi / Detail';
      case 'retest':
        return 'Retest';
      case 'retest_result':
        return 'Hasil Retest';
      case 'progress':
        return 'Progres';
      case 'history':
        return 'Riwayat Tes';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: 'var(--color-surface)', // Midnight Blue
        borderBottom: '1px solid var(--color-border)' // Slate 700
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg md:hidden hover:bg-slate-100 transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
          <span className="hidden sm:inline" style={{ color: 'var(--color-text-secondary)' }}>Ruang belajar</span>
          <ChevronRight className="hidden sm:block w-4 h-4 shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
          <span className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Bell className="w-4 h-4 hidden sm:block" style={{ color: 'var(--color-text-secondary)' }} />
        <div className="hidden sm:block h-8 border-l" style={{ borderColor: 'var(--color-border)' }} />
        <button
          onClick={() => navigateTo('profile')}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer min-w-0"
          title="Buka profil"
        >
          <div className="hidden sm:block text-right leading-tight">
            <span className="block text-xs font-semibold truncate max-w-36" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</span>
            <span className="block text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>Pelajar PHP</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)' }}>
            {user?.name ? user.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
        </button>
      </div>
    </header>
  );
};
