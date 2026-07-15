export type UserRole = 'admin_utama' | 'admin_input' | 'public';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export type SeedCategory = 'pangan' | 'horti';

export interface Sertifikasi {
  id: string;
  noSertifikat: string;
  kategori: SeedCategory;
  namaProdusen: string;
  varietas: string;
  komoditas: string;
  luasLahan: number; // in hectares
  perkiraanProduksi: number; // in tons
  status: 'Pengajuan' | 'Pemeriksaan Lapangan' | 'Pengujian Laboratorium' | 'Sertifikat Terbit' | 'Ditolak';
  tglPengajuan: string;
  tglTerbit?: string;
  kabupaten: string;
  latitude: number;
  longitude: number;
  labelQrCode: string;
  kadarAir?: number; // %
  kemurnian?: number; // %
  dayaTumbuh?: number; // %
}

export interface Pengawasan {
  id: string;
  kategori: SeedCategory;
  namaPengecer: string; // Toko Benih / Distributor
  varietas: string;
  komoditas: string;
  noLot: string;
  statusKelayakan: 'Layak Edar' | 'Dalam Pengawasan' | 'Dilarang Edar';
  tglPemeriksaan: string;
  petugas: string;
  kadarAir: number; // %
  kemurnian: number; // %
  dayaTumbuh: number; // %
  catatan: string;
  kabupaten: string;
  latitude: number;
  longitude: number;
}

export interface Kultivar {
  id: string;
  kategori: SeedCategory;
  namaVarietas: string;
  komoditas: string;
  pemulia: string;
  tglPelepasan: string;
  deskripsi: string;
  keunggulan: string[];
  potensiHasil: string;
  tahanHama: string[];
}

export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  ringkasan: string;
  isi: string;
  kategori: 'Pangan' | 'Hortikultura' | 'Regulasi' | 'Sertifikasi' | 'Pengumuman';
  imageUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface HistoryLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}
