import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code,
  ArrowRight,
  BrainCircuit,
  Target,
  BookOpen,
  RotateCcw,
  CheckCircle,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, isAuthenticated, initialResult, simulateCompleteInitial, openLaravelSpec } = useApp();

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Academic / Research Header Badge & Stack Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Prototype Sistem Pembelajaran Adaptif Berbasis AI</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Frontend: React + Tailwind CSS &bull; Backend: Laravel 11 (PHP 8.3)</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Pengembangan Sistem Pembelajaran Adaptif Menggunakan AI untuk Kemampuan dan Rekomendasi Pemrograman PHP
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Platform pengujian adaptif cerdas untuk mengukur kompetensi pemrograman PHP, mendiagnosis <span className="font-semibold text-slate-800">skill gap</span> secara presisi melalui model AI, merekomendasikan materi terarah, dan memvalidasi peningkatan melalui <span className="font-semibold text-slate-800">retest 50 soal</span>.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated && initialResult ? (
              <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <span>Buka Dashboard Pembelajaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigateTo(isAuthenticated ? 'assessment' : 'register')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <span>Mulai Assessment Awal (50 Soal)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Convenient reviewer quick simulation button */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigateTo('login');
                    } else {
                      simulateCompleteInitial('Intermediate');
                    }
                  }}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm px-5 py-3 rounded-lg transition-colors cursor-pointer"
                  title="Simulasi otomatis untuk penguji agar dapat langsung meninjau alur AI"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isAuthenticated ? 'Simulasi Cepat Assessment (74%)' : 'Masuk Akun Penguji'}</span>
                </button>
              </>
            )}

            <button
              onClick={openLaravelSpec}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-sm px-4 py-3 rounded-lg transition-colors cursor-pointer"
              title="Lihat kode Controller, Migrasi MySQL, dan API Endpoints Laravel 11"
            >
              <span>Spesifikasi Backend Laravel 11</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Core Functional Steps Architecture */}
        <div className="mt-14 pt-10 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Alur Kerja Utama Sistem Adaptif
            </h2>
            <p className="text-xl font-bold text-slate-900 mt-1">
              Siklus Tertutup Evaluasi dan Rekomendasi Terarah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Assessment Awal 50 Soal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengukuran komprehensif mencakup 12 materi pokok PHP untuk memetakan level awal (Beginner, Intermediate, Advanced).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Diagnosis AI & Skill Gap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algoritma AI menganalisis akurasi per topik untuk menentukan area kelemahan spesifik pengguna secara objektif.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Rekomendasi Pembelajaran 6 Sumber
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyajian materi terkurasi: Video langsung dalam sistem, Artikel, Dokumentasi resmi, Jurnal, Website, dan Latihan kode.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Retest 50 Soal Mandiri
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setelah mempelajari materi, pengguna menempuh 50 butir soal baru yang terpisah dari tes awal untuk menguji daya serap.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Komparasi Kenaikan Skor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Perbandingan data real-time skor awal vs retest, status penuntasan skill gap, dan visualisasi pertumbuhan kemampuan.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm mb-3">
                6
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Pemantauan Portofolio & Riwayat
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencatatan rekam jejak penilaian secara berkelanjutan yang siap diekspor dan diintegrasikan dengan database PHP-MySQL.
              </p>
            </div>
          </div>
        </div>

        {/* 12 Core PHP Syllabus Modules */}
        <div className="mt-14 p-6 bg-slate-100/70 rounded-2xl border border-slate-200/90">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Cakupan 12 Materi Pokok Pemrograman PHP
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs text-slate-700">
            {[
              '1. Dasar PHP',
              '2. Variabel & Tipe Data',
              '3. Operator',
              '4. Conditional',
              '5. Looping',
              '6. Array',
              '7. Function',
              '8. String',
              '9. OOP PHP',
              '10. Database / MySQL',
              '11. CRUD',
              '12. Error Handling'
            ].map((topic, i) => (
              <div key={i} className="flex items-center gap-1.5 p-2 bg-white rounded border border-slate-200/80 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Note Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Sistem Pembelajaran Adaptif AI &bull; Pengujian Standar Mahasiswa Teknik Informatika &bull; Bahasa Indonesia
        </div>
      </div>
    </div>
  );
};
