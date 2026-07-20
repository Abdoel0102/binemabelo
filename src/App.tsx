import React, { useState, useEffect } from 'react';
import { 
  Wheat, Sprout, MapPin, ScanLine, FileText, Settings2, Bell, ShieldCheck, 
  LogIn, LogOut, Menu, X, Landmark, User as UserIcon, History, Info, Sparkles, Database
} from 'lucide-react';

// Data and Types
import { 
  User, Sertifikasi, Pengawasan, Kultivar, Berita, Notification, HistoryLog, SeedCategory 
} from './types';
import { 
  defaultUsers, initialCertifications, initialMonitoring, initialCultivars, 
  initialNews, initialNotifications, initialHistoryLogs 
} from './data';

// Components
import Dashboard from './components/Dashboard';
import PetaLokasi from './components/PetaLokasi';
import SertifikasiManager from './components/SertifikasiManager';
import PengawasanManager from './components/PengawasanManager';
import KultivarManager from './components/KultivarManager';
import ScanQR from './components/ScanQR';
import InfoBerita from './components/InfoBerita';
import Pengaturan from './components/Pengaturan';
import LoginModal from './components/LoginModal';
import FullScreenLogin from './components/FullScreenLogin';
import SupabaseSync from './components/SupabaseSync';

// Supabase integrations
import { 
  isSupabaseConfigured, supabase, 
  mapSertifikasiFromDb, mapSertifikasiToDb, 
  mapPengawasanFromDb, mapPengawasanToDb, 
  mapKultivarFromDb, mapKultivarToDb, 
  mapBeritaFromDb, mapBeritaToDb, 
  mapHistoryLogFromDb, mapHistoryLogToDb, 
  mapUserFromDb, mapUserToDb 
} from './lib/supabase';


