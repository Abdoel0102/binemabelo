import React, { useState } from 'react';
import { 
  Plus, Search, Wheat, Sprout, ShieldAlert, Award, Star, ListChecks, 
  Trash2, Edit3, X, HelpCircle, CheckCircle, FlameKindling, Info
} from 'lucide-react';
import { Kultivar, SeedCategory } from '../types';

interface KultivarManagerProps {
  category: SeedCategory;
  cultivars: Kultivar[];
  onAdd: (data: Kultivar) => void;
  onUpdate: (data: Kultivar) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

export default function KultivarManager({
  category, cultivars, onAdd, onUpdate, onDelete, userRole
}: KultivarManagerProps) {
  const [search, setSearch] = useState('');
  const [selectedCultivar, setSelectedCultivar] = useState<Kultivar | null>(null);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Form Fields
  const [id, setId] = useState('');
  const [namaVarietas, setNamaVarietas] = useState('');
  const [komoditas, setKomoditas] = useState('');
  const [pemulia, setPemulia] = useState('');
  const [tglPelepasan, setTglPelepasan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [keunggulanText, setKeunggulanText] = useState(''); // comma separated
  const [potensiHasil, setPotensiHasil] = useState('');
  const [tahanHamaText, setTahanHamaText] = useState(''); // comma separated

  const isReadOnly = userRole === 'public';

  const filteredCultivars = cultivars.filter(cult => {
    if (cult.kategori !== category) return false;

    return cult.namaVarietas.toLowerCase().includes(search.toLowerCase()) ||
           cult.komoditas.toLowerCase().includes(search.toLowerCase()) ||
           cult.pemulia.toLowerCase().includes(search.toLowerCase()) ||
           cult.deskripsi.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setFormMode('add');
    setId('');
    setNamaVarietas('');
    setKomoditas(category === 'pangan' ? 'Padi Sawah' : 'Bawang Merah');
    setPemulia('');
    setTglPelepasan('');
    setDeskripsi('');
    setKeunggulanText('');
    setPotensiHasil('');
    setTahanHamaText('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cult: Kultivar, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click selected modal
    if (isReadOnly) return;
    setFormMode('edit');
    setId(cult.id);
    setNamaVarietas(cult.namaVarietas);
    setKomoditas(cult.komoditas);
    setPemulia(cult.pemulia);
    setTglPelepasan(cult.tglPelepasan);
    setDeskripsi(cult.deskripsi);
    setKeunggulanText(cult.keunggulan.join(', '));
    setPotensiHasil(cult.potensiHasil);
    setTahanHamaText(cult.tahanHama.join(', '));
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaVarietas || !komoditas || !pemulia || !potensiHasil) {
      alert('Mohon isi field utama yang wajib diisi (*)!');
      return;
    }

    const cultData: Kultivar = {
      id: formMode === 'add' ? `cult-${Date.now()}` : id,
      kategori: category,
      namaVarietas,
      komoditas,
      pemulia,
      tglPelepasan: tglPelepasan || 'Tidak Dinyatakan',
      deskripsi,
      keunggulan: keunggulanText ? keunggulanText.split(',').map(s => s.trim()).filter(Boolean) : [],
      potensiHasil,
      tahanHama: tahanHamaText ? tahanHamaText.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    if (formMode === 'add') {
      onAdd(cultData);
    } else {
      onUpdate(cultData);
    }
    setIsFormOpen(false);
  };

  return (
    <div id="kultivar-manager" className="space-y-6">
      
      {/* Banner */}
      {isReadOnly && (
        <div id="pub-view-banner-cult" className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-2xl flex items-center justify-between border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center space-x-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Mode Akses Publik Terbuka</p>
              <p className="text-neutral-500 dark:text-neutral-400">Anda dapat mencari dan melihat seluruh katalog kultivar resmi (View Only). Menambahkan atau memperbarui data varietas unggul baru memerlukan otorisasi admin.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Daftar Kultivar & Varietas {category === 'pangan' ? 'Tanaman Pangan' : 'Hortikultura'}</span>
          </h3>
          <p className="text-xs text-neutral-400">Varietas tanaman unggulan Sulawesi Tengah yang terdaftar resmi dan dilepas Kementerian Pertanian</p>
        </div>

        {!isReadOnly && (
          <button
            id="add-cultivar-btn"
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Varietas Baru</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xs flex gap-3">
        <div className="relative flex-1">
          <input
            id="cult-search"
            type="text"
            placeholder="Cari nama varietas, komoditas, keunggulan, pemulia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Cultivars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCultivars.length > 0 ? (
          filteredCultivars.map((cult) => (
            <div 
              key={cult.id}
              id={`cult-card-${cult.id}`}
              onClick={() => setSelectedCultivar(cult)}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/55 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    {cult.komoditas}
                  </span>
                  
                  {/* Category icon */}
                  {category === 'pangan' ? <Wheat className="w-4 h-4 text-amber-500" /> : <Sprout className="w-4 h-4 text-emerald-500" />}
                </div>

                <div>
                  <h4 className="text-base font-black text-neutral-800 dark:text-neutral-100 group-hover:text-emerald-600 transition-colors">
                    {cult.namaVarietas}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Pemulia: <strong className="text-neutral-500">{cult.pemulia}</strong></p>
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {cult.deskripsi}
                </p>
              </div>

              {/* Yield and Resistances mini overview */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400 font-medium">Potensi Hasil:</span>
                  <span className="font-bold text-neutral-700 dark:text-emerald-400 font-mono">{cult.potensiHasil}</span>
                </div>

                {cult.keunggulan.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cult.keunggulan.slice(0, 2).map((fav, index) => (
                      <span key={index} className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded">
                        {fav}
                      </span>
                    ))}
                    {cult.keunggulan.length > 2 && (
                      <span className="text-[9px] text-neutral-400 font-mono">+{cult.keunggulan.length - 2} lagi</span>
                    )}
                  </div>
                )}
              </div>

              {/* Edit/Delete controls */}
              {!isReadOnly && (
                <div className="flex justify-end gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60" onClick={e => e.stopPropagation()}>
                  <button
                    id={`edit-cult-btn-${cult.id}`}
                    onClick={(e) => handleOpenEdit(cult, e)}
                    className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 p-1 rounded-md transition-colors"
                    title="Ubah Katalog"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {userRole === 'admin_utama' && (
                    <button
                      id={`del-cult-btn-${cult.id}`}
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus varietas ${cult.namaVarietas} dari katalog?`)) {
                          onDelete(cult.id);
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-neutral-50 dark:bg-neutral-850 p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
            <Star className="w-12 h-12 text-neutral-300 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-500">Katalog Kultivar Kosong</h4>
            <p className="text-xs text-neutral-400">Tidak ada varietas yang cocok dengan kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL VIEW CULTIVAR */}
      {selectedCultivar && (
        <div id="cult-detail-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-neutral-800 dark:text-neutral-100">
            {/* Header */}
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {selectedCultivar.kategori === 'pangan' ? <Wheat className="w-5 h-5 text-amber-300" /> : <Sprout className="w-5 h-5 text-emerald-300" />}
                <h4 className="font-bold text-sm uppercase tracking-wide">Detail Kultivar Resmi</h4>
              </div>
              <button 
                id="close-cult-detail"
                onClick={() => setSelectedCultivar(null)}
                className="text-white hover:text-emerald-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {selectedCultivar.komoditas}
                </span>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white mt-1">{selectedCultivar.namaVarietas}</h3>
                <p className="text-xs text-neutral-400 mt-1">Dilepas Tanggal: <strong className="text-neutral-500 dark:text-neutral-300">{selectedCultivar.tglPelepasan}</strong></p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-neutral-500">Deskripsi Ringkas</h5>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {selectedCultivar.deskripsi}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold">Pemulia / Penemu</span>
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">{selectedCultivar.pemulia}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold">Potensi Hasil Rata-Rata</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-600">{selectedCultivar.potensiHasil}</span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-3.5">
                {selectedCultivar.keunggulan.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Keunggulan Utama Varietas</span>
                    </h5>
                    <ul className="list-disc pl-5 text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                      {selectedCultivar.keunggulan.map((keu, i) => (
                        <li key={i}>{keu}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCultivar.tahanHama.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                      <FlameKindling className="w-3.5 h-3.5 text-rose-500" />
                      <span>Resistensi Hama & Penyakit</span>
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedCultivar.tahanHama.map((hama, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-lg font-medium border border-rose-100 dark:border-rose-900/20">
                          {hama}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-750 text-right">
              <button
                id="close-cult-detail-footer"
                onClick={() => setSelectedCultivar(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Tutup Katalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL: REGISTER NEW CULTIVAR */}
      {isFormOpen && (
        <div id="cult-form-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {formMode === 'add' ? 'Registrasi Kultivar Baru' : 'Ubah Spesifikasi Kultivar'}
              </h4>
              <button 
                id="close-cult-form-btn"
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-emerald-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Varietas */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Nama Varietas / Kultivar *</label>
                  <input
                    id="cult-form-name"
                    type="text"
                    required
                    value={namaVarietas}
                    onChange={(e) => setNamaVarietas(e.target.value)}
                    placeholder="Contoh: Bawang Merah Lembah Palu"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Komoditas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Jenis Komoditas *</label>
                  <select
                    id="cult-form-komoditas"
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

                {/* Pemulia */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Penemu / Pemulia Benih *</label>
                  <input
                    id="cult-form-breeder"
                    type="text"
                    required
                    value={pemulia}
                    onChange={(e) => setPemulia(e.target.value)}
                    placeholder="Contoh: Balitbangtan Pertanian / Dinas Sulteng"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Potensi Hasil */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Potensi Hasil Rata-Rata *</label>
                  <input
                    id="cult-form-yield"
                    type="text"
                    required
                    value={potensiHasil}
                    onChange={(e) => setPotensiHasil(e.target.value)}
                    placeholder="Contoh: 8.5 Ton / Hektar"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Tanggal Pelepasan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Tanggal SK Pelepasan Kementan</label>
                  <input
                    id="cult-form-release"
                    type="text"
                    value={tglPelepasan}
                    onChange={(e) => setTglPelepasan(e.target.value)}
                    placeholder="Contoh: 2026-03-12"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Deskripsi */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Deskripsi Karakteristik Tanaman</label>
                  <textarea
                    id="cult-form-desc"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Tuliskan deskripsi tinggi batang, bentuk umbi, atau anakan produktif..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Keunggulan */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Keunggulan Utama (Pisahkan dengan tanda koma)</label>
                  <input
                    id="cult-form-strengths"
                    type="text"
                    value={keunggulanText}
                    onChange={(e) => setKeunggulanText(e.target.value)}
                    placeholder="Aroma sangat harum, Nasi pulen, Tahan rebah batang"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Ketahanan Hama */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Resistensi Hama / Penyakit (Pisahkan dengan tanda koma)</label>
                  <input
                    id="cult-form-pests"
                    type="text"
                    value={tahanHamaText}
                    onChange={(e) => setTahanHamaText(e.target.value)}
                    placeholder="Hama Wereng Coklat, Hawar Daun Bakteri, Layu Fusarium"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  id="cult-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="cult-save"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {formMode === 'add' ? 'Simpan Katalog' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
