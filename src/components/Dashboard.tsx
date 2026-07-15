import React from 'react';
import { 
  Users, Award, Wheat, Sprout, MapPin, ScanLine, FileText, Bell, ShieldCheck, 
  ChevronRight, ArrowUpRight, TrendingUp, HelpCircle 
} from 'lucide-react';
import { Sertifikasi, Pengawasan, Kultivar } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  certifications: Sertifikasi[];
  monitoringList: Pengawasan[];
  cultivars: Kultivar[];
  notifications: any[];
  userRole: string;
  userName: string;
}

export default function Dashboard({ 
  onNavigate, certifications, monitoringList, cultivars, notifications, userRole, userName 
}: DashboardProps) {

  // Metrics calculations
  const totalCertificates = certifications.filter(c => c.status === 'Sertifikat Terbit').length;
  const pendingCertificates = certifications.filter(c => c.status !== 'Sertifikat Terbit' && c.status !== 'Ditolak').length;
  const totalMonitoringPoints = monitoringList.length;
  const warningMonitoringPoints = monitoringList.filter(m => m.statusKelayakan !== 'Layak Edar').length;

  // Commodity distribution for chart
  const commodityStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    certifications.forEach(c => {
      stats[c.komoditas] = (stats[c.komoditas] || 0) + (c.perkiraanProduksi || 0);
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [certifications]);

  const maxChartValue = Math.max(...commodityStats.map(s => s.value), 1);

  return (
    <div id="dashboard-wrapper" className="space-y-6">
      
      {/* Welcome Hero Panel */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide border border-emerald-500/30">
            Sistem Informasi Terintegrasi BPSBTPH Sulteng
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">
            Selamat datang, {userName}
          </h2>
          <p className="text-emerald-100 text-sm md:text-base font-sans leading-relaxed">
            Anda masuk sebagai <strong className="text-white capitalize">{userRole.replace('_', ' ')}</strong>. BINE MABELO mempermudah proses sertifikasi mandiri, pelaporan pengawasan peredaran benih, serta pemetaan geospasial di Provinsi Sulawesi Tengah.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              id="dash-action-sertifikasi"
              onClick={() => onNavigate('pangan')}
              className="bg-white hover:bg-neutral-50 text-emerald-900 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/10 cursor-pointer transition-all"
            >
              <span>Mulai Sertifikasi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="dash-action-scan"
              onClick={() => onNavigate('scan')}
              className="bg-emerald-700/60 hover:bg-emerald-700/80 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer transition-all"
            >
              <ScanLine className="w-4 h-4 text-emerald-300" />
              <span>Pindai Label QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Data (Stats Grid) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 font-sans">
          Ringkasan Data Utama (Tahun Ini)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Produsen Terdaftar Card */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400">Produsen Terdaftar</p>
              <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100">128</h4>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +14 produsen baru
              </p>
            </div>
          </div>

          {/* Benih Bersertifikat Card */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400">Benih Bersertifikat</p>
              <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100">1.256 ton</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">Sertifikasi Lulus Lab</p>
            </div>
          </div>

          {/* Pengajuan Baru Card */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400">Proses Sertifikasi</p>
              <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100">{pendingCertificates} Komoditi</h4>
              <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                {certifications.filter(c => c.status === 'Pengajuan').length} antrean baru
              </p>
            </div>
          </div>

          {/* Pengawasan Lapangan Card */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-400">Titik Pengawasan</p>
              <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100">{totalMonitoringPoints} Toko</h4>
              <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                {warningMonitoringPoints} butuh atensi
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Data Visualization & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commodity Chart Box */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 font-sans">
                Estimasi Produksi Benih per Komoditas
              </h4>
              <p className="text-xs text-neutral-400">Berdasarkan data sertifikasi terbit & proses uji lab</p>
            </div>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
              Total: {certifications.reduce((acc, curr) => acc + (curr.perkiraanProduksi || 0), 0).toFixed(1)} Ton
            </span>
          </div>

          {/* Interactive Custom SVG Horizontal Bar Chart */}
          <div className="space-y-4 pt-2">
            {commodityStats.map((stat, i) => {
              const pct = (stat.value / maxChartValue) * 100;
              return (
                <div key={stat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      {stat.name.includes('Bawang') ? (
                        <Sprout className="w-3.5 h-3.5 text-violet-500" />
                      ) : stat.name.includes('Padi') ? (
                        <Wheat className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {stat.name}
                    </span>
                    <span className="font-mono text-neutral-500">{stat.value.toFixed(1)} Ton</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        i % 3 === 0 
                          ? 'bg-emerald-600' 
                          : i % 3 === 1 
                          ? 'bg-amber-500' 
                          : 'bg-violet-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3.5 rounded-xl text-xs text-neutral-500 leading-relaxed border border-neutral-100 dark:border-neutral-800/70">
            <strong>Catatan Logistik Benih:</strong> Bawang Merah Lembah Palu dan Padi Sawah Inpari 32 menempati volume penangkaran tertinggi di Sulawesi Tengah, terpusat di wilayah Sigi, Parigi Moutong, dan Donggala untuk menjamin ketahanan pangan daerah.
          </div>
        </div>

        {/* Recent Notifications / Kegiatan Stream */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Notifikasi & Aktivitas</span>
            </h4>
            <button 
              id="dash-notif-all"
              onClick={() => onNavigate('riwayat')}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold cursor-pointer"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="flex items-start space-x-3 text-xs p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  notif.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' 
                    : notif.type === 'warning' 
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600' 
                    : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate">{notif.title}</p>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-snug">{notif.description}</p>
                  <span className="text-[10px] text-neutral-400 block pt-0.5">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Navigation Shortcut Hub (Menu Utama Portal) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-sans">
          Akses Cepat Fitur Utama
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <button
            id="sh-pangan"
            onClick={() => onNavigate('pangan')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <Wheat className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Tanaman Pangan</h4>
            <p className="text-[10px] text-neutral-400">Padi, Jagung, dll</p>
          </button>

          <button
            id="sh-horti"
            onClick={() => onNavigate('horti')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <Sprout className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Hortikultura</h4>
            <p className="text-[10px] text-neutral-400">Bawang, Durian, dll</p>
          </button>

          <button
            id="sh-peta"
            onClick={() => onNavigate('peta')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <MapPin className="w-8 h-8 text-rose-500 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Peta Lokasi</h4>
            <p className="text-[10px] text-neutral-400">GIS & Tracking</p>
          </button>

          <button
            id="sh-scan"
            onClick={() => onNavigate('scan')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <ScanLine className="w-8 h-8 text-indigo-500 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Scan QR Label</h4>
            <p className="text-[10px] text-neutral-400">Verifikasi Mutu</p>
          </button>

          <button
            id="sh-info"
            onClick={() => onNavigate('berita')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <FileText className="w-8 h-8 text-sky-500 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Info & Berita</h4>
            <p className="text-[10px] text-neutral-400">Regulasi & Tips</p>
          </button>

          <button
            id="sh-riwayat"
            onClick={() => onNavigate('riwayat')}
            className="bg-white dark:bg-neutral-900 hover:border-emerald-500 hover:shadow-md border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl text-center space-y-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Audit Riwayat</h4>
            <p className="text-[10px] text-neutral-400">Log Aktivitas</p>
          </button>

        </div>
      </div>
      
    </div>
  );
}