export default function App() {
  // Mobile menu control
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null); // null = Akses Publik (Guest)
  const [isGuestEntered, setIsGuestEntered] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<User[]>(defaultUsers);

  // Main Databases (Persisted with state, initialized with seed data)
  const [certifications, setCertifications] = useState<Sertifikasi[]>(initialCertifications);
  const [monitoringList, setMonitoringList] = useState<Pengawasan[]>(initialMonitoring);
  const [cultivars, setCultivars] = useState<Kultivar[]>(initialCultivars);
  const [newsList, setNewsList] = useState<Berita[]>(initialNews);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>(initialHistoryLogs);

  // Active Menu View
  // 'dashboard' | 'pangan' | 'horti' | 'peta' | 'scan' | 'berita' | 'riwayat' | 'pengaturan'
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  
  // Sub-tabs for Tanaman Pangan & Hortikultura
  // 'sertifikasi' | 'pengawasan' | 'kultivar'
  const [activeSubTab, setActiveSubTab] = useState<'sertifikasi' | 'pengawasan' | 'kultivar'>('sertifikasi');

  // Load from localstorage if available on startup (optional enhancement)
  useEffect(() => {
    const savedUser = localStorage.getItem('bine_mabelo_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsGuestEntered(true);
      } catch (e) {
        localStorage.removeItem('bine_mabelo_user');
      }
    }
  }, []);

  // Load initial data from Supabase if configured
  useEffect(() => {
    const loadSupabaseData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        console.log('Supabase is not configured, running on mock data.');
        return;
      }

      try {
        // Query users
        const { data: dbUsers, error: usersError } = await supabase.from('mabelo_users').select('*');
        if (!usersError && dbUsers && dbUsers.length > 0) {
          setUsersList(dbUsers.map(mapUserFromDb));
        }

        // Query certifications
        const { data: dbSert, error: sertError } = await supabase.from('mabelo_sertifikasi').select('*');
        if (!sertError && dbSert && dbSert.length > 0) {
          setCertifications(dbSert.map(mapSertifikasiFromDb));
        }

        // Query monitoring
        const { data: dbMon, error: monError } = await supabase.from('mabelo_pengawasan').select('*');
        if (!monError && dbMon && dbMon.length > 0) {
          setMonitoringList(dbMon.map(mapPengawasanFromDb));
        }

        // Query cultivars
        const { data: dbCult, error: cultError } = await supabase.from('mabelo_kultivar').select('*');
        if (!cultError && dbCult && dbCult.length > 0) {
          setCultivars(dbCult.map(mapKultivarFromDb));
        }

        // Query news
        const { data: dbNews, error: newsError } = await supabase.from('mabelo_berita').select('*');
        if (!newsError && dbNews && dbNews.length > 0) {
          setNewsList(dbNews.map(mapBeritaFromDb));
        }

        // Query history logs
        const { data: dbLogs, error: logsError } = await supabase.from('mabelo_history_logs').select('*');
        if (!logsError && dbLogs && dbLogs.length > 0) {
          setHistoryLogs(dbLogs.map(mapHistoryLogFromDb));
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      }
    };

    loadSupabaseData();
  }, []);

  const forceSyncLocalWithSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: dbUsers } = await supabase.from('mabelo_users').select('*');
      if (dbUsers && dbUsers.length > 0) setUsersList(dbUsers.map(mapUserFromDb));

      const { data: dbSert } = await supabase.from('mabelo_sertifikasi').select('*');
      if (dbSert && dbSert.length > 0) setCertifications(dbSert.map(mapSertifikasiFromDb));

      const { data: dbMon } = await supabase.from('mabelo_pengawasan').select('*');
      if (dbMon && dbMon.length > 0) setMonitoringList(dbMon.map(mapPengawasanFromDb));

      const { data: dbCult } = await supabase.from('mabelo_kultivar').select('*');
      if (dbCult && dbCult.length > 0) setCultivars(dbCult.map(mapKultivarFromDb));

      const { data: dbNews } = await supabase.from('mabelo_berita').select('*');
      if (dbNews && dbNews.length > 0) setNewsList(dbNews.map(mapBeritaFromDb));

      const { data: dbLogs } = await supabase.from('mabelo_history_logs').select('*');
      if (dbLogs && dbLogs.length > 0) setHistoryLogs(dbLogs.map(mapHistoryLogFromDb));
    } catch (err) {
      console.error('Force sync error:', err);
    }
  };


  // Helper: Log activities and trigger notification helper
  const addSystemLog = (action: string, details: string) => {
    const actorName = currentUser ? currentUser.name : 'Publik / Guest';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Log to history
    const newLog: HistoryLog = {
      id: `log-${Date.now()}`,
      user: actorName,
      action,
      details,
      timestamp
    };
    setHistoryLogs(prev => [newLog, ...prev]);

    // Push notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: action,
      description: `${actorName}: ${details}`,
      time: 'Baru saja',
      read: false,
      type: action.includes('Hapus') || action.includes('Dilarang') ? 'warning' : 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Async write to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_history_logs').insert(mapHistoryLogToDb(newLog))
        .then(() => {}, err => console.error('Supabase write log error:', err));
    }
  };

  // Login handler
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('bine_mabelo_user', JSON.stringify(user));
    addSystemLog('Login Berhasil', `Masuk sebagai ${user.role.replace('_', ' ')} (${user.username})`);
    setActiveMenu('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    if (currentUser) {
      addSystemLog('Keluar Sistem', `Petugas ${currentUser.name} telah keluar`);
      setCurrentUser(null);
      localStorage.removeItem('bine_mabelo_user');
    }
    setIsGuestEntered(false);
    setActiveMenu('dashboard');
  };

  // CRUD FOR SERTIFIKASI
  const handleAddSertifikasi = (data: Sertifikasi) => {
    setCertifications(prev => [data, ...prev]);
    addSystemLog('Pengajuan Sertifikasi Baru', `Mendaftarkan produsen ${data.namaProdusen} untuk komoditi ${data.komoditas} (${data.varietas})`);
    
    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_sertifikasi').insert(mapSertifikasiToDb(data))
        .then(() => {}, err => console.error('Supabase sertifikasi insert failed:', err));
    }
  };

  const handleUpdateSertifikasi = (data: Sertifikasi) => {
    setCertifications(prev => prev.map(c => c.id === data.id ? data : c));
    addSystemLog('Ubah Data Sertifikasi', `Memperbarui berkas ${data.namaProdusen} - status saat ini: ${data.status}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_sertifikasi').update(mapSertifikasiToDb(data)).eq('id', data.id)
        .then(() => {}, err => console.error('Supabase sertifikasi update failed:', err));
    }
  };

  const handleDeleteSertifikasi = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    setCertifications(prev => prev.filter(c => c.id !== id));
    if (cert) {
      addSystemLog('Hapus Sertifikasi', `Menghapus data sertifikasi produsen ${cert.namaProdusen}`);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_sertifikasi').delete().eq('id', id)
        .then(() => {}, err => console.error('Supabase sertifikasi delete failed:', err));
    }
  };

  // CRUD FOR PENGAWASAN
  const handleAddMonitoring = (data: Pengawasan) => {
    setMonitoringList(prev => [data, ...prev]);
    addSystemLog('Laporan Pengawasan Baru', `Mencatat audit toko ${data.namaPengecer} - Kelayakan: ${data.statusKelayakan}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_pengawasan').insert(mapPengawasanToDb(data))
        .then(() => {}, err => console.error('Supabase pengawasan insert failed:', err));
    }
  };

  const handleUpdateMonitoring = (data: Pengawasan) => {
    setMonitoringList(prev => prev.map(m => m.id === data.id ? data : m));
    addSystemLog('Ubah Data Pengawasan', `Memperbarui rekam audit di ${data.namaPengecer} (${data.statusKelayakan})`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_pengawasan').update(mapPengawasanToDb(data)).eq('id', data.id)
        .then(() => {}, err => console.error('Supabase pengawasan update failed:', err));
    }
  };

  const handleDeleteMonitoring = (id: string) => {
    const mon = monitoringList.find(m => m.id === id);
    setMonitoringList(prev => prev.filter(m => m.id !== id));
    if (mon) {
      addSystemLog('Hapus Data Pengawasan', `Menghapus berkas audit di ${mon.namaPengecer}`);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_pengawasan').delete().eq('id', id)
        .then(() => {}, err => console.error('Supabase pengawasan delete failed:', err));
    }
  };

  // CRUD FOR KULTIVAR
  const handleAddCultivar = (data: Kultivar) => {
    setCultivars(prev => [data, ...prev]);
    addSystemLog('Registrasi Kultivar Baru', `Mendaftarkan varietas ${data.namaVarietas} untuk komoditi ${data.komoditas}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_kultivar').insert(mapKultivarToDb(data))
        .then(() => {}, err => console.error('Supabase kultivar insert failed:', err));
    }
  };

  const handleUpdateCultivar = (data: Kultivar) => {
    setCultivars(prev => prev.map(c => c.id === data.id ? data : c));
    addSystemLog('Ubah Data Kultivar', `Memperbarui profil spesifikasi varietas ${data.namaVarietas}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_kultivar').update(mapKultivarToDb(data)).eq('id', data.id)
        .then(() => {}, err => console.error('Supabase kultivar update failed:', err));
    }
  };

  const handleDeleteCultivar = (id: string) => {
    const cult = cultivars.find(c => c.id === id);
    setCultivars(prev => prev.filter(c => c.id !== id));
    if (cult) {
      addSystemLog('Hapus Data Kultivar', `Menghapus varietas ${cult.namaVarietas} dari katalog`);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_kultivar').delete().eq('id', id)
        .then(() => {}, err => console.error('Supabase kultivar delete failed:', err));
    }
  };

  // CRUD FOR BERITA
  const handleAddNews = (data: Berita) => {
    setNewsList(prev => [data, ...prev]);
    addSystemLog('Terbit Berita Baru', `Mempublikasikan artikel: "${data.judul}"`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_berita').insert(mapBeritaToDb(data))
        .then(() => {}, err => console.error('Supabase berita insert failed:', err));
    }
  };

  const handleUpdateNews = (data: Berita) => {
    setNewsList(prev => prev.map(n => n.id === data.id ? data : n));
    addSystemLog('Ubah Berita', `Memperbarui publikasi artikel: "${data.judul}"`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_berita').update(mapBeritaToDb(data)).eq('id', data.id)
        .then(() => {}, err => console.error('Supabase berita update failed:', err));
    }
  };

  const handleDeleteNews = (id: string) => {
    const news = newsList.find(n => n.id === id);
    setNewsList(prev => prev.filter(n => n.id !== id));
    if (news) {
      addSystemLog('Hapus Berita', `Menghapus publikasi berita: "${news.judul}"`);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_berita').delete().eq('id', id)
        .then(() => {}, err => console.error('Supabase berita delete failed:', err));
    }
  };

  // ADMIN UTAMA - USER MANAGEMENT
  const handleAddUser = (user: User) => {
    setUsersList(prev => [...prev, user]);
    addSystemLog('Registrasi Petugas Baru', `Membuat akun staff untuk ${user.name} (${user.username})`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_users').insert(mapUserToDb(user))
        .then(() => {}, err => console.error('Supabase user insert failed:', err));
    }
  };

  const handleDeleteUser = (id: string) => {
    const usr = usersList.find(u => u.id === id);
    setUsersList(prev => prev.filter(u => u.id !== id));
    if (usr) {
      addSystemLog('Hapus Akun Pengguna', `Menghapus akses akun petugas ${usr.name}`);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_users').delete().eq('id', id)
        .then(() => {}, err => console.error('Supabase user delete failed:', err));
    }
  };

  // Clear log helper
  const handleClearLogs = () => {
    setHistoryLogs([]);
    addSystemLog('Bersihkan Log', 'Seluruh history log audit sistem dikosongkan oleh Admin Utama');

    if (isSupabaseConfigured && supabase) {
      supabase.from('mabelo_history_logs').delete().gt('id', '')
        .then(() => {}, err => console.error('Supabase logs clear failed:', err));
    }
  };


  // Jump navigations helper (from cards etc)
  const handleNavigateFromDashboard = (tab: string) => {
    if (tab === 'pangan' || tab === 'horti') {
      setActiveMenu(tab);
      setActiveSubTab('sertifikasi');
    } else {
      setActiveMenu(tab);
    }
    setIsSidebarOpen(false);
  };

  if (!currentUser && !isGuestEntered) {
    return (
      <FullScreenLogin 
        onLoginSuccess={handleLogin}
        onEnterAsGuest={() => {
          setIsGuestEntered(true);
          setActiveMenu('pangan');
        }}
        usersList={usersList}
      />
    );
  }

  return (
    <div id="app-root-shell" className="min-h-screen bg-[#F8FAF9] dark:bg-neutral-950 flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. TOP BAR NAVBAR */}
      <header id="top-nav-bar" className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 shadow-xs px-4 md:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <button 
            id="mobile-menu-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 md:hidden cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Icon emblem */}
          <div className="p-1.5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700/80 shadow-xs flex items-center justify-center shrink-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Coat_of_arms_of_Central_Sulawesi.png" 
              alt="Logo Sulawesi Tengah" 
              className="w-7 h-7 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-black tracking-wider text-emerald-800 dark:text-emerald-400 font-sans">BINE MABELO</span>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-100/50">SULTENG</span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block font-sans">Sistem Sertifikasi & Pengawasan Elektronik Berbasis Lokasi</p>
          </div>
        </div>

        {/* User profile & Login trigger actions */}
        <div className="flex items-center space-x-3.5">
          
          {/* Notifications Badged Indicator */}
          <div className="relative cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850 p-2 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-neutral-500" />
            {notifications.some(n => !n.read) && (
              <span id="unread-notif-dot" className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </div>

          {/* Login Status Pill */}
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-600 capitalize font-medium">{currentUser.role.replace('_', ' ')}</p>
              </div>

              <button
                id="logout-btn"
                onClick={handleLogout}
                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-600 dark:text-neutral-300 hover:text-red-600 p-2 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer text-xs font-bold"
                title="Keluar Sistem"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              id="login-open-btn"
              onClick={() => setIsLoginOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-600/10 transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Admin</span>
            </button>
          )}

        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* 2. SIDEBAR NAVIGATION */}
        <aside 
          id="app-sidebar"
          className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 transition-transform duration-300 ease-in-out bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 w-64 p-5 shrink-0 flex flex-col justify-between`}
        >
          {/* Menu navigation options */}
          <div className="space-y-6">
            
            {/* Header info for mobile only */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 md:hidden">
              <span className="font-extrabold text-sm text-emerald-600">MENU UTAMA</span>
              <button 
                id="close-sidebar-btn"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile widget in sidebar for quick status */}
            <div className="bg-neutral-50 dark:bg-neutral-850 p-3.5 rounded-2xl border border-neutral-100/50 dark:border-neutral-850 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">
                    {currentUser ? currentUser.name : 'Akses Publik'}
                  </p>
                  <p className="text-[10px] text-neutral-400 capitalize truncate">
                    {currentUser ? currentUser.role.replace('_', ' ') : 'Pengunjung Umum'}
                  </p>
                </div>
              </div>
              {!currentUser && (
                <button
                  id="sidebar-back-to-login"
                  onClick={() => {
                    setIsGuestEntered(false);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-center text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold bg-white dark:bg-neutral-850 py-1.5 rounded-xl border border-emerald-100/50 dark:border-neutral-800 cursor-pointer flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Kembali ke Portal Login</span>
                </button>
              )}
            </div>

            {/* Sidebar List Links */}
            <nav className="space-y-1">
              
              {currentUser && (
                <button
                  id="menu-dash"
                  onClick={() => { setActiveMenu('dashboard'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'dashboard'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                  }`}
                >
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard Utama</span>
                </button>
              )}

              <button
                id="menu-tp"
                onClick={() => { setActiveMenu('pangan'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'pangan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wheat className="w-4 h-4 text-amber-500" />
                  <span>Tanaman Pangan</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-100">
                  {certifications.filter(c => c.kategori === 'pangan').length}
                </span>
              </button>

              <button
                id="menu-horti"
                onClick={() => { setActiveMenu('horti'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'horti'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                  <span>Hortikultura</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100">
                  {certifications.filter(c => c.kategori === 'horti').length}
                </span>
              </button>

              <button
                id="menu-peta"
                onClick={() => { setActiveMenu('peta'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'peta'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Peta Lokasi (GIS)</span>
              </button>

              <button
                id="menu-scan"
                onClick={() => { setActiveMenu('scan'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'scan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                }`}
              >
                <ScanLine className="w-4 h-4 text-indigo-500" />
                <span>Scan QR Code</span>
              </button>

              <button
                id="menu-berita"
                onClick={() => { setActiveMenu('berita'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'berita'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span>Info & Berita</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">
                  {newsList.length}
                </span>
              </button>

              {currentUser && (
                <button
                  id="menu-riwayat"
                  onClick={() => { setActiveMenu('riwayat'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'riwayat'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Riwayat Audit Log</span>
                </button>
              )}

              {currentUser && (
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                  <button
                    id="menu-settings"
                    onClick={() => { setActiveMenu('pengaturan'); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeMenu === 'pengaturan'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900'
                    }`}
                  >
                    <Settings2 className="w-4 h-4 text-neutral-500" />
                    <span>Pengaturan</span>
                  </button>
                </div>
              )}

            </nav>
          </div>

          {/* Sidebar Footer Citation */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 space-y-1 font-sans">
            <p className="font-semibold text-neutral-500">BINE MABELO SULTENG</p>
            <p>BPSB Tanaman Pangan dan Hortikultura Palu, Sulawesi Tengah</p>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE CONTENT */}
        <main id="app-workspace" className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {/* DYNAMIC COMPONENT LOADER BASED ON MENU */}
          
          {/* VIEW: DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <Dashboard 
              onNavigate={handleNavigateFromDashboard}
              certifications={certifications}
              monitoringList={monitoringList}
              cultivars={cultivars}
              notifications={notifications}
              userRole={currentUser ? currentUser.role : 'public'}
              userName={currentUser ? currentUser.name : 'Tamu'}
            />
          )}

          {/* VIEW: TANAMAN PANGAN */}
          {activeMenu === 'pangan' && (
            <div className="space-y-6">
              {/* Tanaman Pangan Category Sub Tabs */}
              <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex space-x-2">
                <button
                  id="tp-sub-sert"
                  onClick={() => setActiveSubTab('sertifikasi')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'sertifikasi' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Sertifikasi Benih
                </button>
                <button
                  id="tp-sub-mon"
                  onClick={() => setActiveSubTab('pengawasan')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'pengawasan' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Pengawasan Peredaran
                </button>
                <button
                  id="tp-sub-cult"
                  onClick={() => setActiveSubTab('kultivar')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'kultivar' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Kultivar Terdaftar
                </button>
              </div>

              {/* Subtab loaders */}
              {activeSubTab === 'sertifikasi' && (
                <SertifikasiManager 
                  category="pangan"
                  certifications={certifications}
                  onAdd={handleAddSertifikasi}
                  onUpdate={handleUpdateSertifikasi}
                  onDelete={handleDeleteSertifikasi}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
              {activeSubTab === 'pengawasan' && (
                <PengawasanManager 
                  category="pangan"
                  monitoringList={monitoringList}
                  onAdd={handleAddMonitoring}
                  onUpdate={handleUpdateMonitoring}
                  onDelete={handleDeleteMonitoring}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
              {activeSubTab === 'kultivar' && (
                <KultivarManager 
                  category="pangan"
                  cultivars={cultivars}
                  onAdd={handleAddCultivar}
                  onUpdate={handleUpdateCultivar}
                  onDelete={handleDeleteCultivar}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
            </div>
          )}

          {/* VIEW: HORTIKULTURA */}
          {activeMenu === 'horti' && (
            <div className="space-y-6">
              {/* Hortikultura Category Sub Tabs */}
              <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex space-x-2">
                <button
                  id="ht-sub-sert"
                  onClick={() => setActiveSubTab('sertifikasi')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'sertifikasi' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Sertifikasi Benih
                </button>
                <button
                  id="ht-sub-mon"
                  onClick={() => setActiveSubTab('pengawasan')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'pengawasan' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Pengawasan Peredaran
                </button>
                <button
                  id="ht-sub-cult"
                  onClick={() => setActiveSubTab('kultivar')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSubTab === 'kultivar' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  Kultivar Terdaftar
                </button>
              </div>

              {/* Subtab loaders */}
              {activeSubTab === 'sertifikasi' && (
                <SertifikasiManager 
                  category="horti"
                  certifications={certifications}
                  onAdd={handleAddSertifikasi}
                  onUpdate={handleUpdateSertifikasi}
                  onDelete={handleDeleteSertifikasi}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
              {activeSubTab === 'pengawasan' && (
                <PengawasanManager 
                  category="horti"
                  monitoringList={monitoringList}
                  onAdd={handleAddMonitoring}
                  onUpdate={handleUpdateMonitoring}
                  onDelete={handleDeleteMonitoring}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
              {activeSubTab === 'kultivar' && (
                <KultivarManager 
                  category="horti"
                  cultivars={cultivars}
                  onAdd={handleAddCultivar}
                  onUpdate={handleUpdateCultivar}
                  onDelete={handleDeleteCultivar}
                  userRole={currentUser ? currentUser.role : 'public'}
                />
              )}
            </div>
          )}

          {/* VIEW: PETA LOKASI */}
          {activeMenu === 'peta' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <span>Sistem Monitoring Berbasis Geospasial</span>
                </h3>
                <p className="text-xs text-neutral-400">Peta interaktif memetakan persebaran produsen benih resmi dan titik audit pengawasan di Sulawesi Tengah secara akurat.</p>
              </div>
              
              <PetaLokasi 
                certifications={certifications}
                monitoringList={monitoringList}
                userRole={currentUser ? currentUser.role : 'public'}
                onSelectItem={(type, id) => {
                  // Action when 'detail' is clicked on the map panel
                  if (type === 'cert') {
                    const found = certifications.find(c => c.id === id);
                    if (found) {
                      setActiveMenu(found.kategori);
                      setActiveSubTab('sertifikasi');
                    }
                  } else {
                    const found = monitoringList.find(m => m.id === id);
                    if (found) {
                      setActiveMenu(found.kategori);
                      setActiveSubTab('pengawasan');
                    }
                  }
                }}
              />
            </div>
          )}

          {/* VIEW: SCAN QR LABEL */}
          {activeMenu === 'scan' && (
            <ScanQR certifications={certifications} />
          )}

          {/* VIEW: INFO BERITA */}
          {activeMenu === 'berita' && (
            <InfoBerita 
              newsList={newsList}
              onAdd={handleAddNews}
              onUpdate={handleUpdateNews}
              onDelete={handleDeleteNews}
              userRole={currentUser ? currentUser.role : 'public'}
            />
          )}

          {/* VIEW: RIWAYAT AUDIT LOG */}
          {activeMenu === 'riwayat' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-2">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  <span>Audit Trail & Riwayat Kegiatan Sistem</span>
                </h3>
                <p className="text-xs text-neutral-400">Menampilkan rekam jejak digital pergerakan database BINE MABELO, pengurusan sertifikat, serta hasil input pengawasan benih.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-neutral-400 uppercase font-mono">Daftar Transaksi Log ({historyLogs.length})</span>
                  {currentUser?.role === 'admin_utama' && (
                    <button
                      id="clear-logs-main"
                      onClick={handleClearLogs}
                      className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                      Bersihkan Semua Riwayat
                    </button>
                  )}
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {historyLogs.map(log => (
                    <div key={log.id} className="pt-4 first:pt-0 space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[11px] text-neutral-400">
                        <span className="font-bold text-emerald-600">{log.user}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-white">{log.action}</h4>
                      <p className="text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-100/50 dark:border-neutral-800 leading-relaxed font-sans">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PENGATURAN */}
          {activeMenu === 'pengaturan' && (
            <Pengaturan 
              currentUser={currentUser}
              usersList={usersList}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              historyLogs={historyLogs}
              onClearLogs={handleClearLogs}
              onOpenSupabaseSync={() => setActiveMenu('supabase')}
            />
          )}

          {/* VIEW: SUPABASE INTEGRATION */}
          {activeMenu === 'supabase' && (
            <SupabaseSync onSyncComplete={forceSyncLocalWithSupabase} />
          )}

        </main>
      </div>

      {/* 4. LOGIN MODAL OVERLAY */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLogin}
        usersList={usersList}
      />

    </div>
  );
}
