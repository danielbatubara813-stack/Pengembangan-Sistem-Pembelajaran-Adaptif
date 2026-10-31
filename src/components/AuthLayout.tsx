import React from 'react';
import { ArrowLeft, BarChart3, Code2, ScanLine, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthLayout: React.FC<{
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}> = ({ title, children, footer }) => {
  const { navigateTo } = useApp();

  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <button className="auth-brand" onClick={() => navigateTo('landing')}>
          <span className="brand-mark"><Code2 size={17} /></span>
          <span>AdaptivePHP</span>
        </button>
        <span className="landing-eyebrow">Belajar dengan arah</span>
        <h1>{title}</h1>
        <p className="auth-story-copy">Tak perlu menebak harus belajar apa. Kenali kemampuanmu dan temukan sumber yang tepat untuk berkembang.</p>
        <div className="auth-benefits">
          <div><span><ScanLine size={18} /></span><p><strong>Kenali kemampuan</strong><small>Evaluasi PHP yang menyeluruh</small></p></div>
          <div><span><Target size={18} /></span><p><strong>Temukan arah</strong><small>Sumber eksternal yang dipersonalisasi</small></p></div>
          <div><span><BarChart3 size={18} /></span><p><strong>Lihat perkembangan</strong><small>Skor dan level yang terukur</small></p></div>
        </div>
        <small className="auth-copyright">© 2026 AdaptivePHP · Dibangun untuk proses belajarmu.</small>
      </aside>
      <main className="auth-main">
        <div className="auth-main-inner">
          <button className="auth-back" onClick={() => navigateTo('landing')}><ArrowLeft size={15} /> Kembali ke beranda</button>
          <div className="auth-form-wrap">{children}{footer}</div>
          <p className="auth-legal">Belajar personal, data tetap milikmu. <span>Privasi · Ketentuan</span></p>
        </div>
      </main>
    </div>
  );
};
