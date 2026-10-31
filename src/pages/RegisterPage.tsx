import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }
    if (password !== confirmation) {
      setError('Konfirmasi kata sandi belum sama.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser(name.trim(), email.trim(), nim.trim(), password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Akun belum dapat dibuat. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Setiap ahli pernah memulai dari nol."
      footer={<p className="auth-legal">Sudah punya akun? <button onClick={() => navigateTo('login')}>Masuk di sini</button></p>}
    >
      <div className="auth-heading">
        <span className="eyebrow">Mulai perjalananmu</span>
        <h2>Buat ruang untuk tumbuh.</h2>
        <p>Daftar gratis dan temukan titik awal kemampuan PHP-mu.</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Nama lengkap
          <span className="auth-input"><UserRound size={16} /><input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama lengkap" /></span>
        </label>
        <label>Email
          <span className="auth-input"><Mail size={16} /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></span>
        </label>
        <label>NIM <span className="auth-muted">(opsional)</span>
          <span className="auth-input"><UserRound size={16} /><input autoComplete="off" value={nim} onChange={(event) => setNim(event.target.value)} placeholder="Nomor induk mahasiswa" /></span>
        </label>
        <label>Kata sandi
          <span className="auth-input"><LockKeyhole size={16} /><input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" /></span>
        </label>
        <label>Konfirmasi kata sandi
          <span className="auth-input"><LockKeyhole size={16} /><input type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Ulangi kata sandi" /></span>
        </label>
        {error && <p role="alert" className="auth-error">{error}</p>}
        <label className="auth-checkbox"><input type="checkbox" required /> Saya menyetujui Ketentuan Penggunaan dan Kebijakan Privasi.</label>
        <button className="button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Membuat akun...' : 'Buat akun & mulai tes awal'} <ArrowRight size={17} />
        </button>
      </form>
    </AuthLayout>
  );
};
