import { createClient } from '@supabase/supabase-js';
import { Sertifikasi, Pengawasan, Kultivar, Berita, HistoryLog, User } from '../types';

// Safely extract and clean URL (Supabase client will fail if trailing /rest/v1/ is left in base URL)
const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').trim();
const anonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = !!cleanUrl && !!anonKey;

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, anonKey)
  : null;

// Helpers to map camelCase (frontend Types) to snake_case (Supabase database) and vice versa

// SERTIFIKASI MAPPING
export function mapSertifikasiFromDb(row: any): Sertifikasi {
  return {
    id: row.id,
    noSertifikat: row.no_sertifikat,
    kategori: row.kategori,
    namaProdusen: row.nama_produsen,
    varietas: row.varietas,
    komoditas: row.komoditas,
    luasLahan: Number(row.luas_lahan),
    perkiraanProduksi: row.perkiraan_produksi ? Number(row.perkiraan_produksi) : undefined,
    status: row.status,
    tglPengajuan: row.tgl_pengajuan,
    tglTerbit: row.tgl_terbit || undefined,
    kabupaten: row.kabupaten,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    labelQrCode: row.label_qr_code,
    kadarAir: row.kadar_air ? Number(row.kadar_air) : undefined,
    kemurnian: row.kemurnian ? Number(row.kemurnian) : undefined,
    dayaTumbuh: row.daya_tumbuh ? Number(row.daya_tumbuh) : undefined,
  };
}

export function mapSertifikasiToDb(item: Sertifikasi) {
  return {
    id: item.id,
    no_sertifikat: item.noSertifikat,
    kategori: item.kategori,
    nama_produsen: item.namaProdusen,
    varietas: item.varietas,
    komoditas: item.komoditas,
    luas_lahan: item.luasLahan,
    perkiraan_produksi: item.perkiraanProduksi,
    status: item.status,
    tgl_pengajuan: item.tglPengajuan,
    tgl_terbit: item.tglTerbit || null,
    kabupaten: item.kabupaten,
    latitude: item.latitude,
    longitude: item.longitude,
    label_qr_code: item.labelQrCode,
    kadar_air: item.kadarAir || null,
    kemurnian: item.kemurnian || null,
    daya_tumbuh: item.dayaTumbuh || null,
  };
}

// PENGAWASAN MAPPING
export function mapPengawasanFromDb(row: any): Pengawasan {
  return {
    id: row.id,
    kategori: row.kategori,
    namaPengecer: row.nama_pengecer,
    varietas: row.varietas,
    komoditas: row.komoditas,
    noLot: row.no_lot,
    statusKelayakan: row.status_kelayakan,
    tglPemeriksaan: row.tgl_pemeriksaan,
    petugas: row.petugas,
    kadarAir: row.kadar_air ? Number(row.kadar_air) : undefined,
    kemurnian: row.kemurnian ? Number(row.kemurnian) : undefined,
    dayaTumbuh: row.daya_tumbuh ? Number(row.daya_tumbuh) : undefined,
    catatan: row.catatan || undefined,
    kabupaten: row.kabupaten,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  };
}

export function mapPengawasanToDb(item: Pengawasan) {
  return {
    id: item.id,
    kategori: item.kategori,
    nama_pengecer: item.namaPengecer,
    varietas: item.varietas,
    komoditas: item.komoditas,
    no_lot: item.noLot,
    status_kelayakan: item.statusKelayakan,
    tgl_pemeriksaan: item.tglPemeriksaan,
    petugas: item.petugas,
    kadar_air: item.kadarAir || null,
    kemurnian: item.kemurnian || null,
    daya_tumbuh: item.dayaTumbuh || null,
    catatan: item.catatan || null,
    kabupaten: item.kabupaten,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}

// KULTIVAR MAPPING
export function mapKultivarFromDb(row: any): Kultivar {
  return {
    id: row.id,
    kategori: row.kategori,
    namaVarietas: row.nama_varietas,
    komoditas: row.komoditas,
    pemulia: row.pemulia,
    tglPelepasan: row.tgl_pelepasan,
    deskripsi: row.deskripsi,
    keunggulan: Array.isArray(row.keunggulan) ? row.keunggulan : (row.keunggulan ? JSON.parse(row.keunggulan) : []),
    potensiHasil: row.potensi_hasil,
    tahanHama: Array.isArray(row.tahan_hama) ? row.tahan_hama : (row.tahan_hama ? JSON.parse(row.tahan_hama) : []),
  };
}

export function mapKultivarToDb(item: Kultivar) {
  return {
    id: item.id,
    kategori: item.kategori,
    nama_varietas: item.namaVarietas,
    komoditas: item.komoditas,
    pemulia: item.pemulia,
    tgl_pelepasan: item.tglPelepasan,
    deskripsi: item.deskripsi,
    keunggulan: item.keunggulan,
    potensi_hasil: item.potensiHasil,
    tahan_hama: item.tahanHama,
  };
}

// BERITA MAPPING
export function mapBeritaFromDb(row: any): Berita {
  return {
    id: row.id,
    judul: row.judul,
    tanggal: row.tanggal,
    ringkasan: row.ringkasan,
    isi: row.isi,
    kategori: row.kategori,
  };
}

export function mapBeritaToDb(item: Berita) {
  return {
    id: item.id,
    judul: item.judul,
    tanggal: item.tanggal,
    ringkasan: item.ringkasan,
    isi: item.isi,
    kategori: item.kategori,
  };
}

// RIWAYAT AUDIT MAPPING
export function mapHistoryLogFromDb(row: any): HistoryLog {
  return {
    id: row.id,
    user: row.user_name,
    action: row.action,
    details: row.details,
    timestamp: row.timestamp,
  };
}

export function mapHistoryLogToDb(item: HistoryLog) {
  return {
    id: item.id,
    user_name: item.user,
    action: item.action,
    details: item.details,
    timestamp: item.timestamp,
  };
}

// USER MAPPING
export function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    name: row.name,
    createdAt: row.created_at,
  };
}

