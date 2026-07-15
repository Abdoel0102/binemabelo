import React, { useState, useEffect } from 'react';
import { 
  Database, CheckCircle, XCircle, RefreshCw, Copy, Check, Info, Server, Shield, 
  ArrowRight, DownloadCloud, AlertTriangle, Play
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { defaultUsers, initialCertifications, initialMonitoring, initialCultivars, initialNews, initialHistoryLogs } from '../data';
import { mapSertifikasiToDb, mapPengawasanToDb, mapKultivarToDb, mapBeritaToDb, mapHistoryLogToDb, mapUserToDb } from '../lib/supabase';

interface SupabaseSyncProps {
  onSyncComplete?: () => void;
}

export default function SupabaseSync({ onSyncComplete }: SupabaseSyncProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'error' | 'not_configured'>('idle');
  const [errorDetails, setErrorDetails] = useState('');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [tableCounts, setTableCounts] = useState<{
    sertifikasi: number | null;
    pengawasan: number | null;
    kultivar: number | null;
    berita: number | null;
    logs: number | null;
    users: number | null;
  }>({
    sertifikasi: null,
    pengawasan: null,
    kultivar: null,
    berita: null,
    logs: null,
    users: null,
  });

  const checkConnection = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus('not_configured');
      return;
    }

    setStatus('checking');
    setErrorDetails('');
    const logs: string[] = ['Menghubungkan ke Supabase...'];
    setSyncLogs(logs);

    try {
      // 1. Check if we can contact Supabase and query the users table
      const { count: userCount, error: userError } = await supabase
        .from('mabelo_users')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        if (userError.code === '42P01') {
          throw new Error('Tabel database belum dibuat di Supabase. Silakan jalankan script SQL di bawah terlebih dahulu.');
        }
        throw new Error(userError.message);
      }

      // Query other tables to get count
      const { count: sertCount } = await supabase.from('mabelo_sertifikasi').select('*', { count: 'exact', head: true });
      const { count: pengCount } = await supabase.from('mabelo_pengawasan').select('*', { count: 'exact', head: true });
      const { count: kultCount } = await supabase.from('mabelo_kultivar').select('*', { count: 'exact', head: true });
      const { count: newsCount } = await supabase.from('mabelo_berita').select('*', { count: 'exact', head: true });
      const { count: logsCount } = await supabase.from('mabelo_history_logs').select('*', { count: 'exact', head: true });

      setTableCounts({
        users: userCount,
        sertifikasi: sertCount,
        pengawasan: pengCount,
        kultivar: kultCount,
        berita: newsCount,
        logs: logsCount,
      });

      setStatus('connected');
      setSyncLogs(prev => [...prev, 'Koneksi Berhasil! Semua tabel terdeteksi dengan aman.', `Tabel Terdeteksi: mabelo_users (${userCount} data), mabelo_sertifikasi (${sertCount} data)`]);
      if (onSyncComplete) onSyncComplete();
    } catch (err: any) {
      setStatus('error');
      setErrorDetails(err.message || 'Koneksi gagal. Periksa koneksi internet atau status project Supabase Anda.');
      setSyncLogs(prev => [...prev, `Gagal: ${err.message || 'Error tidak dikenal'}`]);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const seedDatabase = async () => {
    if (!supabase) return;
    setIsSeeding(true);
    const logs = ['Memulai pengunggahan data awal (Seeding) ke Supabase...'];
    setSyncLogs(logs);

    try {
      // 1. Seed Users
      logs.push('Mengunggah data mabelo_users...');
      setSyncLogs([...logs]);
      const mappedUsers = defaultUsers.map(mapUserToDb);
      const { error: errUsers } = await supabase.from('mabelo_users').upsert(mappedUsers);
      if (errUsers) throw errUsers;

      // 2. Seed Sertifikasi
      logs.push('Mengunggah data mabelo_sertifikasi...');
      setSyncLogs([...logs]);
      const mappedSert = initialCertifications.map(mapSertifikasiToDb);
      const { error: errSert } = await supabase.from('mabelo_sertifikasi').upsert(mappedSert);
      if (errSert) throw errSert;

      // 3. Seed Pengawasan
      logs.push('Mengunggah data mabelo_pengawasan...');
      setSyncLogs([...logs]);
      const mappedPeng = initialMonitoring.map(mapPengawasanToDb);
      const { error: errPeng } = await supabase.from('mabelo_pengawasan').upsert(mappedPeng);
      if (errPeng) throw errPeng;

      // 4. Seed Kultivar
      logs.push('Mengunggah data mabelo_kultivar...');
      setSyncLogs([...logs]);
      const mappedKult = initialCultivars.map(mapKultivarToDb);
      const { error: errKult } = await supabase.from('mabelo_kultivar').upsert(mappedKult);
      if (errKult) throw errKult;

      // 5. Seed Berita
      logs.push('Mengunggah data mabelo_berita...');
      setSyncLogs([...logs]);
      const mappedBerita = initialNews.map(mapBeritaToDb);
      const { error: errBerita } = await supabase.from('mabelo_berita').upsert(mappedBerita);
      if (errBerita) throw errBerita;

      // 6. Seed Logs
      logs.push('Mengunggah data mabelo_history_logs...');
      setSyncLogs([...logs]);
      const mappedLogs = initialHistoryLogs.map(mapHistoryLogToDb);
      const { error: errLogs } = await supabase.from('mabelo_history_logs').upsert(mappedLogs);
      if (errLogs) throw errLogs;

      logs.push('🎉 Seeding Selesai! Semua data bawaan berhasil diunggah ke Supabase.');
      setSyncLogs([...logs]);
      
      // Re-trigger count check
      await checkConnection();
    } catch (err: any) {
      logs.push(`❌ Gagal Seeding: ${err.message || 'Error'}`);
      setSyncLogs([...logs]);
      alert('Seeding Gagal: ' + (err.message || 'Error'));
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div id="supabase-sync-panel" className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-6">
      
      {/* Branding and Title */}
      <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100/50">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-800 dark:text-neutral-100 font-sans">
              Integrasi Backend Supabase
            </h3>
            <span className="text-[9px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-100/50 uppercase tracking-wider">
              PostgreSQL
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Koneksi real-time untuk sinkronisasi data sertifikasi, pengawasan, dan log kegiatan langsung ke cloud database Supabase.
          </p>
        </div>

        <button
          id="recheck-connection-btn"
          onClick={checkConnection}
          disabled={status === 'checking'}
          className="p-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-850 dark:hover:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer transition-colors flex items-center space-x-1.5 text-xs font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status === 'checking' ? 'animate-spin' : ''}`} />
          <span>Segarkan</span>
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Side: Status display */}
        <div className="md:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-850/40 border border-neutral-100 dark:border-neutral-800/80 space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status Koneksi</span>
            
            {status === 'not_configured' && (
              <div className="flex items-start space-x-3 text-amber-600">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm">Belum Dikonfigurasi</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Kredensial Supabase .env belum terdeteksi. Silakan periksa kembali konfigurasi server Anda.</p>
                </div>
              </div>
            )}

            {status === 'checking' && (
              <div className="flex items-start space-x-3 text-emerald-600">
                <RefreshCw className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
                <div>
                  <h4 className="font-extrabold text-sm">Menghubungkan...</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Mencoba melakukan ping dan membaca struktur tabel mabelo_ di Supabase...</p>
                </div>
              </div>
            )}

            {status === 'connected' && (
              <div className="flex items-start space-x-3 text-emerald-600">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm">Terhubung (Aktif)</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Sistem tersinkronisasi 100% dengan database cloud Supabase Anda.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start space-x-3 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm">Masalah Koneksi / Tabel</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">{errorDetails}</p>
                </div>
              </div>
            )}
          </div>

          {/* Table Counts */}
          {status === 'connected' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800 text-[11px] space-y-2">
              <div className="flex items-center justify-between font-bold text-neutral-400 pb-1.5 border-b border-neutral-50 dark:border-neutral-800">
                <span>TABEL DATABASE</span>
                <span>DATA</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Sertifikasi:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.sertifikasi ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengawasan:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.pengawasan ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kultivar:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.kultivar ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Berita:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.berita ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Logs:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.logs ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="font-mono font-bold text-emerald-600">{tableCounts.users ?? 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Connection parameters info */}
          <div className="text-[10px] text-neutral-400 space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between">
              <span>Project ID:</span>
              <span className="font-mono font-bold text-neutral-600 dark:text-neutral-300">drenbjdxwoddbwqylfmn</span>
            </div>
            <div className="flex justify-between">
              <span>Host API:</span>
              <span className="font-mono text-neutral-600 dark:text-neutral-300 truncate max-w-[150px]">drenbjdxwoddbwqylfmn.supabase.co</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sync Logs and setup guidance */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div className="bg-neutral-900 text-neutral-200 p-4 rounded-2xl font-mono text-[11px] h-[180px] overflow-y-auto border border-neutral-800 space-y-1">
            <div className="text-emerald-400 font-bold pb-1 flex items-center justify-between border-b border-neutral-800 mb-2">
              <span>🖥️ TERMINAL LOG SISTEM INTEGRASI</span>
              <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">SUPABASE</span>
            </div>
            {syncLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-neutral-500 mr-2">&gt;</span>
                {log}
              </div>
            ))}
            {syncLogs.length === 0 && (
              <div className="text-neutral-500 italic">Menunggu pemicu tindakan... Klik 'Segarkan' atau lakukan seeding.</div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="supabase-seed-btn"
              onClick={seedDatabase}
              disabled={isSeeding || status === 'not_configured'}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-emerald-900/10 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 ${isSeeding ? 'animate-pulse' : ''}`} />
              <span>{isSeeding ? 'Mengunggah Data...' : 'Unggah Data Bawaan (Seeding)'}</span>
            </button>
            
            <div className="text-[10px] text-neutral-400 flex items-center px-1 sm:max-w-[200px] leading-relaxed">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mr-1.5" />
              <span>Gunakan Seeding jika database Supabase Anda masih kosong untuk mengisi data uji coba.</span>
            </div>
          </div>
        </div>

      </div>

      {/* SQL Script copying section */}
      <div className="space-y-3.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-100/50">
          <div className="flex items-start space-x-2 text-xs text-emerald-800 dark:text-emerald-400">
            <Server className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <h4 className="font-extrabold text-sm">Instruksi Inisialisasi SQL di Supabase</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Supabase membutuhkan tabel database agar sinkronisasi berfungsi. Buka <strong>SQL Editor</strong> di dashboard Supabase Anda, buat query baru, paste kode SQL di bawah ini, lalu klik <strong>Run</strong>.
              </p>
            </div>
          </div>
          <button
            id="copy-sql-btn"
            onClick={handleCopySql}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin SQL Schema'}</span>
          </button>
        </div>

        {/* SQL Code block */}
        <div className="relative">
          <pre className="bg-neutral-950 dark:bg-neutral-950/80 text-emerald-400/90 text-[10px] p-4 rounded-2xl border border-neutral-800 overflow-x-auto max-h-[160px] font-mono leading-relaxed select-all">
            {SUPABASE_SQL_SCHEMA}
          </pre>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(to_bottom,transparent,rgba(9,9,11,0.9))] rounded-b-2xl pointer-events-none" />
        </div>
      </div>

    </div>
  );
}
