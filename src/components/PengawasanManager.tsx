import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Wheat, Sprout, ShieldAlert, CheckCircle2, AlertTriangle, 
  AlertCircle, Trash2, Edit3, MapPin, Eye, FileSpreadsheet, ShieldCheck
} from 'lucide-react';
import { Pengawasan, SeedCategory } from '../types';
import { SULTENG_KABUPATEN, DISTRICT_COORDS } from '../data';

interface PengawasanManagerProps {
  category: SeedCategory;
  monitoringList: Pengawasan[];
  onAdd: (data: Pengawasan) => void;
  onUpdate: (data: Pengawasan) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

export default function PengawasanManager({
  category, monitoringList, onAdd, onUpdate, onDelete, userRole
}: PengawasanManagerProps) {
  const [search, setSearch] = useState('');
  const [filterKabupaten, setFilterKabupaten] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMon, setSelectedMon] = useState<Pengawasan | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Form Fields
  const [id, setId] = useState('');
  const [namaPengecer, setNamaPengecer] = useState('');
  const [komoditas, setKomoditas] = useState('');
  const [varietas, setVarietas] = useState('');
  const [noLot, setNoLot] = useState('');
  const [statusKelayakan, setStatusKelayakan] = useState<'Layak Edar' | 'Dalam Pengawasan' | 'Dilarang Edar'>('Layak Edar');
  const [petugas, setPetugas] = useState('');
  const [kadarAir, setKadarAir] = useState('');
  const [kemurnian, setKemurnian] = useState('');
  const [dayaTumbuh, setDayaTumbuh] = useState('');
  const [catatan, setCatatan] = useState('');
  const [kabupaten, setKabupaten] = useState('Palu');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const isReadOnly = userRole === 'public';