export function mapUserToDb(item: User) {
  return {
    id: item.id,
    username: item.username,
    role: item.role,
    name: item.name,
    created_at: item.createdAt,
  };
}

// SQL Schema code to assist the user
export const SUPABASE_SQL_SCHEMA = `-- 1. Table for Sertifikasi
CREATE TABLE IF NOT EXISTS mabelo_sertifikasi (
  id TEXT PRIMARY KEY,
  no_sertifikat TEXT NOT NULL,
  kategori TEXT NOT NULL,
  nama_produsen TEXT NOT NULL,
  varietas TEXT NOT NULL,
  komoditas TEXT NOT NULL,
  luas_lahan NUMERIC NOT NULL,
  perkiraan_produksi NUMERIC,
  status TEXT NOT NULL,
  tgl_pengajuan TEXT NOT NULL,
  tgl_terbit TEXT,
  kabupaten TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  label_qr_code TEXT NOT NULL,
  kadar_air NUMERIC,
  kemurnian NUMERIC,
  daya_tumbuh NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for Pengawasan Peredaran
CREATE TABLE IF NOT EXISTS mabelo_pengawasan (
  id TEXT PRIMARY KEY,
  kategori TEXT NOT NULL,
  nama_pengecer TEXT NOT NULL,
  varietas TEXT NOT NULL,
  komoditas TEXT NOT NULL,
  no_lot TEXT NOT NULL,
  status_kelayakan TEXT NOT NULL,
  tgl_pemeriksaan TEXT NOT NULL,
  petugas TEXT NOT NULL,
  kadar_air NUMERIC,
  kemurnian NUMERIC,
  daya_tumbuh NUMERIC,
  catatan TEXT,
  kabupaten TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table for Kultivar Terdaftar
CREATE TABLE IF NOT EXISTS mabelo_kultivar (
  id TEXT PRIMARY KEY,
  kategori TEXT NOT NULL,
  nama_varietas TEXT NOT NULL,
  komoditas TEXT NOT NULL,
  pemulia TEXT NOT NULL,
  tgl_pelepasan TEXT NOT NULL,
  deskripsi TEXT,
  keunggulan TEXT[] NOT NULL DEFAULT '{}',
  potensi_hasil TEXT,
  tahan_hama TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table for Berita & Info
CREATE TABLE IF NOT EXISTS mabelo_berita (
  id TEXT PRIMARY KEY,
  judul TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  ringkasan TEXT,
  isi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table for History Logs
CREATE TABLE IF NOT EXISTS mabelo_history_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table for Users List
CREATE TABLE IF NOT EXISTS mabelo_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- ENABLE ROW LEVEL SECURITY & DEFINE PUBLIC ACCESS
-- Since we are connecting using standard anon keys, we enable basic operations:
-- Allow anyone (public/anon) to SELECT
ALTER TABLE mabelo_sertifikasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_sertifikasi FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_sertifikasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_sertifikasi FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_sertifikasi FOR DELETE USING (true);

ALTER TABLE mabelo_pengawasan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_pengawasan FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_pengawasan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_pengawasan FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_pengawasan FOR DELETE USING (true);

ALTER TABLE mabelo_kultivar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_kultivar FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_kultivar FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_kultivar FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_kultivar FOR DELETE USING (true);

ALTER TABLE mabelo_berita ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_berita FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_berita FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_berita FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_berita FOR DELETE USING (true);

ALTER TABLE mabelo_history_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_history_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_history_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_history_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_history_logs FOR DELETE USING (true);

ALTER TABLE mabelo_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON mabelo_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mabelo_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mabelo_users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON mabelo_users FOR DELETE USING (true);
`;
