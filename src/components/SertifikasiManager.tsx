import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Wheat, Sprout, CheckCircle2, AlertTriangle, AlertCircle, 
  Trash2, Edit3, Eye, Printer, ShieldAlert, Check, MapPin, QrCode
} from 'lucide-react';
import { Sertifikasi, SeedCategory } from '../types';
import { SULTENG_KABUPATEN, DISTRICT_COORDS } from '../data';

interface SertifikasiManagerProps {
  category: SeedCategory;
  certifications: Sertifikasi[];
  onAdd: (data: Sertifikasi) => void;
  onUpdate: (data: Sertifikasi) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

export default function SertifikasiManager({ 
  category, certifications, onAdd, onUpdate, onDelete, userRole 
}: SertifikasiManagerProps) {
  const [search, setSearch] = useState('');
  const [filterKabupaten, setFilterKabupaten] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // Modals / Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCertViewOpen, setIsCertViewOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Sertifikasi | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  // Form Fields
  const [id, setId] = useState('');
  const [namaProdusen, setNamaProdusen] = useState('');
  const [komoditas, setKomoditas] = useState('');
  const [varietas, setVarietas] = useState('');
  const [luasLahan, setLuasLahan] = useState('');
  const [perkiraanProduksi, setPerkiraanProduksi] = useState('');
  const [status, setStatus] = useState<'Pengajuan' | 'Pemeriksaan Lapangan' | 'Pengujian Laboratorium' | 'Sertifikat Terbit' | 'Ditolak'>('Pengajuan');
  const [kabupaten, setKabupaten] = useState('Palu');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [kadarAir, setKadarAir] = useState('');
  const [kemurnian, setKemurnian] = useState('');
  const [dayaTumbuh, setDayaTumbuh] = useState('');

  const isReadOnly = userRole === 'public';

  // Filtered certifications
  const filteredCerts = certifications.filter(cert => {
    if (cert.kategori !== category) return false;
    
    const matchesSearch = cert.namaProdusen.toLowerCase().includes(search.toLowerCase()) ||
                          cert.varietas.toLowerCase().includes(search.toLowerCase()) ||
                          cert.komoditas.toLowerCase().includes(search.toLowerCase()) ||
                          cert.noSertifikat.toLowerCase().includes(search.toLowerCase());
                          
    const matchesKabupaten = filterKabupaten === 'Semua' || cert.kabupaten === filterKabupaten;
    const matchesStatus = filterStatus === 'Semua' || cert.status === filterStatus;
    
    return matchesSearch && matchesKabupaten && matchesStatus;
  });

  // Handler for opening add form
  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setFormMode('add');
    setId('');
    setNamaProdusen('');
    setKomoditas(category === 'pangan' ? 'Padi Sawah' : 'Bawang Merah');
    setVarietas('');
    setLuasLahan('');
    setPerkiraanProduksi('');
    setStatus('Pengajuan');
    setKabupaten('Palu');
    setLatitude(DISTRICT_COORDS['Palu'].lat.toString());
    setLongitude(DISTRICT_COORDS['Palu'].lng.toString());
    setKadarAir('');
    setKemurnian('');
    setDayaTumbuh('');
    setIsFormOpen(true);
  };

  // Handler for opening edit form
  const handleOpenEdit = (cert: Sertifikasi) => {
    if (isReadOnly) return;
    setFormMode('edit');
    setId(cert.id);
    setNamaProdusen(cert.namaProdusen);
    setKomoditas(cert.komoditas);
    setVarietas(cert.varietas);
    setLuasLahan(cert.luasLahan.toString());
    setPerkiraanProduksi(cert.perkiraanProduksi.toString());
    setStatus(cert.status);
    setKabupaten(cert.kabupaten);
    setLatitude(cert.latitude.toString());
    setLongitude(cert.longitude.toString());
    setKadarAir(cert.kadarAir?.toString() || '');
    setKemurnian(cert.kemurnian?.toString() || '');
    setDayaTumbuh(cert.dayaTumbuh?.toString() || '');
    setIsFormOpen(true);
  };