  const filteredList = monitoringList.filter(mon => {
    if (mon.kategori !== category) return false;

    const matchesSearch = mon.namaPengecer.toLowerCase().includes(search.toLowerCase()) ||
                          mon.varietas.toLowerCase().includes(search.toLowerCase()) ||
                          mon.komoditas.toLowerCase().includes(search.toLowerCase()) ||
                          mon.noLot.toLowerCase().includes(search.toLowerCase()) ||
                          mon.petugas.toLowerCase().includes(search.toLowerCase());

    const matchesKabupaten = filterKabupaten === 'Semua' || mon.kabupaten === filterKabupaten;
    const matchesStatus = filterStatus === 'Semua' || mon.statusKelayakan === filterStatus;

    return matchesSearch && matchesKabupaten && matchesStatus;
  });

  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setFormMode('add');
    setId('');
    setNamaPengecer('');
    setKomoditas(category === 'pangan' ? 'Padi Sawah' : 'Bawang Merah');
    setVarietas('');
    setNoLot(`LOT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
    setStatusKelayakan('Layak Edar');
    setPetugas(userRole === 'admin_utama' ? 'Ir. H. Syarifudin, M.P.' : 'Nurhaeni, S.P.');
    setKadarAir('');
    setKemurnian('');
    setDayaTumbuh('');
    setCatatan('');
    setKabupaten('Palu');
    setLatitude(DISTRICT_COORDS['Palu'].lat.toString());
    setLongitude(DISTRICT_COORDS['Palu'].lng.toString());
    setIsFormOpen(true);
  };

  const handleOpenEdit = (mon: Pengawasan) => {
    if (isReadOnly) return;
    setFormMode('edit');
    setId(mon.id);
    setNamaPengecer(mon.namaPengecer);
    setKomoditas(mon.komoditas);
    setVarietas(mon.varietas);
    setNoLot(mon.noLot);
    setStatusKelayakan(mon.statusKelayakan);
    setPetugas(mon.petugas);
    setKadarAir(mon.kadarAir.toString());
    setKemurnian(mon.kemurnian.toString());
    setDayaTumbuh(mon.dayaTumbuh.toString());
    setCatatan(mon.catatan);
    setKabupaten(mon.kabupaten);
    setLatitude(mon.latitude.toString());
    setLongitude(mon.longitude.toString());
    setIsFormOpen(true);
  };

  const handleKabupatenChange = (kab: string) => {
    setKabupaten(kab);
    if (DISTRICT_COORDS[kab]) {
      setLatitude(DISTRICT_COORDS[kab].lat.toString());
      setLongitude(DISTRICT_COORDS[kab].lng.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPengecer || !varietas || !kadarAir || !kemurnian || !dayaTumbuh || !petugas) {
      alert('Mohon lengkapi seluruh formulir bertanda bintang (*)!');
      return;
    }

    const monData: Pengawasan = {
      id: formMode === 'add' ? `mon-${Date.now()}` : id,
      kategori: category,
      namaPengecer,
      komoditas,
      varietas,
      noLot,
      statusKelayakan,
      tglPemeriksaan: formMode === 'add' ? new Date().toISOString().split('T')[0] : monitoringList.find(m => m.id === id)?.tglPemeriksaan || '',
      petugas,
      kadarAir: parseFloat(kadarAir),
      kemurnian: parseFloat(kemurnian),
      dayaTumbuh: parseFloat(dayaTumbuh),
      catatan,
      kabupaten,
      latitude: parseFloat(latitude) || DISTRICT_COORDS[kabupaten]?.lat || 0,
      longitude: parseFloat(longitude) || DISTRICT_COORDS[kabupaten]?.lng || 0,
    };

    if (formMode === 'add') {
      onAdd(monData);
    } else {
      onUpdate(monData);
    }
    setIsFormOpen(false);
  };

  return (
    <div id="pengawasan-manager" className="space-y-6">
      
      {/* View Banner */}
      {isReadOnly && (
        <div id="pub-view-banner" className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-2xl flex items-center justify-between border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center space-x-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Mode Akses Publik Terbuka</p>
              <p className="text-neutral-500 dark:text-neutral-400">Anda hanya diperbolehkan mengamati rekam data pengawasan peredaran benih (View Only). Melakukan inspeksi atau audit baru memerlukan akses petugas.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Pengawasan Peredaran Benih {category === 'pangan' ? 'Tanaman Pangan' : 'Hortikultura'}</span>
          </h3>
          <p className="text-xs text-neutral-400">Pemantauan mutu benih sebar di tingkat distributor & pengecer di Sulawesi Tengah</p>
        </div>

        {!isReadOnly && (
          <button
            id="add-monitoring-btn"
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Hasil Pengawasan</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            id="mon-search"
            type="text"
            placeholder="Cari nama toko, nomor lot, varietas, nama petugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            id="mon-filter-kab"
            value={filterKabupaten}
            onChange={(e) => setFilterKabupaten(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          >
            <option value="Semua">Semua Kabupaten</option>
            {SULTENG_KABUPATEN.map(kab => (
              <option key={kab} value={kab}>{kab}</option>
            ))}
          </select>

          <select
            id="mon-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          >
            <option value="Semua">Semua Kelayakan</option>
            <option value="Layak Edar">Layak Edar</option>
            <option value="Dalam Pengawasan">Dalam Pengawasan</option>
            <option value="Dilarang Edar">Dilarang Edar</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map((mon) => (
            <div 
              key={mon.id}
              id={`mon-card-${mon.id}`}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header info status */}
                <div className="flex justify-between items-start">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    mon.statusKelayakan === 'Layak Edar'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100/50'
                      : mon.statusKelayakan === 'Dilarang Edar'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100/50'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      mon.statusKelayakan === 'Layak Edar' ? 'bg-emerald-500' : mon.statusKelayakan === 'Dilarang Edar' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />
                    <span>{mon.statusKelayakan}</span>
                  </span>
                  
                  <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {mon.kabupaten}
                  </span>
                </div>

                {/* Body Retailer Name */}
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{mon.namaPengecer}</h4>
                  <p className="text-[11px] text-neutral-400">Kode Lot Produksi: <span className="font-mono font-bold">{mon.noLot}</span></p>
                </div>

                {/* Seed Details & Laboratory Testing */}
                <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl text-xs border border-neutral-100/50 dark:border-neutral-800">
                  <div>
                    <span className="text-neutral-400 block text-[9px] font-semibold uppercase tracking-wider">Komoditas / Varietas</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mt-0.5">
                      {category === 'pangan' ? <Wheat className="w-3.5 h-3.5 text-amber-500" /> : <Sprout className="w-3.5 h-3.5 text-emerald-500" />}
                      {mon.komoditas} ({mon.varietas})
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[9px] font-semibold uppercase tracking-wider">Tanggal Audit</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5 block">{mon.tglPemeriksaan}</span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px] font-semibold uppercase tracking-wider">Spesifikasi Hasil Uji Lapangan</span>
                    <div className="grid grid-cols-3 gap-1.5 mt-1 font-mono text-[10px] text-neutral-600 dark:text-neutral-300">
                      <p>Air: <strong className={mon.kadarAir > 14 ? 'text-red-600' : 'text-emerald-600'}>{mon.kadarAir}%</strong></p>
                      <p>Murni: <strong className={mon.kemurnian < 98 ? 'text-amber-600' : 'text-emerald-600'}>{mon.kemurnian}%</strong></p>
                      <p>Tumbuh: <strong className={mon.dayaTumbuh < 80 ? 'text-red-600 font-extrabold' : 'text-emerald-600'}>{mon.dayaTumbuh}%</strong></p>
                    </div>
                  </div>
                </div>

                {/* Comments / Catatan Pengawas */}
                {mon.catatan && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-amber-50/10 dark:bg-amber-950/5 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    &ldquo;{mon.catatan}&rdquo;
                  </div>
                )}
              </div>

              {/* Footer info: Inspector & Action */}
              <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">
                  Petugas: <strong className="text-neutral-600 dark:text-neutral-300">{mon.petugas}</strong>
                </span>

                {!isReadOnly && (
                  <div className="flex gap-1.5">
                    <button
                      id={`edit-mon-btn-${mon.id}`}
                      onClick={() => handleOpenEdit(mon)}
                      className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 p-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      title="Ubah Laporan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {userRole === 'admin_utama' && (
                      <button
                        id={`del-mon-btn-${mon.id}`}
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus laporan pengawasan di ${mon.namaPengecer}?`)) {
                            onDelete(mon.id);
                          }
                        }}
                        className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 p-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-neutral-50 dark:bg-neutral-850 p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
            <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-500">Data Pengawasan Kosong</h4>
            <p className="text-xs text-neutral-400">Gunakan kata kunci pencarian lain atau silakan catat hasil pemantauan benih di pengecer.</p>
          </div>
        )}
      </div>

      {/* FORM MODAL: ADD / EDIT REPORTS */}
      {isFormOpen && (
        <div id="mon-form-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {formMode === 'add' ? 'Log Pemeriksaan Lapangan Pengecer Benih' : 'Edit Rekam Laporan Pengawasan'}
              </h4>
              <button 
                id="close-mon-form-btn"
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-emerald-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Pengecer */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Nama Toko / Pengecer / Distributor *</label>
                  <input
                    id="mon-form-toko"
                    type="text"
                    required
                    value={namaPengecer}
                    onChange={(e) => setNamaPengecer(e.target.value)}
                    placeholder="Contoh: Kios Pertanian Subur Jaya Sigi"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Komoditas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Jenis Komoditas *</label>
                  <select
                    id="mon-form-komoditas"
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
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Varietas *</label>
                  <input
                    id="mon-form-varietas"
                    type="text"
                    required
                    value={varietas}
                    onChange={(e) => setVarietas(e.target.value)}
                    placeholder="Contoh: Lembah Palu"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Kode Lot */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Nomor Kode Lot Benih *</label>
                  <input
                    id="mon-form-lot"
                    type="text"
                    required
                    value={noLot}
                    onChange={(e) => setNoLot(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Status Kelayakan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Status Kelayakan Edar *</label>
                  <select
                    id="mon-form-status"
                    value={statusKelayakan}
                    onChange={(e) => setStatusKelayakan(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    <option value="Layak Edar">Layak Edar</option>
                    <option value="Dalam Pengawasan">Dalam Pengawasan (Kadar air atau Daya tumbuh kurang)</option>
                    <option value="Dilarang Edar">Dilarang Edar (Kadaluwarsa / Rusak segel)</option>
                  </select>
                </div>

                {/* Kabupaten */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Wilayah Kabupaten *</label>
                  <select
                    id="mon-form-kab"
                    value={kabupaten}
                    onChange={(e) => handleKabupatenChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    {SULTENG_KABUPATEN.map(kab => (
                      <option key={kab} value={kab}>{kab}</option>
                    ))}
                  </select>
                </div>

                {/* Petugas Pengawas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Petugas Pemeriksa *</label>
                  <input
                    id="mon-form-petugas"
                    type="text"
                    required
                    value={petugas}
                    onChange={(e) => setPetugas(e.target.value)}
                    placeholder="Contoh: Ir. H. Syarifudin"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* GPS Coordinates */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Latitude GPS</label>
                  <input
                    id="mon-form-lat"
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Longitude GPS</label>
                  <input
                    id="mon-form-lng"
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Seed Testing Specs */}
                <div className="sm:col-span-2 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hasil Pengukuran Sampel Toko *</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-neutral-500">Kadar Air (%)</label>
                      <input
                        id="mon-form-ka"
                        type="number"
                        step="0.1"
                        required
                        value={kadarAir}
                        onChange={(e) => setKadarAir(e.target.value)}
                        placeholder="e.g. 13.0"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white animate-fade-in"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-neutral-500">Kemurnian (%)</label>
                      <input
                        id="mon-form-kpur"
                        type="number"
                        step="0.1"
                        required
                        value={kemurnian}
                        onChange={(e) => setKemurnian(e.target.value)}
                        placeholder="e.g. 99.0"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-neutral-500">Daya Tumbuh (%)</label>
                      <input
                        id="mon-form-dtumbuh"
                        type="number"
                        step="0.1"
                        required
                        value={dayaTumbuh}
                        onChange={(e) => setDayaTumbuh(e.target.value)}
                        placeholder="e.g. 90.0"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Catatan & Temuan Lapangan</label>
                  <textarea
                    id="mon-form-notes"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tuliskan catatan kemasan segel, tempat penyimpanan, atau instruksi penarikan benih jika kadaluwarsa..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  id="mon-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="mon-save"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {formMode === 'add' ? 'Simpan Laporan' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
