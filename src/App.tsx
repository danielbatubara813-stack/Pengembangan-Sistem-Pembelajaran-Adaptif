import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { VideoModal } from './components/VideoModal';
import { LaravelSpecModal } from './components/LaravelSpecModal';

// Pages
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
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

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated, initialResult, isLaravelSpecOpen, closeLaravelSpec } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    // If not authenticated, always show Login (or Register if selected)
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
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center font-sans antialiased"
        style={{ backgroundColor: '#0B1020', color: '#F8FAFC' }}
      >
        <main className="w-full flex-1 flex flex-col justify-center">
          {renderCurrentPage()}
        </main>

        <footer
          className="w-full py-4 text-center text-xs"
          style={{ borderTop: '1px solid #1E293B', color: '#64748B' }}
        >
          Sistem Pembelajaran Adaptif Pemrograman PHP &bull; React + Tailwind &bull; Laravel API Ready
        </footer>
      </div>
    );
  }

  // Authenticated screen: Modern Sidebar + Main Content Layout
  return (
    <div
      className="min-h-screen flex font-sans antialiased"
      style={{ backgroundColor: '#0B1020', color: '#F8FAFC' }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 min-w-0 min-h-screen">
        {/* Top Header Navigation */}
        <TopHeader onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>

        {/* Global Modals */}
        <VideoModal />
        <LaravelSpecModal isOpen={isLaravelSpecOpen} onClose={closeLaravelSpec} />

        {/* Footer */}
        <footer
          className="py-5 px-6 sm:px-8 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{
            backgroundColor: '#0D1527',
            borderTop: '1px solid #334155',
            color: '#64748B'
          }}
        >
          <div>
            <span className="font-semibold" style={{ color: '#F8FAFC' }}>
              AdaptifPHP &bull; Sistem Pembelajaran Adaptif
            </span>
            <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>
              Evaluasi Mandiri &bull; Diagnostik Skill Gap &bull; Retest Terarah
            </p>
          </div>
          <div className="text-[11px]" style={{ color: '#64748B' }}>
            Stack: React &amp; Tailwind &bull; Laravel 11 Backend Architecture
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
