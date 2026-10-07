import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  LayoutDashboard,
  Sparkles,
  RotateCcw,
  TrendingUp,
  History,
  User,
  LogOut,
  CheckCircle2,
  FileQuestion,
  Server
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    currentPage,
    navigateTo,
    logoutUser,
    initialResult,
    retestResult,
    openLaravelSpec
  } = useApp();

  const isAssessmentCompleted = !!initialResult;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => navigateTo(isAssessmentCompleted ? 'dashboard' : (isAuthenticated ? 'assessment' : 'login'))}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
              &lt;/&gt;
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  AdaptifPHP
                </span>
                <span className="text-[11px] font-medium text-slate-500 hidden md:inline-block border-l border-slate-200 pl-2">
                  Portal Ujian &amp; Pembelajaran PHP
                </span>
              </div>
            </div>
          </div>

          {/* Center Nav Items */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-1">
              {!isAssessmentCompleted ? (
                <button
                  onClick={() => navigateTo('assessment')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    currentPage === 'assessment'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
                  Assessment Awal (50 Soal)
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 'dashboard'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigateTo('recommendations')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 'recommendations' || currentPage === 'learning_detail'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Rekomendasi
                  </button>

                  <button
                    onClick={() => navigateTo('retest')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 'retest' || currentPage === 'retest_result'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retest (50 Soal)
                  </button>

                  <button
                    onClick={() => navigateTo('progress')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 'progress'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Progress
                  </button>

                  <button
                    onClick={() => navigateTo('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 'history'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    Riwayat
                  </button>
                </>
              )}
            </nav>
          ) : null}

          {/* Right Status & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigateTo('register')}
                  className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Mulai Assessment
                </button>
              </div>
            ) : (
              <>
                {initialResult && (
                  <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Level PHP
                      </p>
                      <p className="text-xs font-bold text-indigo-700">
                        {retestResult ? retestResult.level : initialResult.level}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 font-mono">
                      {retestResult ? `${retestResult.score}%` : `${initialResult.score}%`}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigateTo('profile')}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                  title="Profil Pengguna"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                <button
                  onClick={logoutUser}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Submenu for Authenticated */}
        {isAuthenticated && (
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            {!isAssessmentCompleted ? (
              <button
                onClick={() => navigateTo('assessment')}
                className={`text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${
                  currentPage === 'assessment' ? 'bg-indigo-600 text-white' : 'text-slate-700'
                }`}
              >
                Assessment Awal (50 Soal)
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    currentPage === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('recommendations')}
                  className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    currentPage === 'recommendations' ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  Rekomendasi
                </button>
                <button
                  onClick={() => navigateTo('retest')}
                  className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    currentPage === 'retest' ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  Retest
                </button>
                <button
                  onClick={() => navigateTo('progress')}
                  className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    currentPage === 'progress' ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  Progress
                </button>
                <button
                  onClick={() => navigateTo('history')}
                  className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    currentPage === 'history' ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  Riwayat
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
