import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ArrowRight, Lock, Mail, User, School, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo } = useApp();

  const [name, setName] = useState('Budi Pratama');
  const [email, setEmail] = useState('budi.pratama@mhs.ac.id');
  const [nim, setNim] = useState('22051204018');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    registerUser(name, email, nim);
  };

  return (
    <div className="py-10 px-4 sm:px-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-mono font-bold text-2xl shadow-lg"
          style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
        >
          &lt;/&gt;
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#F8FAFC' }}>
          Registrasi Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm mt-1.5" style={{ color: '#94A3B8' }}>
          Daftar untuk memulai pengukuran kemampuan adaptif pemrograman PHP
        </p>
      </div>

      {/* Form Container */}
      <div
        className="p-6 sm:p-8 rounded-2xl shadow-xl space-y-4"
        style={{
          backgroundColor: '#111827', // Slate 900
          border: '1px solid #1E293B' // Slate 800
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Pratama"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
              NIM / Nomor Induk Mahasiswa
            </label>
            <div className="relative">
              <School className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
              <input
                type="text"
                required
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 22051204018"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
              Alamat Email Kampus
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@kampus.ac.id"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl transition-all focus:outline-none"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#F8FAFC' }}>
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: '#64748B' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
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
                color: '#F8FAFC'
              }}
            >
              <span>Daftar &amp; Mulai 50 Soal Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 text-center" style={{ borderTop: '1px solid #1E293B' }}>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Sudah memiliki akun?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="font-bold hover:underline cursor-pointer"
              style={{ color: '#3B82F6' }}
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
