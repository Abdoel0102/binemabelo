import React, { useState } from 'react';
import { 
  Plus, Search, FileText, Calendar, BookOpen, Trash2, Edit3, X, Sparkles, 
  ShieldAlert, Landmark, Quote
} from 'lucide-react';
import { Berita } from '../types';

interface InfoBeritaProps {
  newsList: Berita[];
  onAdd: (data: Berita) => void;
  onUpdate: (data: Berita) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

export default function InfoBerita({ newsList, onAdd, onUpdate, onDelete, userRole }: InfoBeritaProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedNews, setSelectedNews] = useState<Berita | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Form Fields
  const [id, setId] = useState('');
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<'Pangan' | 'Hortikultura' | 'Regulasi' | 'Sertifikasi' | 'Pengumuman'>('Pengumuman');
  const [ringkasan, setRingkasan] = useState('');
  const [isi, setIsi] = useState('');

  const isReadOnly = userRole === 'public';

  const categories = ['Semua', 'Sertifikasi', 'Pengawasan', 'Hortikultura', 'Pangan', 'Regulasi', 'Pengumuman'];

  const filteredNews = newsList.filter(news => {
    const matchesSearch = news.judul.toLowerCase().includes(search.toLowerCase()) ||
                          news.ringkasan.toLowerCase().includes(search.toLowerCase()) ||
                          news.isi.toLowerCase().includes(search.toLowerCase());
                          
    const matchesCat = activeCategory === 'Semua' || 
                       news.kategori.toLowerCase() === activeCategory.toLowerCase() ||
                       (activeCategory === 'Pengawasan' && news.kategori === 'Regulasi'); // soft fallback

    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setFormMode('add');
    setId('');
    setJudul('');
    setKategori('Pengumuman');
    setRingkasan('');
    setIsi('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (news: Berita, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReadOnly) return;
    setFormMode('edit');
    setId(news.id);
    setJudul(news.judul);
    setKategori(news.kategori);
    setRingkasan(news.ringkasan);
    setIsi(news.isi);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !ringkasan || !isi) {
      alert('Mohon isi semua bagian yang wajib diisi!');
      return;
    }

    const newsData: Berita = {
      id: formMode === 'add' ? `news-${Date.now()}` : id,
      judul,
      tanggal: formMode === 'add' ? new Date().toISOString().split('T')[0] : newsList.find(n => n.id === id)?.tanggal || '',
      ringkasan,
      isi,
      kategori,
    };

    if (formMode === 'add') {
      onAdd(newsData);
    } else {
      onUpdate(newsData);
    }
    setIsFormOpen(false);
  };

  return (
    <div id="info-berita-wrapper" className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 font-sans flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Portal Informasi & Berita Pertanian</span>
          </h3>
          <p className="text-xs text-neutral-400">Pengumuman regulasi, kebijakan sertifikasi, dan tips teknologi budidaya benih sebar</p>
        </div>

        {!isReadOnly && (
          <button
            id="add-news-btn"
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Berita / Pengumuman</span>
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            id={`btn-news-cat-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Article list */}
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <input
              id="news-search"
              type="text"
              placeholder="Cari berita atau pengumuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredNews.length > 0 ? (
              filteredNews.map(news => (
                <div
                  key={news.id}
                  id={`news-card-${news.id}`}
                  onClick={() => setSelectedNews(news)}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl border p-5 shadow-xs hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all space-y-3 ${
                    selectedNews?.id === news.id ? 'border-emerald-500 bg-emerald-50/10' : 'border-neutral-100 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-200/55 dark:border-neutral-700/55">
                      {news.kategori}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {news.tanggal}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-white line-clamp-1 group-hover:text-emerald-600">
                      {news.judul}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {news.ringkasan}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                    <span className="text-emerald-600 hover:text-emerald-700 font-semibold">Baca Selengkapnya &rarr;</span>
                    
                    {!isReadOnly && (
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          id={`edit-news-btn-${news.id}`}
                          onClick={(e) => handleOpenEdit(news, e)}
                          className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 p-1 rounded-sm transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {userRole === 'admin_utama' && (
                          <button
                            id={`del-news-btn-${news.id}`}
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus berita: "${news.judul}"?`)) {
                                onDelete(news.id);
                                if (selectedNews?.id === news.id) setSelectedNews(null);
                              }
                            }}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 rounded-sm transition-colors cursor-pointer"
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
              <div className="bg-neutral-50 dark:bg-neutral-850 p-8 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                <FileText className="w-8 h-8 text-neutral-300 mx-auto" />
                <h4 className="text-xs font-bold text-neutral-500">Berita Tidak Ditemukan</h4>
                <p className="text-[10px] text-neutral-400">Gunakan kata kunci pencarian lain.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Article Reader pane */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-xs h-fit min-h-[400px] flex flex-col justify-between">
          {selectedNews ? (
            <div id="news-reader-pane" className="space-y-4 animate-fade-in text-neutral-800 dark:text-neutral-100">
              
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                    {selectedNews.kategori}
                  </span>
                  <span className="text-neutral-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedNews.tanggal}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white leading-snug">
                  {selectedNews.judul}
                </h3>
              </div>

              {/* Summary quote */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3.5 rounded-xl border-l-4 border-emerald-600 text-xs text-neutral-600 dark:text-neutral-300 italic flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>&ldquo;{selectedNews.ringkasan}&rdquo;</p>
              </div>

              {/* Full Article body content */}
              <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedNews.isi}
              </p>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Sparkles className="w-12 h-12 text-neutral-300" />
              <h4 className="text-sm font-bold text-neutral-500">Pilih Berita dari Daftar</h4>
              <p className="text-xs text-neutral-400 max-w-xs">Silakan ketuk salah satu judul artikel atau berita di sebelah kiri untuk membaca ulasan isi berita secara komprehensif.</p>
            </div>
          )}

          {/* Regulatory Citation bottom badge */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-[10px] text-neutral-400 font-sans">
            <Landmark className="w-4 h-4 text-neutral-400" />
            <span>Publikasi Resmi BPSBTPH Dinas Pertanian Provinsi Sulawesi Tengah.</span>
          </div>
        </div>

      </div>

      {/* FORM MODAL: ADD / EDIT ARTICLES */}
      {isFormOpen && (
        <div id="news-form-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {formMode === 'add' ? 'Tulis Pengumuman / Berita Baru' : 'Ubah Data Berita'}
              </h4>
              <button 
                id="close-news-form-btn"
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-emerald-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                
                {/* Judul */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Judul Berita *</label>
                  <input
                    id="news-form-title"
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Pembagian Benih Bersertifikasi di Luwuk"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Kategori Publikasi *</label>
                  <select
                    id="news-form-cat"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  >
                    <option value="Sertifikasi">Sertifikasi</option>
                    <option value="Pengawasan">Pengawasan</option>
                    <option value="Hortikultura">Hortikultura</option>
                    <option value="Pangan">Tanaman Pangan</option>
                    <option value="Regulasi">Regulasi & Kebijakan</option>
                    <option value="Pengumuman">Pengumuman Umum</option>
                  </select>
                </div>

                {/* Ringkasan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Ringkasan Pendek (Lead)*</label>
                  <input
                    id="news-form-summary"
                    type="text"
                    required
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                    placeholder="Tuliskan ringkasan 1 kalimat yang mendeskripsikan isi berita..."
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

                {/* Isi Berita */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Isi Lengkap Berita *</label>
                  <textarea
                    id="news-form-body"
                    required
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    placeholder="Tulis paragraf lengkap berita pertanian di sini..."
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  id="news-form-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="news-form-save"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {formMode === 'add' ? 'Terbitkan Berita' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