  // Update Coordinates when Kabupaten is selected in form
  const handleKabupatenChange = (kab: string) => {
    setKabupaten(kab);
    if (DISTRICT_COORDS[kab]) {
      setLatitude(DISTRICT_COORDS[kab].lat.toString());
      setLongitude(DISTRICT_COORDS[kab].lng.toString());
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProdusen || !varietas || !luasLahan || !perkiraanProduksi) {
      alert('Mohon isi semua data yang bertanda bintang (*)!');
      return;
    }

    const certData: Sertifikasi = {
      id: formMode === 'add' ? `cert-${Date.now()}` : id,
      noSertifikat: formMode === 'add' 
        ? `521/${Math.floor(Math.random() * 500) + 100}/Sert-${category === 'pangan' ? 'TP' : 'Horti'}/${new Date().getFullYear()}`
        : certifications.find(c => c.id === id)?.noSertifikat || '',
      kategori: category,
      namaProdusen,
      varietas,
      komoditas,
      luasLahan: parseFloat(luasLahan),
      perkiraanProduksi: parseFloat(perkiraanProduksi),
      status,
      tglPengajuan: formMode === 'add' ? new Date().toISOString().split('T')[0] : certifications.find(c => c.id === id)?.tglPengajuan || '',
      tglTerbit: status === 'Sertifikat Terbit' ? new Date().toISOString().split('T')[0] : undefined,
      kabupaten,
      latitude: parseFloat(latitude) || DISTRICT_COORDS[kabupaten]?.lat || 0,
      longitude: parseFloat(longitude) || DISTRICT_COORDS[kabupaten]?.lng || 0,
      labelQrCode: formMode === 'add' 
        ? `BINE-${category === 'pangan' ? 'TP' : 'HT'}-${komoditas.toUpperCase().replace(/\s+/g, '')}-${varietas.toUpperCase().replace(/\s+/g, '')}-${Math.floor(Math.random() * 900) + 100}`
        : certifications.find(c => c.id === id)?.labelQrCode || '',
      kadarAir: kadarAir ? parseFloat(kadarAir) : undefined,
      kemurnian: kemurnian ? parseFloat(kemurnian) : undefined,
      dayaTumbuh: dayaTumbuh ? parseFloat(dayaTumbuh) : undefined,
    };

    if (formMode === 'add') {
      onAdd(certData);
    } else {
      onUpdate(certData);
    }
    setIsFormOpen(false);
  };

  const handlePrintView = (cert: Sertifikasi) => {
    setSelectedCert(cert);
    setIsCertViewOpen(true);
  };

