import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { VideoModal } from './components/VideoModal';
import { LaravelSpecModal } from './components/LaravelSpecModal';
import { Navbar } from './components/Navbar';

// Pages
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AssessmentResultPage } from './pages/AssessmentResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { LearningDetailPage } from './pages/LearningDetailPage';
import { RetestPage } from './pages/RetestPage';
import { RetestResultPage } from './pages/RetestResultPage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalysisPage, ClassificationPage, SkillGapPage } from './pages/AnalysisPages';

const AppContent: React.FC = () => {
  const {
    currentPage, isAuthenticated, isAuthLoading, authLoadError, retryLoadSession,
    initialResult, isLaravelSpecOpen, closeLaravelSpec
  } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div
        className="min-h-screen grid place-items-center font-sans text-sm"
        style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-secondary)' }}
        role="status"
      >
        Memuat akun dan progres...
      </div>
    );
  }

  if (authLoadError) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-5">
        <section className="panel w-full max-w-lg p-6" role="alert">
          <h1 className="text-lg font-semibold text-slate-900">Akun dan progres belum dapat dimuat</h1>
          <p className="mt-2 text-sm text-slate-600">{authLoadError}</p>
          <p className="mt-2 text-xs text-slate-500">Status tes belum dapat dipastikan. Coba lagi saat koneksi ke Laravel tersedia.</p>
          <button onClick={retryLoadSession} className="button-primary mt-4 px-4 py-2 text-sm">Coba lagi</button>
        </section>
      </div>
    );
  }

  const renderCurrentPage = () => {
    // Unauthenticated landing and authentication views use the public shell.
    if (!isAuthenticated) {
      if (currentPage === 'register') {
        return <RegisterPage />;
      }
      return <LoginPage />;
    }

    // Authenticated user routing
    switch (currentPage) {
      case 'register':
        return <RegisterPage />;
      case 'login':
        return initialResult ? <DashboardPage /> : <AssessmentPage />;
      case 'assessment':
        return <AssessmentPage />;
      case 'assessment_result':
        return <AssessmentResultPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'landing':
        return <LandingPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'classification':
        return <ClassificationPage />;
      case 'skill_gap':
        return <SkillGapPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'learning_detail':
        return <LearningDetailPage />;
      case 'retest':
        return <RetestPage />;
      case 'retest_result':
        return <RetestResultPage />;
      case 'progress':
        return <ProgressPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return initialResult ? <DashboardPage /> : <AssessmentPage />;
    }
  };

  // Unauthenticated screen: Clean Centered Dark Layout
  if (!isAuthenticated) {
    if (currentPage === 'landing') {
      return (
        <div className="min-h-screen flex flex-col font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <LandingPage />
          </main>
          <footer className="public-footer">
            <span>© 2026 AdaptivePHP. Belajar dengan arah.</span>
            <nav aria-label="Informasi">
              <a href="#privasi">Privasi</a>
              <a href="#ketentuan">Ketentuan</a>
              <a href="mailto:bantuan@adaptivephp.id">Bantuan</a>
            </nav>
          </footer>
          <LaravelSpecModal isOpen={isLaravelSpecOpen} onClose={closeLaravelSpec} />
        </div>
      );
    }
    return (
      <div className="min-h-screen font-sans antialiased">
        <main className="min-h-screen">
          {renderCurrentPage()}
        </main>
      </div>
    );
  }

  // Authenticated screen: Modern Sidebar + Main Content Layout
  return (
    <div
      className="min-h-screen flex font-sans antialiased"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-primary)' }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-60 min-w-0 min-h-screen">
        {/* Top Header Navigation */}
        <TopHeader onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-4 sm:p-5 lg:px-6 lg:py-5 w-full min-w-0">
          {renderCurrentPage()}
        </main>

        {/* Global Modals */}
        <VideoModal />
        <LaravelSpecModal isOpen={isLaravelSpecOpen} onClose={closeLaravelSpec} />

        {/* Footer */}
        <footer
          className="py-5 px-6 sm:px-8 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div>
            AdaptivePHP <span aria-hidden="true">·</span> Belajar sesuai kemampuanmu
          </div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <span>AdaptivePHP</span><span>{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
