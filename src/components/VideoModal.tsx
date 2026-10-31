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
          backgroundColor: 'var(--color-surface)', // Slate 900
          border: '1px solid var(--color-border)' // Slate 800
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2 max-w-[80%]">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <h3 className="text-sm font-semibold break-words" style={{ color: 'var(--color-text-primary)' }}>
              {activeVideoEmbed.title}
            </h3>
          </div>
          <button
            onClick={closeVideoModal}
            className="p-1 rounded-md transition-colors cursor-pointer hover:bg-slate-100"
            style={{ color: 'var(--color-text-secondary)' }}
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
          style={{ backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }}></span>
            <span>Video Pembelajaran Terintegrasi</span>
          </div>

          <button
            onClick={closeVideoModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-100"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
          >
            Tutup Pemutar
          </button>
        </div>
      </div>
    </div>
  );
};
