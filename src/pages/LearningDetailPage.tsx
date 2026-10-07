import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEARNING_DETAILS } from '../data/learningMaterials';
import { PHPTopic } from '../types';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Code2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const LearningDetailPage: React.FC = () => {
  const {
    selectedTopicForDetail,
    initialResult,
    navigateTo,
    openVideoModal
  } = useApp();

  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  // Default to first skill gap if none explicitly selected
  const activeTopic: PHPTopic =
    selectedTopicForDetail ||
    initialResult?.skillGaps[0]?.topic ||
    'Object Oriented Programming / OOP';

  const detail = LEARNING_DETAILS[activeTopic] || LEARNING_DETAILS['Object Oriented Programming / OOP'];

  const toggleSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="py-2 sm:py-4 max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <button
          onClick={() => navigateTo('recommendations')}
          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:underline"
          style={{ color: '#94A3B8' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Rekomendasi</span>
        </button>

        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: '#10B981', // Emerald 500
            color: '#F8FAFC'
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Retest Topik Ini</span>
        </button>
      </div>

      {/* Title & Overview Card */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block"
          style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' }}
        >
          {activeTopic}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
          {detail.title}
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
          {detail.overview}
        </p>
      </div>

      {/* Key Concepts with Code Examples */}
      <div className="space-y-4">
        <h2 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
          Konsep Kunci &amp; Studi Kasus Kode
        </h2>

        {detail.keyConcepts.map((concept, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl shadow-xl space-y-4"
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1E293B'
            }}
          >
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#3B82F6' }}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold" style={{ backgroundColor: '#1E293B', color: '#F8FAFC' }}>
                  {idx + 1}
                </span>
                <span>{concept.heading}</span>
              </h3>
              <p className="text-xs leading-relaxed mt-2" style={{ color: '#94A3B8' }}>
                {concept.description}
              </p>
            </div>

            {concept.codeExample && (
              <div className="rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid #334155' }}>
                <div
                  className="px-4 py-2 flex items-center justify-between text-xs font-mono"
                  style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155' }}
                >
                  <span style={{ color: '#94A3B8' }}>Contoh Sintaks PHP</span>
                  <span style={{ color: '#10B981' }}>Standar PSR-12</span>
                </div>
                <pre
                  className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                  style={{ backgroundColor: '#0B1020', color: '#10B981' }}
                >
                  <code>{concept.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Pitfalls / Jebakan Umum */}
      {detail.commonPitfalls && detail.commonPitfalls.length > 0 && (
        <div
          className="p-6 rounded-2xl shadow-xl space-y-4"
          style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#EF4444' }}>
            <AlertTriangle className="w-4 h-4" />
            <span>Kesalahan Umum yang Sering Terjadi (Common Pitfalls)</span>
          </div>

          <div className="space-y-3">
            {detail.commonPitfalls.map((pit, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#EF4444' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#F8FAFC' }}>
                    {pit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #334155' }}>
        <button
          onClick={() => navigateTo('recommendations')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
          style={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            color: '#F8FAFC'
          }}
        >
          Kembali ke Rekomendasi
        </button>

        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95"
          style={{
            backgroundColor: '#3B82F6', // Blue 500
            color: '#F8FAFC'
          }}
        >
          <span>Mulai Retest 50 Soal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
