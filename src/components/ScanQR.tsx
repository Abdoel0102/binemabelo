import React, { useState } from 'react';
import { 
  ScanLine, QrCode, CheckCircle, ShieldAlert, Sparkles, Wheat, Sprout, MapPin, 
  Search, ShieldCheck, X, Camera, RefreshCw, Upload, AlertTriangle
} from 'lucide-react';
import { Sertifikasi } from '../types';

interface ScanQRProps {
  certifications: Sertifikasi[];
}

export default function ScanQR({ certifications }: ScanQRProps) {
  const [scannedLabel, setScannedLabel] = useState('');
  const [scanResult, setScanResult] = useState<Sertifikasi | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  // Get only certified seeds with published status
  const validQrList = certifications.filter(c => c.status === 'Sertifikat Terbit');

  const handleVerify = (label: string) => {
    setScanError('');
    setScanResult(null);

    const found = certifications.find(c => c.labelQrCode.toUpperCase() === label.toUpperCase());
    
    if (found) {
      if (found.status === 'Sertifikat Terbit') {
        setScanResult(found);
      } else {
        setScanError(`Benih ditemukan tetapi sertifikatnya berstatus: ${found.status}. Belum layak edar.`);
      }
    } else {
      setScanError('Label QR Code tidak terdaftar dalam sistem database BINE MABELO. Waspada benih ilegal / palsu!');
    }
  };

  const startMockScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError('');

    // Simulate 2 seconds camera scanning delay
    setTimeout(() => {
      setIsScanning(false);
      // Auto pick a random valid certificate label for simulation
      if (validQrList.length > 0) {
        const randCert = validQrList[Math.floor(Math.random() * validQrList.length)];
        setScannedLabel(randCert.labelQrCode);
        handleVerify(randCert.labelQrCode);
      } else {
        setScanError('Tidak ada data benih bersertifikat di database untuk disimulasikan.');
      }
    }, 2000);
  };

  return (
    <div id="scan-qr-container" className="space-y-6">
      
      {/* Header Info */}
      <div>
        <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-emerald-600" />
          <span>Verifikasi Sertifikat Berbasis QR Code</span>
        </h3>
        <p className="text-xs text-neutral-400">Pindai kode QR pada label biru kemasan benih untuk memvalidasi keaslian, kadar air, kemurnian, dan daya tumbuh benih.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Mock Scanner Frame */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl overflow-hidden relative p-6 flex flex-col items-center justify-center min-h-[350px]">
          
          {/* Scanning frame design */}
          <div className="relative w-64 h-64 border-2 border-dashed border-neutral-700 rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-neutral-950/70">
            
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-emerald-500"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-emerald-500"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-emerald-500"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-emerald-500"></div>

            {isScanning ? (
              <>
                {/* Rolling Green Scan Line */}
                <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-bounce"></div>
                <div className="text-center space-y-2 animate-pulse">
                  <Camera className="w-8 h-8 text-emerald-400 mx-auto animate-spin" />
                  <p className="text-xs font-semibold text-emerald-400">Menghubungkan Sensor GPS & Kamera...</p>
                </div>
              </>
            ) : scanResult ? (
              <div className="text-center space-y-2 p-4">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-black text-emerald-400 tracking-wider">PEMINDAIAN BERHASIL</h4>
                <p className="text-[10px] text-neutral-400 font-mono">{scanResult.labelQrCode}</p>
              </div>
            ) : scanError ? (
              <div className="text-center space-y-2 p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <h4 className="text-xs font-black text-red-400 tracking-wider">LABEL TIDAK VALID</h4>
              </div>
            ) : (
              <div className="text-center space-y-3 p-4">
                <QrCode className="w-16 h-16 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">Arahkan kamera ke label kemasan berlogo BINE MABELO</p>
              </div>
            )}
          </div>

          {/* Action trigger button */}
          <button
            id="start-scan-btn"
            disabled={isScanning}
            onClick={startMockScan}
            className="w-full max-w-xs mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>{isScanning ? 'Memindai...' : 'Simulasi Scan Kamera'}</span>
          </button>
        </div>

        {/* Right Side: Verification Output & Manual Lookup */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Manual Input Tool */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Pencarian / Input Label Kode Manual</h4>
            <p className="text-xs text-neutral-400">Tidak dapat menggunakan kamera? Pilih kode label terbit di bawah ini atau ketikkan kode untuk verifikasi instan.</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                id="select-qr-label"
                value={scannedLabel}
                onChange={(e) => {
                  setScannedLabel(e.target.value);
                  handleVerify(e.target.value);
                }}
                className="flex-1 px-3 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
              >
                <option value="">-- Pilih Contoh Label QR Terbit --</option>
                {validQrList.map(c => (
                  <option key={c.id} value={c.labelQrCode}>{c.namaProdusen} - {c.komoditas} ({c.labelQrCode})</option>
                ))}
              </select>

              <div className="flex gap-1.5">
                <input
                  id="typed-qr-label"
                  type="text"
                  placeholder="Atau ketik e.g. BINE-TP-PADI..."
                  value={scannedLabel}
                  onChange={(e) => setScannedLabel(e.target.value)}
                  className="px-3 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white min-w-[150px]"
                />
                <button
                  id="verify-qr-btn"
                  onClick={() => handleVerify(scannedLabel)}
                  className="bg-neutral-900 dark:bg-neutral-850 hover:bg-neutral-850 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Verifikasi
                </button>
              </div>
            </div>
          </div>

          {/* Verification Result Sheet Card */}
          {scanResult ? (
            <div id="qr-result-card" className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/30 rounded-3xl p-6 space-y-4 animate-fade-in text-neutral-800 dark:text-neutral-100">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-xl text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">HASIL VERIFIKASI RESMI</span>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">BENIH ASLI & BERSERTIFIKAT</h4>
                  </div>
                </div>
                <button 
                  id="reset-scan-btn"
                  onClick={() => {
                    setScanResult(null);
                    setScannedLabel('');
                  }}
                  className="text-neutral-400 hover:text-neutral-600 text-xs font-bold cursor-pointer"
                >
                  Mulai Baru
                </button>
              </div>

              {/* Validation specs sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-emerald-500/10 py-4 text-xs">
                
                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Produsen Terdaftar</span>
                  <p className="font-extrabold text-neutral-850 dark:text-white">{scanResult.namaProdusen}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">No. Sertifikat Kelayakan</span>
                  <p className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{scanResult.noSertifikat}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Komoditas / Varietas</span>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    {scanResult.kategori === 'pangan' ? <Wheat className="w-3.5 h-3.5 text-amber-500" /> : <Sprout className="w-3.5 h-3.5 text-emerald-500" />}
                    {scanResult.komoditas} ({scanResult.varietas})
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Lokasi Penangkaran</span>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">Kabupaten {scanResult.kabupaten}, Sulteng</p>
                </div>

                <div className="col-span-full border-t border-dashed border-emerald-500/10 pt-2.5">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-2">Parameter Hasil Pengujian Laboratorium Mutu</span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-xl text-center border border-emerald-100 dark:border-neutral-850">
                      <span className="text-[9px] text-neutral-400 block font-semibold">Kadar Air</span>
                      <span className="text-sm font-black text-emerald-600 mt-0.5 block">{scanResult.kadarAir}%</span>
                      <span className="text-[8px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full mt-1 inline-block">Maks 13.0%</span>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-xl text-center border border-emerald-100 dark:border-neutral-850">
                      <span className="text-[9px] text-neutral-400 block font-semibold">Kemurnian</span>
                      <span className="text-sm font-black text-emerald-600 mt-0.5 block">{scanResult.kemurnian}%</span>
                      <span className="text-[8px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full mt-1 inline-block">Min 98.0%</span>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-xl text-center border border-emerald-100 dark:border-neutral-800">
                      <span className="text-[9px] text-neutral-400 block font-semibold">Daya Tumbuh</span>
                      <span className="text-sm font-black text-emerald-600 mt-0.5 block">{scanResult.dayaTumbuh}%</span>
                      <span className="text-[8px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full mt-1 inline-block">Min 80.0%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Geo-Tracking Link */}
              <div className="bg-white dark:bg-neutral-900 p-3.5 rounded-xl flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 text-neutral-500">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>GPS: {scanResult.latitude}, {scanResult.longitude}</span>
                </span>
                <a
                  href={`https://maps.google.com/?q=${scanResult.latitude},${scanResult.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-bold"
                >
                  Lihat Peta Lokasi &rarr;
                </a>
              </div>

            </div>
          ) : scanError ? (
            <div id="qr-error-card" className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500/20 rounded-3xl p-6 text-center space-y-3 animate-fade-in text-neutral-800 dark:text-neutral-100">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
              <h4 className="text-sm font-black text-red-600 dark:text-red-400 tracking-wider">VERIFIKASI GAGAL / COCOK TIDAK DITEMUKAN</h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {scanError}
              </p>
              <div className="pt-2">
                <button
                  id="reset-scan-error"
                  onClick={() => {
                    setScanError('');
                    setScannedLabel('');
                  }}
                  className="bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Coba Kode Lain
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-neutral-300 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-500">Sertifikat Siap Dimuat</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">Pindai label kemasan menggunakan simulator kamera di sebelah kiri untuk menampilkan lembar spesifikasi mutu benih dari BPSBTPH Sulteng.</p>
            </div>
          )}

        </div>

      </div>
      
    </div>
  );
}
