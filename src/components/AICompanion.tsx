import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight,
  MoveHorizontal,
  X
} from 'lucide-react';

export const AICompanion: React.FC = () => {
  const {
    currentPage,
    initialResult,
    retestResult,
    user,
    openLaravelSpec
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState<'right' | 'left'>('right');
  const [customTip, setCustomTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  // Dynamic Context-Aware Message based on page state
  useEffect(() => {
    setCustomTip(null);
  }, [currentPage]);

  const getDefaultMessage = () => {
    switch (currentPage) {
      case 'landing':
        return `Halo ${user?.name || 'Mahasiswa'}! Sistem ini akan memetakan kompetensi PHP Anda melalui 50 butir soal komprehensif berstandar industri.`;
      case 'assessment':
        return 'Kerjakan 50 soal assessment awal ini dengan tenang. Setiap jawaban akan dianalisis oleh AI untuk memetakan level dan skill gap Anda.';
      case 'assessment_result':
        return `Analisis awal selesai! Anda berada di level ${initialResult?.level || 'Intermediate'} (${initialResult?.score || 0}%). Perhatikan skill gap untuk fokus belajar.`;
      case 'dashboard':
        return 'Selamat datang di Dashboard! Materi rekomendasi di bawah disusun khusus berdasarkan skill gap terdeteksi. Pelajari materi sebelum mengikuti Retest.';
      case 'recommendations':
        return 'Pilihlah salah satu topik di bawah. Anda bisa menonton video langsung di dalam sistem atau membaca dokumentasi resmi.';
      case 'learning_detail':
        return 'Pahami konsep mendasar dan cermati jebakan kode (pitfalls) pada topik ini agar Anda siap menghadapi Retest 50 Soal.';
      case 'retest':
        return 'Retest ini memuat 50 soal berbeda untuk menguji apakah pemahaman Anda pada topik skill gap telah meningkat secara nyata.';
      case 'retest_result':
        return 'Luar biasa! Retest telah selesai. Cermati grafik perbandingan untuk melihat lonjakan nilai dan topik yang berhasil dituntaskan.';
      case 'progress':
        return 'Grafik ini mendokumentasikan evolusi kemampuan Anda. Evaluasi komparatif mencerminkan kemajuan belajar Anda.';
      case 'history':
        return 'Rekam jejak tes Anda tercatat secara permanen di sini sebagai bukti perkembangan kompetensi akademik.';
      case 'profile':
        return 'Profil Anda aktif. Anda dapat meninjau capaian Anda atau mencoba skenario simulasi ulang jika diperlukan.';
      default:
        return 'Sistem Pembelajaran Adaptif AI siap mendampingi progres pemrograman PHP Anda.';
    }
  };

  const handleFetchAiHint = async () => {
    setIsLoadingTip(true);
    try {
      const res = await fetch('/api/ai/companion-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRoute: currentPage,
          score: retestResult?.score || initialResult?.score || 0,
          level: retestResult?.level || initialResult?.level || 'Beginner',
          skillGaps: initialResult?.skillGaps || []
        })
      });
      const data = await res.json();
      if (data.tip) {
        setCustomTip(data.tip);
      }
    } catch {
      setCustomTip('Tips Belajar: Konsentrasikan pemahaman pada konsep Object Oriented Programming dan Prepared Statements PDO karena kedua topik ini sering menjadi pondasi utama proyek PHP profesional.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  const currentMessage = customTip || getDefaultMessage();

  return (
    <div
      className={`fixed bottom-5 z-40 transition-all duration-300 pointer-events-none select-none ${
        position === 'right' ? 'right-5' : 'left-5'
      }`}
    >
      <div className="pointer-events-auto max-w-sm sm:max-w-md">
        {isOpen ? (
          <div className="bg-slate-900 text-slate-100 rounded-xl shadow-xl border border-slate-700/80 p-3.5 backdrop-blur-md">
            {/* Robot Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {/* Modern Robot Avatar */}
                <div className="relative w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-wide">
                      AI Companion
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800/60">
                      Adaptive Bot
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPosition((p) => (p === 'right' ? 'left' : 'right'))}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Pindah Sisi (Kiri/Kanan)"
                >
                  <MoveHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Minimize"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Robot Message Body */}
            <div className="pt-2.5 text-xs text-slate-300 leading-relaxed font-normal">
              {isLoadingTip ? (
                <div className="flex items-center gap-2 py-1 text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>AI Companion sedang menganalisis konteks...</span>
                </div>
              ) : (
                <p>{currentMessage}</p>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFetchAiHint}
                  disabled={isLoadingTip}
                  className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-medium transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Petunjuk AI</span>
                </button>

                <button
                  onClick={openLaravelSpec}
                  className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer underline text-[10px]"
                  title="Buka Skema Migrasi dan Arsitektur Laravel 11"
                >
                  Arsitektur Laravel
                </button>
              </div>

              <span className="text-[10px] text-slate-500 font-mono">
                PHP 8.3 &bull; Laravel 11
              </span>
            </div>
          </div>
        ) : (
          /* Minimized Floating Button */
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-slate-900 text-white px-3 py-2 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="relative w-6 h-6 rounded-md bg-indigo-600/30 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <span className="text-xs font-semibold pr-1">AI Companion</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
};
