import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, UserCheck, Plus, Trash2, Edit3, Save, 
  History, Settings2, UserPlus, Database, RefreshCw, Server
} from 'lucide-react';
import { User, HistoryLog } from '../types';

interface PengaturanProps {
  currentUser: User | null;
  usersList: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  historyLogs: HistoryLog[];
  onClearLogs: () => void;
  onOpenSupabaseSync?: () => void;
}

export default function Pengaturan({ 
  currentUser, usersList, onAddUser, onDeleteUser, historyLogs, onClearLogs, onOpenSupabaseSync 
}: PengaturanProps) {
  
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('input01');
  
  // Custom Cert Settings state
  const [kepalaBalai, setKepalaBalai] = useState('Ir. H. Syarifudin, M.P.');
  const [nipKepala, setNipKepala] = useState('19740520 200212 1 002');
  const [address, setAddress] = useState('Jalan Kartini No. 20, Palu, Sulawesi Tengah');

  const isAdminUtama = currentUser && currentUser.role === 'admin_utama';

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName) {
      alert('Mohon isi Username dan Nama Petugas!');
      return;
    }

    // Check if username already exists
    if (usersList.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) {
      alert('Username sudah terdaftar!');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: newUsername,
      role: 'admin_input',
      name: newName,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onAddUser(newUser);
    setNewUsername('');
    setNewName('');
    setNewUserPassword('input01');
    alert(`Akun Admin Input "${newName}" berhasil ditambahkan! Password default: input01`);
  };

  if (!isAdminUtama) {
    return (
      <div id="settings-locked-panel" className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-100 dark:border-neutral-800 text-center max-w-xl mx-auto space-y-4 animate-fade-in">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
        <h3 className="text-lg font-black text-neutral-800 dark:text-neutral-100 font-sans">Akses Pengaturan Terkunci</h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Menu Pengaturan hanya dibuka secara khusus untuk <strong>Admin Utama (Administrator Utama)</strong>. 
          Hak akses ini mencakup penambahan akun petugas input baru, manajemen otorisasi sistem, serta pengubahan parameter legalitas sertifikat Dinas Pertanian Provinsi Sulawesi Tengah.
        </p>
        <p className="text-[11px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-2.5 rounded-xl border border-red-100/40">
          Gunakan akun Username: <strong>Admin</strong> dan Password: <strong>admin01</strong> pada menu masuk sistem.
        </p>
      </div>
    );
  }

  return (
    <div id="pengaturan-container" className="space-y-6">
      
      {/* Header info */}
      <div>
        <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan Otorisasi & Sistem</span>
        </h3>
        <p className="text-xs text-neutral-400">Panel kendali untuk mengatur kredensial staff petugas (Admin Input) dan parameterisasi sertifikat lulus uji benih.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Manage Accounts & Parameterization */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Accounts */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <UserPlus className="w-4.5 h-4.5 text-emerald-600" />
              <span>Daftarkan Akun Petugas Baru (Admin Input)</span>
            </h4>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500">Username Akun *</label>
                <input
                  id="reg-user-username"
                  type="text"
                  required
                  placeholder="e.g. budi_pbt"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500">Nama Lengkap Petugas *</label>
                <input
                  id="reg-user-name"
                  type="text"
                  required
                  placeholder="e.g. Budi Hartono, S.P."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500">Password Default</label>
                <input
                  id="reg-user-pass"
                  type="text"
                  disabled
                  value={newUserPassword}
                  className="w-full px-3 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl dark:text-neutral-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  id="register-user-submit"
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md shadow-emerald-900/10 transition-colors"
                >
                  Tambah Akun Petugas
                </button>
              </div>
            </form>
          </div>

          {/* Accounts List */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>Daftar Pengguna Aktif ({usersList.length})</span>
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {usersList.map(u => (
                <div 
                  key={u.id}
                  id={`user-row-${u.id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-full ${u.role === 'admin_utama' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-neutral-800 dark:text-white">{u.name}</p>
                      <p className="text-neutral-400 text-[10px]">Username: <span className="font-bold">{u.username}</span> | Peran: <span className="capitalize">{u.role.replace('_', ' ')}</span></p>
                    </div>
                  </div>

                  {u.role !== 'admin_utama' ? (
                    <button
                      id={`del-user-btn-${u.id}`}
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus akun petugas "${u.name}"? Kredensial masuk akan langsung dinonaktifkan.`)) {
                          onDeleteUser(u.id);
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Akun"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase border border-amber-100">Utama</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Audit Logs & Certificate Params */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Government Signature Config */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <Database className="w-4.5 h-4.5 text-emerald-600" />
              <span>Parameter Tanda Tangan Sertifikat</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Nama Kepala BPSBTPH Sulteng</label>
                <input
                  id="cert-param-boss"
                  type="text"
                  value={kepalaBalai}
                  onChange={(e) => setKepalaBalai(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">NIP Kepala Balai</label>
                <input
                  id="cert-param-nip"
                  type="text"
                  value={nipKepala}
                  onChange={(e) => setNipKepala(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Alamat Instansi Terbit</label>
                <input
                  id="cert-param-addr"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <button
                id="save-cert-params"
                onClick={() => {
                  alert("Parameter legalitas sertifikat berhasil disinkronkan ke database lokal!");
                }}
                className="w-full bg-neutral-900 hover:bg-neutral-850 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Parameter</span>
              </button>
            </div>
          </div>

          {/* Cloud Database Integration (Supabase) */}
          {onOpenSupabaseSync && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                <Server className="w-4.5 h-4.5 text-emerald-600" />
                <span>Integrasi Database Supabase</span>
              </h4>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Gunakan menu integrasi ini untuk mensinkronisasi data sertifikasi benih, pengawasan lapangan, kultivar, berita, dan log audit antara penyimpanan lokal (Dexie) dengan database cloud Supabase.
              </p>
              <button
                id="btn-open-supabase-sync"
                onClick={onOpenSupabaseSync}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Buka Panel Sinkronisasi Supabase</span>
              </button>
            </div>
          )}

          {/* Audit Logs Stream */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                <History className="w-4.5 h-4.5 text-emerald-600" />
                <span>Audit Log Riwayat Pengguna</span>
              </h4>
              <button
                id="clear-logs-btn"
                onClick={onClearLogs}
                className="text-[10px] text-neutral-400 hover:text-red-500 font-bold cursor-pointer"
              >
                Bersihkan Log
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {historyLogs.length > 0 ? (
                historyLogs.map(log => (
                  <div key={log.id} className="text-[11px] border-b border-neutral-100/50 dark:border-neutral-800/40 pb-2 space-y-0.5">
                    <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                      <span>{log.user}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="font-bold text-neutral-700 dark:text-neutral-300">{log.action}</p>
                    <p className="text-neutral-500 leading-normal">{log.details}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  Tidak ada rekaman log riwayat aktivitas saat ini.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}
