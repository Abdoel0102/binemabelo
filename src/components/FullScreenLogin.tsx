import React, { useState } from 'react';
import { 
  Wheat, Sprout, Shield, LogIn, Eye, EyeOff, AlertCircle, 
  ChevronRight, Landmark, MapPin, Database, Award, User as UserIcon
} from 'lucide-react';
import { User, UserRole } from '../types';

interface FullScreenLoginProps {
  onLoginSuccess: (user: User) => void;
  onEnterAsGuest: () => void;
  usersList: User[];
}

export default function FullScreenLogin({ onLoginSuccess, onEnterAsGuest, usersList }: FullScreenLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate mobile network latency for high-fidelity native feel
    setTimeout(() => {
      if (!username || !password) {
        setError('Username dan Password harus diisi!');
        setLoading(false);
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
        setLoading(false);
        return;
      }

      // Check other accounts in usersList (Admin Input)
      const matchedUser = usersList.find(u => u.username === username);
      if (matchedUser) {
        if (password === 'input01' || password === `${username}01` || password === 'admin01') {
          onLoginSuccess(matchedUser);
          setLoading(false);
          return;
        }
      }

      setError('Username atau Password salah! Hubungi Admin Utama jika belum terdaftar.');
      setLoading(false);
    }, 400);
  };

  return (
    <div id="android-login-wrapper" className="min-h-screen bg-slate-100 dark:bg-neutral-950 flex flex-col items-center justify-center py-0 sm:py-8 px-0 sm:px-4 font-sans selection:bg-emerald-500/30">
      
      {/* Background ambient lighting for beautiful desktop view */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Android Smartphone Container Frame */}
      {/* Behaves as a beautiful phone mockup on desktop and fluid fullscreen on mobile devices */}
      <div 
        id="android-phone-mockup" 
        className="w-full h-screen sm:w-[395px] sm:h-[812px] sm:my-auto bg-white dark:bg-neutral-900 sm:rounded-[48px] sm:border-[10px] sm:border-neutral-900 sm:ring-[1px] sm:ring-neutral-800/20 sm:shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300"
      >
        
        {/* 2. Scrollable App Content Area */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-7 overflow-y-auto space-y-6 bg-white dark:bg-neutral-900">
          
          {/* Top Back / Logo section */}
          <div className="flex flex-col items-center text-center pt-3 space-y-4">
            
            {/* Round Material You Logo frame */}
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/10 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Coat_of_arms_of_Central_Sulawesi.png" 
                alt="Logo Sulawesi Tengah" 
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 justify-center">
                <span className="text-xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100 font-sans">
                  BINE MABELO
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Sertifikasi &amp; Pengawasan Benih Berbasis Geospasial
              </p>
            </div>
          </div>

          {/* Form wrapper */}
          <div className="space-y-5">
            
            {/* Header info */}
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200">
                Silakan Masuk
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Gunakan kredensial petugas BPSB untuk sinkronisasi data lapangan.
              </p>
            </div>

            {error && (
              <div id="full-login-error" className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl flex items-start space-x-2 text-xs border border-rose-100 dark:border-rose-950/30">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Core Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Input Username */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider pl-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="full-login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan Username"
                    className="w-full pl-9 pr-4 py-3 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-full focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider pl-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="full-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Kata Sandi"
                    className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-full focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    required
                  />
                  <button
                    id="full-toggle-password-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="full-login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 rounded-full shadow-md shadow-emerald-600/10 transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-5"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Menghubungkan...' : 'Masuk Akun'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-100 dark:border-neutral-800"></div>
              <span className="flex-shrink mx-3 text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">Atau</span>
              <div className="flex-grow border-t border-neutral-100 dark:border-neutral-800"></div>
            </div>

            {/* Public Access Mode */}
            <button
              id="guest-enter-btn"
              type="button"
              onClick={onEnterAsGuest}
              className="w-full bg-white dark:bg-neutral-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 border border-emerald-100 dark:border-neutral-700/80 font-bold text-xs sm:text-sm py-3 rounded-full transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Lanjutkan Akses Publik</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Info inside Android App */}
          <div className="space-y-3 pt-2 text-center">
            <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-normal max-w-xs mx-auto">
              Sistem Informasi BPSB Tanaman Pangan &amp; Hortikultura Provinsi Sulawesi Tengah.
            </p>
            <div className="flex justify-center items-center text-[8px] text-neutral-400 space-x-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-500" />
              <span>Palu, Sulawesi Tengah</span>
            </div>
          </div>

        </div>

        {/* 3. Android Navigation Gesture Bar */}
        <div className="h-5 bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 select-none pb-2">
          <div className="w-24 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        </div>

      </div>

    </div>
  );
}
