import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, ArrowRight, Lock, Mail, UserPlus, Flame, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, registerUser } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [email, setEmail] = useState('budi.pratama@mhs.ac.id');
  const [password, setPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const name = email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Mahasiswa';
    loginUser(email, name);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    registerUser(regName, regEmail, regNim);
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    setEmail(demoEmail);
    loginUser(demoEmail, demoName);
  };

  return (
    <div className="py-10 px-4 sm:px-6 w-full max-w-md mx-auto">
      {/* Brand & Title */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-mono font-bold text-2xl shadow-lg"
          style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }} // Blue 500 & Slate 50
        >
          &lt;/&gt;
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
          AdaptifPHP
        </h1>
        <p className="text-xs sm:text-sm mt-1.5" style={{ color: '#94A3B8' }}>
          Sistem Pembelajaran &amp; Uji Kompetensi Adaptif PHP
        </p>

        {/* Feature Pill */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#6366F1' // Indigo 500
            }}
          >
            <Zap className="w-3 h-3" />
            <span>AI Diagnostik &amp; Retest Adaptif</span>
          </span>
        </div>
      </div>

      {/* Auth Card Surface */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        {/* Tab Switcher */}
        <div
          className="flex mb-6"
          style={{ borderBottom: '1px solid #334155' }} // Slate 700
        >
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="flex-1 pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer"
            style={{
              borderColor: activeTab === 'login' ? '#3B82F6' : 'transparent',
              color: activeTab === 'login' ? '#3B82F6' : '#64748B'
            }}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className="flex-1 pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer"
            style={{
              borderColor: activeTab === 'register' ? '#3B82F6' : 'transparent',
              color: activeTab === 'register' ? '#3B82F6' : '#64748B'
            }}
          >
            Daftar Mahasiswa
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl transition-all focus:outline-none"
                  style={{
                    backgroundColor: '#1E293B', // Slate 800
                    border: '1px solid #334155', // Slate 700
                    color: '#F8FAFC' // Slate 50
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold" style={{ color: '#F8FAFC' }}>
                  Kata Sandi
                </label>
                <span className="text-[11px]" style={{ color: '#64748B' }}>Default: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl transition-all focus:outline-none"
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    color: '#F8FAFC'
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 font-semibold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: '#3B82F6', // Blue 500
                  color: '#F8FAFC' // Slate 50
                }}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Sistem</span>
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid #1E293B' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#64748B' }}>
                Akun Demo Cepat (Klik untuk Tes):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Budi Pratama', 'budi.pratama@mhs.ac.id')}
                  className="text-left p-2.5 rounded-xl transition-colors cursor-pointer hover:border-blue-500"
                  style={{
                    backgroundColor: '#1E293B', // Slate 800
                    border: '1px solid #334155' // Slate 700
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: '#F8FAFC' }}>Budi Pratama</div>
                  <div className="text-[10px]" style={{ color: '#94A3B8' }}>Mahasiswa Baru</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Siti Nurhaliza', 'siti.nurhaliza@mhs.ac.id')}
                  className="text-left p-2.5 rounded-xl transition-colors cursor-pointer hover:border-blue-500"
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155'
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: '#F8FAFC' }}>Siti Nurhaliza</div>
                  <div className="text-[10px]" style={{ color: '#94A3B8' }}>Semester 4 TI</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full text-xs px-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                value={regNim}
                onChange={(e) => setRegNim(e.target.value)}
                placeholder="Contoh: 21050974012"
                className="w-full text-xs px-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
                Alamat Email Kampus
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nama@kampus.ac.id"
                className="w-full text-xs px-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full text-xs px-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 font-semibold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#F8FAFC'
                }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar &amp; Mulai Assessment</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feature Highlights with exact palette */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <span className="block text-xs font-bold" style={{ color: '#F8FAFC' }}>50 Soal</span>
          <span className="block text-[10px]" style={{ color: '#94A3B8' }}>Assessment Awal</span>
        </div>
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <span className="block text-xs font-bold" style={{ color: '#6366F1' }}>Diagnostik</span>
          <span className="block text-[10px]" style={{ color: '#94A3B8' }}>Analisis Gap</span>
        </div>
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1E293B'
          }}
        >
          <span className="block text-xs font-bold" style={{ color: '#10B981' }}>Retest</span>
          <span className="block text-[10px]" style={{ color: '#94A3B8' }}>Soal Berubah</span>
        </div>
      </div>
    </div>
  );
};
