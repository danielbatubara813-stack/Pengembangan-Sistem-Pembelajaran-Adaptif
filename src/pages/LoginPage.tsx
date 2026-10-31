import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginUser, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setIsSubmitting(true);
    try {
      await loginUser(email.trim(), password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Tidak dapat masuk. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Langkah berikutnya dimulai dari sini."
      footer={<p className="auth-legal">Belum punya akun? <button onClick={() => navigateTo('register')}>Daftar gratis</button></p>}
    >
      <div className="auth-heading">
        <span className="eyebrow">Selamat datang kembali</span>
        <h2>Lanjutkan langkahmu.</h2>
        <p>Masuk untuk melihat jalur belajar dan perkembangan kemampuan PHP-mu.</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email
          <span className="auth-input"><Mail size={16} /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></span>
        </label>
        <label>Kata sandi
          <span className="auth-input"><LockKeyhole size={16} /><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan kata sandi" /></span>
        </label>
        {error && <p role="alert" className="auth-error">{error}</p>}
        <div className="auth-form-options">
          <label className="auth-checkbox"><input type="checkbox" /> Ingat saya</label>
          <span className="auth-muted">Gunakan akun terdaftar</span>
        </div>
        <button className="button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memeriksa akun...' : 'Masuk ke akun'} <ArrowRight size={17} />
        </button>
      </form>
    </AuthLayout>
  );
};
