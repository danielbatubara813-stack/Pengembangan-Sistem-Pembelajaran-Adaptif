import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_RECOMMENDATIONS } from '../data/learningMaterials';
import { Recommendation, RecommendationType } from '../types';
import {
  Play,
  FileText,
  BookOpen,
  Globe,
  Code2,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const {
    initialResult,
    navigateTo,
    openVideoModal,
    completedMaterials,
    markMaterialCompleted
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | RecommendationType>('all');

  if (!initialResult) return null;

  const skillGapTopics = initialResult.skillGaps.map((sg) => sg.topic);

  const groupedRecommendations = skillGapTopics.map((topic) => {
    let items = TOPIC_RECOMMENDATIONS[topic] || [];
    if (selectedFilter !== 'all') {
      items = items.filter((r) => r.type === selectedFilter);
    }
    return {
      topic,
      skillGapInfo: initialResult.skillGaps.find((s) => s.topic === topic),
      items
    };
  });

  const getIconForType = (type: RecommendationType) => {
    switch (type) {
      case 'video':
        return <Play className="w-3.5 h-3.5 fill-current text-rose-500" />;
      case 'artikel':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'dokumentasi':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      case 'jurnal':
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      case 'latihan':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#6366F1' }}>
            Kurikulum Personalisasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: '#F8FAFC' }}>
            Rekomendasi Materi Terarah
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A3B8' }}>
            Bahan ajar yang disusun spesifik untuk menuntaskan {skillGapTopics.length} skill gap hasil evaluasi awal.
          </p>
        </div>

        <button
          onClick={() => navigateTo('retest')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:opacity-95 self-start sm:self-auto"
          style={{
            backgroundColor: '#10B981', // Emerald 500
            color: '#F8FAFC'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Siap Ikuti Retest 50 Soal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs flex items-center gap-1 pr-2 font-semibold" style={{ color: '#64748B' }}>
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { key: 'all', label: 'Semua Tipe' },
          { key: 'video', label: 'Video Kuliah' },
          { key: 'artikel', label: 'Artikel & Panduan' },
          { key: 'dokumentasi', label: 'Dokumentasi Resmi' },
          { key: 'jurnal', label: 'Jurnal Riset' },
          { key: 'website', label: 'Website Praktik' },
          { key: 'latihan', label: 'Latihan Kode' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as any)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
            style={{
              backgroundColor: selectedFilter === tab.key ? '#3B82F6' : '#111827',
              border: selectedFilter === tab.key ? '1px solid #3B82F6' : '1px solid #1E293B',
              color: selectedFilter === tab.key ? '#F8FAFC' : '#94A3B8'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topics & Recommendations */}
      <div className="space-y-6">
        {groupedRecommendations.map((group, gIdx) => (
          <div
            key={gIdx}
            className="p-6 rounded-2xl shadow-xl space-y-4"
            style={{
              backgroundColor: '#111827', // Slate 900
              border: '1px solid #1E293B' // Slate 800
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3" style={{ borderBottom: '1px solid #1E293B' }}>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
                  >
                    Skill Gap &bull; Skor: {group.skillGapInfo?.score}%
                  </span>
                  <h2 className="text-base font-bold" style={{ color: '#F8FAFC' }}>
                    {group.topic}
                  </h2>
                </div>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                  {group.skillGapInfo?.summary}
                </p>
              </div>

              <button
                onClick={() => navigateTo('learning_detail', group.topic)}
                className="flex items-center gap-1.5 text-xs font-bold cursor-pointer hover:underline self-start sm:self-auto"
                style={{ color: '#3B82F6' }}
              >
                <span>Buka Rangkuman &amp; Kode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {group.items.map((item) => {
                const isDone = completedMaterials.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl flex flex-col justify-between transition-all"
                    style={{
                      backgroundColor: '#1E293B', // Slate 800
                      border: '1px solid #334155' // Slate 700
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {getIconForType(item.type)}
                          <span>{item.type}</span>
                        </span>
                        <span className="text-[10px]" style={{ color: '#64748B' }}>
                          {item.estimatedMinutes} menit
                        </span>
                      </div>

                      <h3 className="text-xs font-bold mb-1.5" style={{ color: '#F8FAFC' }}>
                        {item.title}
                      </h3>
                      <p className="text-xs line-clamp-2 leading-relaxed mb-3" style={{ color: '#94A3B8' }}>
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-xs" style={{ borderTop: '1px solid #334155' }}>
                      <div className="flex items-center gap-2">
                        {item.embedVideoUrl ? (
                          <button
                            onClick={() => openVideoModal(item.title, item.embedVideoUrl!)}
                            className="flex items-center gap-1 font-bold cursor-pointer"
                            style={{ color: '#EF4444' }}
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Putar Video</span>
                          </button>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-semibold hover:underline"
                            style={{ color: '#3B82F6' }}
                          >
                            <span>Pelajari Sumber</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => markMaterialCompleted(item.id)}
                        className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        style={{ color: isDone ? '#10B981' : '#64748B' }}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'fill-current' : ''}`} />
                        <span>{isDone ? 'Selesai' : 'Tandai Selesai'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