  return (
    <div id="sertifikasi-manager" className="space-y-6">
      
      {/* Read Only / Public User Warning banner */}
      {isReadOnly && (
        <div id="public-view-banner" className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-2xl flex items-center justify-between border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center space-x-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Mode Akses Publik Terbuka</p>
              <p className="text-neutral-500 dark:text-neutral-400">Anda hanya memiliki izin melihat data (View Only). Untuk menambah, mengubah, atau menghapus berkas sertifikasi silakan login sebagai Admin.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
            {category === 'pangan' ? <Wheat className="w-5 h-5 text-amber-500" /> : <Sprout className="w-5 h-5 text-emerald-500" />}
            <span>Sertifikasi Benih {category === 'pangan' ? 'Tanaman Pangan' : 'Hortikultura'}</span>
          </h3>
          <p className="text-xs text-neutral-400">Sistem registrasi & pengujian laboratorium mutu benih di Sulawesi Tengah</p>
        </div>

        {!isReadOnly && (
          <button
            id="add-sertifikasi-btn"
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan Sertifikasi</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            id="cert-search"
            type="text"
            placeholder="Cari nama produsen, nomor sertifikat, varietas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        {/* Kabupaten Filter */}
        <div className="flex gap-2">
          <select
            id="cert-filter-kab"
            value={filterKabupaten}
            onChange={(e) => setFilterKabupaten(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          >
            <option value="Semua">Semua Kabupaten</option>
            {SULTENG_KABUPATEN.map(kab => (
              <option key={kab} value={kab}>{kab}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="cert-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          >
            <option value="Semua">Semua Status</option>
            <option value="Pengajuan">Pengajuan</option>
            <option value="Pemeriksaan Lapangan">Pemeriksaan Lapangan</option>
            <option value="Pengujian Laboratorium">Pengujian Lab</option>
            <option value="Sertifikat Terbit">Sertifikat Terbit</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCerts.length > 0 ? (
          filteredCerts.map((cert) => (
            <div 
              key={cert.id}
              id={`cert-card-${cert.id}`}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between space-y-4"
            >
              {/* Header card info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    cert.status === 'Sertifikat Terbit'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50'
                      : cert.status === 'Ditolak'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100/50'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100/50'
                  }`}>
                    {cert.status}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {cert.kabupaten}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{cert.namaProdusen}</h4>
                  <p className="text-[11px] text-neutral-400 truncate">{cert.noSertifikat || 'No Sertifikat Belum Terbit'}</p>
                </div>
              </div>

              {/* Middle specs */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Komoditas</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    {category === 'pangan' ? <Wheat className="w-3.5 h-3.5 text-amber-500" /> : <Sprout className="w-3.5 h-3.5 text-emerald-500" />}
                    {cert.komoditas}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Varietas</span>
                  <span className="font-bold text-neutral-800 dark:text-white">{cert.varietas}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Luas Lahan</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cert.luasLahan} Ha</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Est. Produksi</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cert.perkiraanProduksi} Ton</span>
                </div>
              </div>

              {/* Lab test stats if published */}
              {cert.status === 'Sertifikat Terbit' && cert.dayaTumbuh && (
                <div className="flex justify-between text-[11px] px-1 text-emerald-700 dark:text-emerald-400 font-semibold border-t border-dashed border-neutral-100 dark:border-neutral-800 pt-2">
                  <span>Hasil Uji Lab:</span>
                  <span>KA: {cert.kadarAir}% | Murni: {cert.kemurnian}% | Tumbuh: {cert.dayaTumbuh}%</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  id={`print-btn-${cert.id}`}
                  onClick={() => handlePrintView(cert)}
                  className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>

                {!isReadOnly && (
                  <>
                    <button
                      id={`edit-btn-${cert.id}`}
                      onClick={() => handleOpenEdit(cert)}
                      className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 p-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      title="Edit Sertifikasi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {userRole === 'admin_utama' && (
                      <button
                        id={`del-btn-${cert.id}`}
                        onClick={() => {
                          if(confirm(`Yakin ingin menghapus sertifikasi dari ${cert.namaProdusen}?`)) {
                            onDelete(cert.id);
                          }
                        }}
                        className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 p-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-neutral-50 dark:bg-neutral-850 p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
            <Wheat className="w-12 h-12 text-neutral-300 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-500">Berkas Sertifikasi Tidak Ditemukan</h4>
            <p className="text-xs text-neutral-400">Gunakan kata kunci pencarian lain atau klik &ldquo;Ajukan Sertifikasi&rdquo; untuk mendaftarkan produsen baru.</p>
          </div>
        )}
      </div>

      {/* MODAL FORM: ADD / EDIT SERTIFIKASI */}
      {isFormOpen && (
        <div id="cert-form-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {formMode === 'add' ? 'Registrasi Pengajuan Sertifikasi Benih Baru' : 'Ubah Data Sertifikasi Benih'}
              </h4>
              <button 
                id="close-cert-form-btn"
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-emerald-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Produsen */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Nama Produsen / Kelompok Tani *</label>
                  <input
                    id="form-produsen"
                    type="text"
                    required
                    value={namaProdusen}
                    onChange={(e) => setNamaProdusen(e.target.value)}
                    placeholder="Contoh: Kelompok Tani Suka Maju"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Komoditas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Jenis Komoditas *</label>
                  <select
                    id="form-komoditas"
                    value={komoditas}
                    onChange={(e) => setKomoditas(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    {category === 'pangan' ? (
                      <>
                        <option value="Padi Sawah">Padi Sawah</option>
                        <option value="Jagung Hibrida">Jagung Hibrida</option>
                        <option value="Kedelai">Kedelai</option>
                      </>
                    ) : (
                      <>
                        <option value="Bawang Merah">Bawang Merah</option>
                        <option value="Durian">Durian</option>
                        <option value="Cabai Keriting">Cabai Keriting</option>
                        <option value="Mangga">Mangga</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Varietas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Varietas / Kultivar *</label>
                  <input
                    id="form-varietas"
                    type="text"
                    required
                    value={varietas}
                    onChange={(e) => setVarietas(e.target.value)}
                    placeholder="Contoh: Inpari 32 atau Lembah Palu"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Luas Lahan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Luas Lahan (Ha) *</label>
                  <input
                    id="form-luas"
                    type="number"
                    step="0.01"
                    required
                    value={luasLahan}
                    onChange={(e) => setLuasLahan(e.target.value)}
                    placeholder="Contoh: 4.5"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Perkiraan Produksi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Est. Hasil Produksi (Ton) *</label>
                  <input
                    id="form-produksi"
                    type="number"
                    step="0.1"
                    required
                    value={perkiraanProduksi}
                    onChange={(e) => setPerkiraanProduksi(e.target.value)}
                    placeholder="Contoh: 18.2"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Kabupaten */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Wilayah Kabupaten *</label>
                  <select
                    id="form-kabupaten"
                    value={kabupaten}
                    onChange={(e) => handleKabupatenChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    {SULTENG_KABUPATEN.map(kab => (
                      <option key={kab} value={kab}>{kab}</option>
                    ))}
                  </select>
                </div>

                {/* Status Alur */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Status Alur Berkas *</label>
                  <select
                    id="form-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    <option value="Pengajuan">Pengajuan Baru</option>
                    <option value="Pemeriksaan Lapangan">Pemeriksaan Lapangan</option>
                    <option value="Pengujian Laboratorium">Pengujian Laboratorium</option>
                    <option value="Sertifikat Terbit">Sertifikat Terbit</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                {/* GPS Latitude */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Latitude GPS</label>
                  <input
                    id="form-lat"
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="-0.8917"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* GPS Longitude */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Longitude GPS</label>
                  <input
                    id="form-lng"
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="119.8707"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Lab parameters conditionally shown if status === 'Sertifikat Terbit' */}
                {status === 'Sertifikat Terbit' && (
                  <div className="sm:col-span-2 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hasil Pengujian Laboratorium Mutu Benih</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500">Kadar Air (%)</label>
                        <input
                          id="form-kadar-air"
                          type="number"
                          step="0.1"
                          value={kadarAir}
                          onChange={(e) => setKadarAir(e.target.value)}
                          placeholder="e.g. 13.0"
                          className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500">Kemurnian (%)</label>
                        <input
                          id="form-kemurnian"
                          type="number"
                          step="0.1"
                          value={kemurnian}
                          onChange={(e) => setKemurnian(e.target.value)}
                          placeholder="e.g. 99.0"
                          className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500">Daya Tumbuh (%)</label>
                        <input
                          id="form-daya-tumbuh"
                          type="number"
                          step="0.1"
                          value={dayaTumbuh}
                          onChange={(e) => setDayaTumbuh(e.target.value)}
                          placeholder="e.g. 90.0"
                          className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  id="form-cancel-btn"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="form-save-btn"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {formMode === 'add' ? 'Simpan Berkas' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VIEW: PRINT MOCK CERTIFICATE */}
      {isCertViewOpen && selectedCert && (
        <div id="cert-view-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-neutral-800">
            {/* Header Controls */}
            <div className="bg-neutral-900 px-6 py-4 text-white flex justify-between items-center no-print">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pratinjau Dokumen Negara</span>
              <div className="flex gap-2">
                <button
                  id="print-action-btn"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  id="close-cert-view-btn"
                  onClick={() => setIsCertViewOpen(false)}
                  className="bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Certificate Page Frame */}
            <div id="certificate-print-area" className="p-10 border-[16px] border-double border-emerald-900 bg-[#FDFDF7] relative text-center space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Wheat className="w-96 h-96 text-emerald-900" />
              </div>

              {/* Official Seal Header */}
              <div className="border-b-2 border-emerald-900 pb-4 flex flex-col items-center">
                <h2 className="text-sm font-extrabold tracking-widest text-emerald-950">PEMERINTAH PROVINSI SULAWESI TENGAH</h2>
                <h1 className="text-base font-black text-emerald-900">DINAS TANAMAN PANGAN DAN HORTIKULTURA</h1>
                <h3 className="text-xs font-semibold text-neutral-600">BALAI PENGAWASAN DAN SERTIFIKASI BENIH (BPSBTPH)</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">Jalan Kartini No. 20, Palu, Sulawesi Tengah - Telp: (0451) 421012</p>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1.5 py-4">
                <h2 className="text-xl font-serif font-bold text-amber-900 underline">SERTIFIKAT LULUS SERTIFIKASI BENIH</h2>
                <p className="text-xs font-mono font-bold text-neutral-600">Nomor Registrasi: {selectedCert.noSertifikat || 'DALAM_PROSES_MUTU_BPSB'}</p>
              </div>

              {/* Body */}
              <p className="text-xs leading-relaxed max-w-lg mx-auto text-neutral-700">
                Berdasarkan hasil Pemeriksaan Lapangan Pendahuluan, Pemeriksaan Alat Panen, serta Pengujian Sampel Benih di Laboratorium Balai Sertifikasi Benih Sulteng, dengan ini menerangkan bahwa:
              </p>

              {/* Specifics */}
              <div className="max-w-md mx-auto grid grid-cols-12 gap-y-2.5 text-xs text-left border-y border-emerald-900/10 py-5">
                <div className="col-span-5 font-bold text-neutral-500">Nama Produsen</div>
                <div className="col-span-7 font-black text-neutral-800">{selectedCert.namaProdusen}</div>

                <div className="col-span-5 font-bold text-neutral-500">Jenis Komoditas (Varietas)</div>
                <div className="col-span-7 font-semibold text-neutral-800">{selectedCert.komoditas} ({selectedCert.varietas})</div>

                <div className="col-span-5 font-bold text-neutral-500">Lokasi Penangkaran</div>
                <div className="col-span-7 font-semibold text-neutral-800">Kabupaten {selectedCert.kabupaten}, Sulawesi Tengah</div>

                <div className="col-span-5 font-bold text-neutral-500">Luas Lahan / Est. Produksi</div>
                <div className="col-span-7 font-semibold text-neutral-800">{selectedCert.luasLahan} Hektar / {selectedCert.perkiraanProduksi} Ton</div>

                <div className="col-span-12 border-t border-dashed border-emerald-900/10 my-1"></div>

                <div className="col-span-5 font-bold text-neutral-500">Status Kelayakan Label</div>
                <div className="col-span-7 text-emerald-800 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Memenuhi Standar Mutu Kelas Benih Sebar (Berlabel Biru)</span>
                </div>

                {selectedCert.dayaTumbuh && (
                  <>
                    <div className="col-span-5 font-bold text-neutral-500">Parameter Uji Lab</div>
                    <div className="col-span-7 font-mono bg-emerald-50 text-emerald-800 p-2 rounded text-[11px] font-bold">
                      Kadar Air: {selectedCert.kadarAir}% | Kemurnian: {selectedCert.kemurnian}% | Daya Tumbuh: {selectedCert.dayaTumbuh}%
                    </div>
                  </>
                )}
              </div>

              {/* QR and Signatures */}
              <div className="grid grid-cols-2 pt-6 max-w-md mx-auto items-center">
                <div className="flex flex-col items-center">
                  <div className="p-2.5 bg-white border-2 border-emerald-900/35 rounded-xl shadow-xs flex flex-col items-center">
                    <QrCode className="w-20 h-20 text-neutral-800" />
                    <span className="text-[9px] font-mono mt-1 text-neutral-500">{selectedCert.labelQrCode}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1">Pindai untuk Verifikasi Keaslian</span>
                </div>

                <div className="text-right space-y-12">
                  <div className="space-y-0.5 text-xs text-right">
                    <p className="text-neutral-500">Ditetapkan di: Palu, Sulteng</p>
                    <p className="text-neutral-500">Tanggal: {selectedCert.tglTerbit || selectedCert.tglPengajuan}</p>
                    <p className="font-bold text-neutral-700">Kepala Balai Pengawasan Benih,</p>
                  </div>

                  <div className="space-y-0.5 text-xs text-right">
                    <p className="font-extrabold text-neutral-850 underline">Ir. H. Syarifudin, M.P.</p>
                    <p className="text-[10px] text-neutral-400">NIP. 19740520 200212 1 002</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
