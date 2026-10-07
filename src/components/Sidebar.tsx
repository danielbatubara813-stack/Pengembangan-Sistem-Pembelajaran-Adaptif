import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  TrendingUp,
  History,
  User as UserIcon,
  LogOut,
  FileQuestion,
  Sparkles,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    user,
    isAuthenticated,
    currentPage,
    navigateTo,
    logoutUser,
    initialResult,
    retestResult
  } = useApp();

  const isAssessmentCompleted = !!initialResult;

  const currentLevel = retestResult?.level || initialResult?.level || 'Belum Diuji';
  const currentScore = retestResult?.score ?? initialResult?.score;

  const handleNavClick = (page: any) => {
    navigateTo(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: '#0D1527', // Midnight Blue
          borderRight: '1px solid #334155' // Slate 700
        }}
      >
        {/* Brand Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid #334155' }}
        >
          <div
            onClick={() => handleNavClick(isAssessmentCompleted ? 'dashboard' : 'assessment')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: '#3B82F6' }} // Blue 500
            >
              &lt;/&gt;
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight" style={{ color: '#F8FAFC' }}>
                  AdaptifPHP
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                  style={{ backgroundColor: '#1E293B', color: '#6366F1' }}
                >
                  8.3
                </span>
              </div>
              <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                Portal Pembelajaran Adaptif
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg md:hidden hover:bg-slate-800 transition-colors"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak & XP Gamification Indicator */}
        <div className="px-4 pt-4">
          <div
            className="p-3 rounded-xl flex items-center justify-between"
            style={{
              backgroundColor: '#111827', // Slate 900
              border: '1px solid #1E293B' // Slate 800
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }} // Amber 500
              >
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold block" style={{ color: '#94A3B8' }}>
                  Streak Belajar
                </span>
                <span className="text-xs font-bold" style={{ color: '#F8FAFC' }}>
                  3 Hari Aktif
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold block" style={{ color: '#94A3B8' }}>
                Poin XP
              </span>
              <span className="text-xs font-bold font-mono" style={{ color: '#F59E0B' }}>
                +180 XP
              </span>
            </div>
          </div>
        </div>

        {/* AI Assistant Accent Glow Pill */}
        <div className="px-4 pt-3">
          <div
            className="px-3 py-2 rounded-xl flex items-center justify-between text-xs"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.12)', // Violet 500 glow
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#8B5CF6'
            }}
          >
            <div className="flex items-center gap-2 font-medium">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-semibold">Engine Diagnostik AI</span>
            </div>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
              style={{ backgroundColor: '#111827', color: '#10B981' }}
            >
              Aktif
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
          <div className="px-3 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>
              Menu Utama
            </span>
          </div>

          {!isAssessmentCompleted ? (
            <button
              onClick={() => handleNavClick('assessment')}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: currentPage === 'assessment' ? '#3B82F6' : '#111827',
                color: '#F8FAFC',
                border: '1px solid #1E293B'
              }}
            >
              <div className="flex items-center gap-2.5">
                <FileQuestion className="w-4 h-4 text-white" />
                <span>Assessment Awal (50 Soal)</span>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                Wajib
              </span>
            </button>
          ) : (
            <>
              {/* Dashboard */}
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: currentPage === 'dashboard' ? '#3B82F6' : 'transparent',
                  color: currentPage === 'dashboard' ? '#F8FAFC' : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
                {currentPage === 'dashboard' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {/* Rekomendasi */}
              <button
                onClick={() => handleNavClick('recommendations')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    currentPage === 'recommendations' || currentPage === 'learning_detail'
                      ? '#3B82F6'
                      : 'transparent',
                  color:
                    currentPage === 'recommendations' || currentPage === 'learning_detail'
                      ? '#F8FAFC'
                      : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4" />
                  <span>Rekomendasi Materi</span>
                </div>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#6366F1'
                  }}
                >
                  Skill Gap
                </span>
              </button>

              {/* Retest */}
              <button
                onClick={() => handleNavClick('retest')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    currentPage === 'retest' || currentPage === 'retest_result'
                      ? '#3B82F6'
                      : 'transparent',
                  color:
                    currentPage === 'retest' || currentPage === 'retest_result'
                      ? '#F8FAFC'
                      : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4" />
                  <span>Retest Kemampuan</span>
                </div>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981'
                  }}
                >
                  50 Soal
                </span>
              </button>

              {/* Progress */}
              <button
                onClick={() => handleNavClick('progress')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: currentPage === 'progress' ? '#3B82F6' : 'transparent',
                  color: currentPage === 'progress' ? '#F8FAFC' : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Grafik Progress</span>
                </div>
                {retestResult && (
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#1E293B', color: '#10B981' }}
                  >
                    +{retestResult.score - (initialResult?.score || 0)}%
                  </span>
                )}
              </button>

              {/* Riwayat */}
              <button
                onClick={() => handleNavClick('history')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: currentPage === 'history' ? '#3B82F6' : 'transparent',
                  color: currentPage === 'history' ? '#F8FAFC' : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4" />
                  <span>Riwayat Ujian</span>
                </div>
              </button>

              {/* Profil */}
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: currentPage === 'profile' ? '#3B82F6' : 'transparent',
                  color: currentPage === 'profile' ? '#F8FAFC' : '#94A3B8'
                }}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4" />
                  <span>Profil & Status</span>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Competency Card Mini Summary */}
        {initialResult && (
          <div className="px-4 pb-3">
            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: '#111827', // Slate 900
                border: '1px solid #1E293B' // Slate 800
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>
                  Kompetensi Terkini
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: '#10B981' }} // Emerald 500
                >
                  {currentScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: '#F8FAFC' }}>
                  Level: {currentLevel}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#6366F1'
                  }}
                >
                  {retestResult ? 'Validasi Retest' : 'Tes Awal'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* User Footer Panel & Logout */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            backgroundColor: '#0D1527',
            borderTop: '1px solid #334155'
          }}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
              style={{ backgroundColor: '#6366F1' }} // Indigo 500
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold truncate" style={{ color: '#F8FAFC' }}>
                {user?.name || 'Mahasiswa'}
              </span>
              <span className="block text-[10px] font-mono truncate" style={{ color: '#94A3B8' }}>
                {user?.nim || '21050974012'}
              </span>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-800"
            style={{ color: '#EF4444' }} // Red 500
            title="Keluar dari Sistem"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
