import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, CheckCircle2 } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeVideoEmbed, closeVideoModal } = useApp();

  if (!activeVideoEmbed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155' }}
        >
          <div className="flex items-center gap-2 max-w-[80%]">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <h3 className="text-sm font-semibold truncate" style={{ color: '#F8FAFC' }}>
              {activeVideoEmbed.title}
            </h3>
          </div>
          <button
            onClick={closeVideoModal}
            className="p-1 rounded-md transition-colors cursor-pointer hover:bg-slate-800"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={activeVideoEmbed.embedUrl}
            title={activeVideoEmbed.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between text-xs"
          style={{ backgroundColor: '#0B1020', borderTop: '1px solid #1E293B' }}
        >
          <div className="flex items-center gap-2" style={{ color: '#94A3B8' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></span>
            <span>Video Pembelajaran Terintegrasi</span>
          </div>

          <button
            onClick={closeVideoModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-700"
            style={{ backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
          >
            Tutup Pemutar
          </button>
        </div>
      </div>
    </div>
  );
};
