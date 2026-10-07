import React, { useState } from 'react';
import { LARAVEL_BACKEND_SPECS } from '../data/laravelBackendSpec';
import {
  Server,
  Database,
  Code2,
  Copy,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelSpecModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'migration' | 'routes' | 'controller' | 'service' | 'payload'>('architecture');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const migrationSpec = LARAVEL_BACKEND_SPECS.find((s) => s.category === 'Migration');
  const routesSpec = LARAVEL_BACKEND_SPECS.find((s) => s.category === 'Route');
  const controllerSpec = LARAVEL_BACKEND_SPECS.find((s) => s.category === 'Controller');
  const serviceSpec = LARAVEL_BACKEND_SPECS.find((s) => s.category === 'Service' && s.filename.includes('Gemini'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #334155' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight" style={{ color: '#F8FAFC' }}>
                  Arsitektur Backend: Laravel 11 &amp; MySQL + AI Engine
                </h3>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                  style={{ backgroundColor: '#1E293B', color: '#6366F1', border: '1px solid #334155' }}
                >
                  PHP 8.3 &bull; REST API
                </span>
              </div>
              <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                Spesifikasi integrasi Frontend (React + Tailwind) dengan Backend (Laravel 11)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-800"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex items-center gap-1 px-6 py-2.5 overflow-x-auto text-xs font-semibold no-scrollbar"
          style={{ backgroundColor: '#0D1527', borderBottom: '1px solid #1E293B' }}
        >
          {[
            { key: 'architecture', label: '1. Desain Arsitektur' },
            { key: 'migration', label: '2. Skema Database (7 Tabel)' },
            { key: 'routes', label: '3. API Endpoints' },
            { key: 'controller', label: '4. Controller Laravel' },
            { key: 'service', label: '5. Gemini AI Service' },
            { key: 'payload', label: '6. JSON Payload' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: activeTab === tab.key ? '#3B82F6' : 'transparent',
                color: activeTab === tab.key ? '#F8FAFC' : '#94A3B8'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6" style={{ color: '#F8FAFC' }}>
          {activeTab === 'architecture' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                <div className="flex items-center gap-2 font-bold mb-1" style={{ color: '#6366F1' }}>
                  <Cpu className="w-4 h-4" />
                  <span>Integrasi Frontend React &amp; Backend Laravel 11</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                  Aplikasi ini dirancang menggunakan arsitektur <em>Decoupled Client-Server (SPA &amp; RESTful API)</em>. Frontend React + Tailwind CSS berkomunikasi dengan Backend Laravel via HTTP REST API yang diamankan menggunakan <strong>Laravel Sanctum Bearer Token</strong>.
                </p>
              </div>

              {/* Data Flow Diagram Card */}
              <div
                className="rounded-xl p-5 space-y-4"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
              >
                <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>
                  Alur Data Antara React dan Laravel:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #334155' }}>
                    <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: '#3B82F6' }}>
                      1. Client Tier (React 19)
                    </span>
                    <p className="text-xs leading-snug" style={{ color: '#94A3B8' }}>
                      Antarmuka 50 soal, visual progress bar, modal video, dan adaptive routing.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #334155' }}>
                    <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: '#6366F1' }}>
                      2. Application Tier (Laravel 11)
                    </span>
                    <p className="text-xs leading-snug" style={{ color: '#94A3B8' }}>
                      Validasi input formulir, kalkulasi rumus skor, penentuan level (&lt;60 Beg, 60-79 Int, &ge;80 Adv), dan integrasi AI.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #334155' }}>
                    <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: '#10B981' }}>
                      3. Database Tier (MySQL 8)
                    </span>
                    <p className="text-xs leading-snug" style={{ color: '#94A3B8' }}>
                      Menyimpan data persisten: 100 butir soal PHP terkurasi, histori jawaban, diagnosis skill gap, dan retest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'migration' && migrationSpec && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>{migrationSpec.filename}</h4>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{migrationSpec.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(migrationSpec.code, 'migration')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
                >
                  {copiedFile === 'migration' ? <Check className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'migration' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0B1020', border: '1px solid #334155' }}>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]" style={{ color: '#10B981' }}>
                  <code>{migrationSpec.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'routes' && routesSpec && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>{routesSpec.filename}</h4>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{routesSpec.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(routesSpec.code, 'routes')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
                >
                  {copiedFile === 'routes' ? <Check className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'routes' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0B1020', border: '1px solid #334155' }}>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]" style={{ color: '#3B82F6' }}>
                  <code>{routesSpec.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'controller' && controllerSpec && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>{controllerSpec.filename}</h4>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{controllerSpec.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(controllerSpec.code, 'controller')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
                >
                  {copiedFile === 'controller' ? <Check className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'controller' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0B1020', border: '1px solid #334155' }}>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]" style={{ color: '#6366F1' }}>
                  <code>{controllerSpec.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'service' && serviceSpec && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>{serviceSpec.filename}</h4>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{serviceSpec.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(serviceSpec.code, 'service')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
                >
                  {copiedFile === 'service' ? <Check className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'service' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0B1020', border: '1px solid #334155' }}>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]" style={{ color: '#8B5CF6' }}>
                  <code>{serviceSpec.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'payload' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-sm" style={{ color: '#F8FAFC' }}>
                Struktur JSON Request &amp; Response API:
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                  <span className="font-mono font-bold block mb-1" style={{ color: '#3B82F6' }}>
                    POST /api/assessments/submit
                  </span>
                  <pre className="p-3 rounded-lg font-mono overflow-x-auto" style={{ backgroundColor: '#0B1020', color: '#10B981' }}>
{`{
  "answers": { "1": "A", "2": "C", ..., "50": "B" },
  "type": "initial"
}`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                  <span className="font-mono font-bold block mb-1" style={{ color: '#10B981' }}>
                    RESPONSE (200 OK)
                  </span>
                  <pre className="p-3 rounded-lg font-mono overflow-x-auto" style={{ backgroundColor: '#0B1020', color: '#94A3B8' }}>
{`{
  "status": "success",
  "score": 74,
  "level": "Intermediate",
  "skill_gaps": ["Object Oriented Programming / OOP", "Database / MySQL"],
  "ai_analysis": {
    "summary": "Kemampuan PHP Anda berada pada level Intermediate...",
    "action_plan": "Fokuskan pada materi OOP dan PDO sebelum retest."
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
