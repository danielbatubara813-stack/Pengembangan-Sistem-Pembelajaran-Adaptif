import React from 'react';
import { ArrowRight, BarChart3, BookOpen, Braces, Compass, ScanLine, Sparkles, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { navigateTo, isAuthenticated, initialResult, openLaravelSpec } = useApp();
  const start = () => navigateTo(isAuthenticated ? (initialResult ? 'dashboard' : 'assessment') : 'register');

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-copy">
            <span className="landing-eyebrow">Jalur belajar yang mengerti kamu</span>
            <h1>Belajar PHP bukan soal cepat. <span>Tapi tepat.</span></h1>
            <p>Kenali kemampuanmu, temukan celahnya, lalu belajar dari sumber terbaik. Satu jalur personal untuk langkah yang lebih terarah.</p>
            <button className="button-primary" onClick={start}>Mulai perjalananmu <ArrowRight size={17} /></button>
            <small>Evaluasi berbasis kemampuan · Sumber tepercaya</small>
          </div>
          <div className="code-journey" aria-label="Tiga langkah jalur belajarmu">
            <div className="code-window-top"><span>JALUR BELAJARMU</span><span className="window-dots"><i /><i /><i /></span></div>
            <pre><code><span>&lt;?php</span>{'\n'}  $langkah = kenaliKemampuanmu();{'\n'}  mulaiBelajar($langkah);</code></pre>
            <div className="journey-steps">
              <div><small>01</small><strong>Kenali</strong></div>
              <div><small>02</small><strong>Pelajari</strong></div>
              <div><small>03</small><strong>Tingkatkan</strong></div>
            </div>
            <p><Sparkles size={13} /> Bukan jalur yang sama untuk semua orang.</p>
          </div>
        </div>
      </section>

      <section className="landing-content">
        <h2>Lebih paham kemampuan. Lebih jelas tujuan.</h2>
        <div className="feature-grid">
          <article><ScanLine /><div><h3>Evaluasi yang terarah</h3><p>Tes PHP memetakan fondasi, OOP, dan database secara menyeluruh.</p></div></article>
          <article><Target /><div><h3>Rekomendasi personal</h3><p>Prioritaskan topik yang kamu butuhkan, bukan sekadar yang populer.</p></div></article>
          <article><BarChart3 /><div><h3>Kemajuan yang terlihat</h3><p>Bandingkan hasil tes dan rayakan peningkatan kemampuanmu.</p></div></article>
        </div>

        <div className="landing-steps-heading">
          <h2>Tiga langkah, satu arah yang jelas.</h2>
          <span>Dari evaluasi menuju peningkatan</span>
        </div>
        <div className="landing-process">
          <article><strong>01</strong><div><h3>Ikuti tes awal</h3><p>Temukan titik awal dan level PHP-mu.</p></div></article>
          <article><strong>02</strong><div><h3>Belajar dari sumber pilihan</h3><p>Akses dokumentasi, video, dan kursus eksternal.</p></div></article>
          <article><strong>03</strong><div><h3>Ukur lewat retest</h3><p>Lihat perubahan skor dan perbarui jalurmu.</p></div></article>
        </div>
      </section>

      <section className="landing-cta">
        <div><h2>Langkah kecil hari ini, kemampuan baru esok hari.</h2><p>Mulai dengan mengenali dirimu. Jalur belajarmu akan mengikuti.</p></div>
        <button className="button-primary" onClick={start}>Daftar sekarang <ArrowRight size={17} /></button>
      </section>

      <div className="landing-utilities">
        <button onClick={() => openLaravelSpec()}><Braces size={14} /> Tentang integrasi Laravel</button>
        <a href="#materi"><BookOpen size={14} /> Materi dari sumber eksternal</a>
        <span id="materi" className="sr-only">Sumber belajar berasal dari dokumentasi, video, dan kursus eksternal.</span>
        <span><Compass size={14} /> AdaptivePHP</span>
      </div>
    </div>
  );
};
