import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppPage } from '../context/AppContext';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckSquare,
  Code2,
  FileClock,
  Flag,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  RotateCcw,
  Sparkles,
  Target,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const groups: { label: string; items: { label: string; page: AppPage; icon: React.ElementType }[] }[] = [
  { label: 'Ringkasan', items: [{ label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard }] },
  { label: 'Evaluasi', items: [{ label: 'Tes Awal', page: 'assessment', icon: CheckSquare }] },
  {
    label: 'Kemampuan',
    items: [
      { label: 'Analisis Kemampuan', page: 'analysis', icon: BarChart3 },
      { label: 'Klasifikasi Level', page: 'classification', icon: Flag },
      { label: 'Skill Gap', page: 'skill_gap', icon: Target }
    ]
  },
  {
    label: 'Belajar',
    items: [
      { label: 'Rekomendasi', page: 'recommendations', icon: BookOpen },
      { label: 'Retest', page: 'retest', icon: RotateCcw }
    ]
  },
  {
    label: 'Pantauan',
    items: [
      { label: 'Riwayat Tes', page: 'history', icon: FileClock },
      { label: 'Progres', page: 'progress', icon: BarChart3 }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, currentPage, navigateTo, logoutUser, initialResult, retestResult } = useApp();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const activeResult = retestResult || initialResult;

  const handleNavigate = (page: AppPage) => {
    navigateTo(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <button
          aria-label="Tutup menu"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
        />
      )}
      <aside className={`app-sidebar ${isMobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <button onClick={() => handleNavigate('dashboard')} className="flex items-center gap-2.5 text-left">
            <span className="brand-mark"><Code2 size={17} /></span>
            <span className="text-base font-bold tracking-tight text-white">AdaptivePHP</span>
          </button>
          <button aria-label="Tutup menu" onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400">
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="sidebar-nav">
          {groups.map((group) => (
            <section key={group.label} className="sidebar-group">
              <h2>{group.label}</h2>
              {group.items.map(({ label, page, icon: Icon }) => {
                const isCurrent = currentPage === page ||
                  (page === 'recommendations' && currentPage === 'learning_detail') ||
                  (page === 'assessment' && currentPage === 'assessment_result') ||
                  (page === 'retest' && currentPage === 'retest_result');
                return (
                  <button
                    key={page}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => handleNavigate(page)}
                    className={`sidebar-link ${isCurrent ? 'active' : ''}`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </nav>

        {activeResult && (
          <div className="sidebar-goal">
            <span className="sidebar-eyebrow">Target belajar</span>
            <strong>Percaya diri dengan PHP</strong>
            <span className="sidebar-goal-level"><Sparkles size={12} /> {activeResult.level}</span>
          </div>
        )}

        <div className="sidebar-bottom">
          <button onClick={() => setShowLogoutDialog(true)} className="sidebar-link">
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
          <div className="sidebar-user" title={user?.email}>
            <span className="sidebar-avatar">
              {user?.name ? user.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </span>
            <span className="min-w-0">
              <strong>{user?.name || 'Pelajar PHP'}</strong>
              <small>Pelajar PHP</small>
            </span>
            <PanelLeftClose size={15} className="ml-auto text-slate-500" />
          </div>
        </div>
      </aside>

      {showLogoutDialog && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowLogoutDialog(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="logout-title" className="logout-dialog">
            <button className="dialog-close" aria-label="Tutup" onClick={() => setShowLogoutDialog(false)}><X size={18} /></button>
            <div className="dialog-icon"><LogOut size={21} /></div>
            <h2 id="logout-title">Selesai untuk hari ini?</h2>
            <p>Kamu akan keluar dari akun AdaptivePHP. Hasil tes dan progresmu tetap tersimpan, siap dilanjutkan saat kamu kembali.</p>
            <div className="dialog-actions">
              <button className="button-secondary" onClick={() => setShowLogoutDialog(false)}>Batal</button>
              <button className="button-primary" onClick={logoutUser}>Keluar <ArrowRight size={16} /></button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
