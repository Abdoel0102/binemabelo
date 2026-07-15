import React, { useState } from 'react';
import { LogIn, Shield, User as UserIcon, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  usersList: User[];
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, usersList }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan Password harus diisi!');
      return;
    }

    // Authentication Checks
    if (username.toLowerCase() === 'admin' && password === 'admin01') {
      const adminUtama = usersList.find(u => u.username === 'Admin') || {
        id: 'user-1',
        username: 'Admin',
        role: 'admin_utama' as UserRole,
        name: 'Administrator Utama (BTHP)',
        createdAt: '2026-01-01 08:00',
      };
      onLoginSuccess(adminUtama);
      onClose();
      return;
    }

    // Check other accounts in usersList (Admin Input)
    const matchedUser = usersList.find(u => u.username === username);
    if (matchedUser) {
      // For mock purposes, we allow 'input01' or password matching username + '01'
      if (password === 'input01' || password === `${username}01` || password === 'admin01') {
        onLoginSuccess(matchedUser);
        onClose();
        return;
      }
    }

    setError('Username atau Password salah! Hubungi Admin Utama jika belum terdaftar.');
  };

  return (
    <div id="login-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div 
        id="login-card"
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-100 dark:border-neutral-800"
      >
        {/* Banner */}
        <div className="bg-emerald-600 px-6 py-6 text-white relative">
          <button 
            id="close-login-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white hover:bg-emerald-700/50 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Coat_of_arms_of_Central_Sulawesi.png" 
                alt="Logo Sulawesi Tengah" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans">BINE MABELO</h2>
              <p className="text-xs text-emerald-100">Portal Keanggotaan & Administrasi</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <p className="text-sm text-neutral-500">
              Silakan login untuk mengelola sertifikasi dan pengawasan benih.
            </p>
          </div>

          {error && (
            <div id="login-error" className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start space-x-2.5 text-xs border border-red-100 dark:border-red-950/50">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: Admin atau petugas_pangan"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                Password
              </label>
              <span className="text-[10px] text-neutral-400">Admin Utama: admin01</span>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full pl-3 pr-10 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
              <button
                id="toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100/30 text-[11px] text-emerald-800 dark:text-emerald-400 space-y-1">
            <p className="font-semibold">Petunjuk Login Uji Coba:</p>
            <ul className="list-disc pl-3.5 space-y-0.5 text-neutral-600 dark:text-neutral-400">
              <li><strong>Admin Utama:</strong> Username: <code className="bg-emerald-100/50 dark:bg-emerald-900/50 px-1 py-0.5 rounded">Admin</code> & Pass: <code className="bg-emerald-100/50 dark:bg-emerald-900/50 px-1 py-0.5 rounded">admin01</code></li>
              <li><strong>Admin Input:</strong> Username: <code className="bg-emerald-100/50 dark:bg-emerald-900/50 px-1 py-0.5 rounded">petugas_pangan</code> & Pass: <code className="bg-emerald-100/50 dark:bg-emerald-900/50 px-1 py-0.5 rounded">input01</code></li>
            </ul>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 rounded-xl shadow-md shadow-emerald-600/15 transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sistem</span>
          </button>
        </form>
      </div>
    </div>
  );
}
