import { Sertifikasi, Pengawasan, Kultivar, Berita, Notification, User, HistoryLog } from './types';

// Default Admin Accounts
export const defaultUsers: User[] = [
  {
    id: 'user-1',
    username: 'Admin',
    role: 'admin_utama',
    name: 'Administrator Utama (BTHP)',
    createdAt: '2026-01-01 08:00',
  },
  {
    id: 'user-2',
    username: 'petugas_pangan',
    role: 'admin_input',
    name: 'Petugas Input Tanaman Pangan',
    createdAt: '2026-03-15 09:30',
  },
  {
    id: 'user-3',
    username: 'petugas_horti',
    role: 'admin_input',
    name: 'Petugas Input Hortikultura',
    createdAt: '2026-03-20 10:15',
  }
];

// Seed Certifications (Sertifikasi)
export const initialCertifications: Sertifikasi[] = [
  {
    id: 'cert-1',
    noSertifikat: '521/205/Sert-TP/2026',
    kategori: 'pangan',
    namaProdusen: 'Kelompok Tani Mekar Sari Sigi',
    varietas: 'Inpari 32',
    komoditas: 'Padi Sawah',
    luasLahan: 5.5,
    perkiraanProduksi: 22.5,
    status: 'Sertifikat Terbit',
    tglPengajuan: '2026-05-10',
    tglTerbit: '2026-06-02',
    kabupaten: 'Sigi',
    latitude: -1.0333,
    longitude: 119.9500,
    labelQrCode: 'BINE-TP-PADI-INPARI32-001',
    kadarAir: 12.8,
    kemurnian: 99.2,
    dayaTumbuh: 92.0
  },
  {
    id: 'cert-2',
    noSertifikat: '521/112/Sert-Horti/2026',
    kategori: 'horti',
    namaProdusen: 'CV. Agro Lestari Palu',
    varietas: 'Lembah Palu',
    komoditas: 'Bawang Merah',
    luasLahan: 2.0,
    perkiraanProduksi: 8.4,
    status: 'Sertifikat Terbit',
    tglPengajuan: '2026-05-14',
    tglTerbit: '2026-06-08',
    kabupaten: 'Palu',
    latitude: -0.8917,
    longitude: 119.8707,
    labelQrCode: 'BINE-HT-BAWANG-LMBHPALU-002',
    kadarAir: 13.5,
    kemurnian: 98.5,
    dayaTumbuh: 88.0
  },
  {
    id: 'cert-3',
    noSertifikat: '521/304/Sert-TP/2026',
    kategori: 'pangan',
    namaProdusen: 'UD. Tani Makmur Parigi',
    varietas: 'Bisi 18',
    komoditas: 'Jagung Hibrida',
    luasLahan: 12.0,
    perkiraanProduksi: 72.0,
    status: 'Pemeriksaan Lapangan',
    tglPengajuan: '2026-06-12',
    kabupaten: 'Parigi Moutong',
    latitude: -0.8311,
    longitude: 120.1833,
    labelQrCode: 'BINE-TP-JAGUNG-BISI18-003'
  },
  {
    id: 'cert-4',
    noSertifikat: '521/145/Sert-Horti/2026',
    kategori: 'horti',
    namaProdusen: 'Penangkar Benih Durian Kasimbar',
    varietas: 'Montong Palu',
    komoditas: 'Durian',
    luasLahan: 3.5,
    perkiraanProduksi: 15.0,
    status: 'Pengujian Laboratorium',
    tglPengajuan: '2026-06-18',
    kabupaten: 'Parigi Moutong',
    latitude: -0.2241,
    longitude: 120.0381,
    labelQrCode: 'BINE-HT-DURIAN-MNTPALU-004'
  },
  {
    id: 'cert-5',
    noSertifikat: '521/412/Sert-TP/2026',
    kategori: 'pangan',
    namaProdusen: 'Koperasi Tani Sintuvu Poso',
    varietas: 'Ciliwung',
    komoditas: 'Padi Sawah',
    luasLahan: 8.0,
    perkiraanProduksi: 36.0,
    status: 'Pengajuan',
    tglPengajuan: '2026-07-02',
    kabupaten: 'Poso',
    latitude: -1.3958,
    longitude: 120.7525,
    labelQrCode: 'BINE-TP-PADI-CLWG-005'
  },
  {
    id: 'cert-6',
    noSertifikat: '521/192/Sert-Horti/2026',
    kategori: 'horti',
    namaProdusen: 'Kebun Pembibitan Cabe Donggala',
    varietas: 'Kencana',
    komoditas: 'Cabai Keriting',
    luasLahan: 1.5,
    perkiraanProduksi: 4.2,
    status: 'Sertifikat Terbit',
    tglPengajuan: '2026-05-20',
    tglTerbit: '2026-06-15',
    kabupaten: 'Donggala',
    latitude: -0.6622,
    longitude: 119.7431,
    labelQrCode: 'BINE-HT-CABAI-KENCANA-006',
    kadarAir: 11.2,
    kemurnian: 99.0,
    dayaTumbuh: 90.0
  }
];

// Seed Monitoring (Pengawasan Peredaran Benih)
export const initialMonitoring: Pengawasan[] = [
  {
    id: 'mon-1',
    kategori: 'pangan',
    namaPengecer: 'Kios Tani Subur Sigi',
    varietas: 'Inpari 32',
    komoditas: 'Padi Sawah',
    noLot: 'LOT-2026-PADI32-01',
    statusKelayakan: 'Layak Edar',
    tglPemeriksaan: '2026-06-10',
    petugas: 'Ir. H. Syarifudin, M.P.',
    kadarAir: 12.5,
    kemurnian: 99.1,
    dayaTumbuh: 91.0,
    catatan: 'Label segel utuh, kemasan kering, disimpan di rak beralas kayu. Sesuai standar.',
    kabupaten: 'Sigi',
    latitude: -1.0450,
    longitude: 119.9600
  },
  {
    id: 'mon-2',
    kategori: 'horti',
    namaPengecer: 'Toko Tani Makmur Palu',
    varietas: 'Lembah Palu',
    komoditas: 'Bawang Merah',
    noLot: 'LOT-2026-BWMHP-02',
    statusKelayakan: 'Layak Edar',
    tglPemeriksaan: '2026-06-15',
    petugas: 'Nurhaeni, S.P.',
    kadarAir: 13.1,
    kemurnian: 98.6,
    dayaTumbuh: 89.0,
    catatan: 'Kondisi umbi benih kering, tidak keriput, tidak ada gejala penyakit busuk leher batang.',
    kabupaten: 'Palu',
    latitude: -0.8988,
    longitude: 119.8820
  },
  {
    id: 'mon-3',
    kategori: 'pangan',
    namaPengecer: 'Distributor Benih Buol Sejahtera',
    varietas: 'Inpari 42',
    komoditas: 'Padi Sawah',
    noLot: 'LOT-2026-PADI42-99',
    statusKelayakan: 'Dalam Pengawasan',
    tglPemeriksaan: '2026-07-01',
    petugas: 'Hendrawan, S.P.',
    kadarAir: 14.2,
    kemurnian: 97.2,
    dayaTumbuh: 79.0,
    catatan: 'Kemasan lembab karena penyimpanan kurang sirkulasi udara, daya tumbuh mendekati batas minimum 80%. Direkomendasikan uji ulang lab.',
    kabupaten: 'Buol',
    latitude: 1.0125,
    longitude: 121.3917
  },
  {
    id: 'mon-4',
    kategori: 'horti',
    namaPengecer: 'Toko Sarana Tani Tolitoli',
    varietas: 'Tanjung-2',
    komoditas: 'Cabai Merah Besar',
    noLot: 'LOT-2026-CBI-TANJUNG2',
    statusKelayakan: 'Dilarang Edar',
    tglPemeriksaan: '2026-07-05',
    petugas: 'Nurhaeni, S.P.',
    kadarAir: 15.1,
    kemurnian: 95.0,
    dayaTumbuh: 65.0,
    catatan: 'Benih kedaluwarsa (Desember 2025). Label sobek dan daya tumbuh sangat rendah. Benih ditarik dari peredaran.',
    kabupaten: 'Tolitoli',
    latitude: 1.0378,
    longitude: 120.8122
  }
];

// Seed Cultivars (Kultivar)
export const initialCultivars: Kultivar[] = [
  {
    id: 'cult-1',
    kategori: 'pangan',
    namaVarietas: 'Inpari 32 HPR',
    komoditas: 'Padi Sawah',
    pemulia: 'Badan Litbang Pertanian',
    tglPelepasan: '2013-05-20',
    deskripsi: 'Varietas padi sawah irigasi dengan produktivitas tinggi, sangat digemari petani di Sulawesi Tengah karena rasa nasi pulen dan rendemen penggilingan yang tinggi.',
    keunggulan: ['Tahan Hama Wereng Batang Coklat Biotipe 1 & 2', 'Tahan penyakit Hawar Daun Bakteri patotipe III', 'Nasi pulen'],
    potensiHasil: '8.42 Ton / Hektar',
    tahanHama: ['Wereng Batang Coklat', 'Hawar Daun Bakteri']
  },
  {
    id: 'cult-2',
    kategori: 'horti',
    namaVarietas: 'Lembah Palu',
    komoditas: 'Bawang Merah',
    pemulia: 'Dinas Pertanian Sulteng & Balitbangtan',
    tglPelepasan: '2005-09-12',
    deskripsi: 'Varietas lokal spesifik lokasi lembah Palu. Merupakan bahan baku utama industri bawang goreng khas Palu yang sangat harum, renyah, dan tahan lama.',
    keunggulan: ['Kadar air rendah', 'Aroma sangat tajam & wangi khas', 'Daya simpan umbi hingga 5 bulan', 'Sangat cocok untuk digoreng'],
    potensiHasil: '6.5 - 9.0 Ton / Hektar',
    tahanHama: ['Penyakit layu fusarium', 'Kekeringan ekstrem']
  },
  {
    id: 'cult-3',
    kategori: 'pangan',
    namaVarietas: 'Bisi 18',
    komoditas: 'Jagung Hibrida',
    pemulia: 'PT. Bisi International',
    tglPelepasan: '2009-03-10',
    deskripsi: 'Benih jagung hibrida yang sangat populer untuk pakan ternak. Memiliki vigor kokoh, tongkol besar silindris, dan warna biji orange kemerahan.',
    keunggulan: ['Tahan rebah batang', 'Penutupan kelobot sangat rapat', 'Toleran terhadap kekeringan', 'Rendemen biji tinggi (84%)'],
    potensiHasil: '12.0 Ton / Hektar',
    tahanHama: ['Penyakit Bulai', 'Karat Daun']
  },
  {
    id: 'cult-4',
    kategori: 'horti',
    namaVarietas: 'Montong Palu',
    komoditas: 'Durian',
    pemulia: 'Lokal Parigi Moutong / Sulteng',
    tglPelepasan: '2011-12-05',
    deskripsi: 'Klona durian montong yang berkembang sangat baik di Sulawesi Tengah terutama di pesisir Parigi Moutong. Memiliki daging buah sangat tebal, manis legit, dan biji kempes.',
    keunggulan: ['Daging buah berwarna kuning emas', 'Tekstur kering berlemak', 'Bobot per buah dapat mencapai 6-10 kg', 'Aroma sedang tidak terlalu menusuk'],
    potensiHasil: '80 - 150 Buah / Pohon / Tahun',
    tahanHama: ['Penyakit kanker batang Phytophthora']
  },
  {
    id: 'cult-5',
    kategori: 'pangan',
    namaVarietas: 'Inpari 42 Agritan',
    komoditas: 'Padi Sawah',
    pemulia: 'Balai Besar Penelitian Tanaman Padi',
    tglPelepasan: '2016-10-14',
    deskripsi: 'Varietas unggul baru dengan keunggulan Green Super Rice (GSR) yang efisien dalam penggunaan pupuk dan air, sangat cocok untuk daerah tadah hujan di Sulteng.',
    keunggulan: ['Toleran keracunan Besi (Fe)', 'Tahan Hawar Daun Bakteri', 'Nasi pulen sedang', 'Hemat penggunaan pupuk N'],
    potensiHasil: '10.58 Ton / Hektar',
    tahanHama: ['Hama Wereng Coklat Biotipe 1', 'Hawar Daun Bakteri']
  }
];

// Seed News & Info (Berita)
export const initialNews: Berita[] = [
  {
    id: 'news-1',
    judul: 'Sosialisasi Sertifikasi Benih Tanaman Pangan di Kabupaten Sigi',
    tanggal: '2026-07-10',
    ringkasan: 'Dinas Tanaman Pangan dan Hortikultura Provinsi Sulawesi Tengah menyelenggarakan pembekalan sertifikasi mandiri bagi penangkar padi Sigi.',
    isi: 'SIGI — Dalam rangka meningkatkan ketersediaan benih bermutu di tingkat lokal, BPSBTPH Provinsi Sulawesi Tengah menggelar pembinaan bagi para produsen benih. Kepala Dinas menekankan bahwa benih bersertifikat berlabel biru merupakan jaminan peningkatan produksi padi hingga 15% dibanding menggunakan benih asalan. Kegiatan ini diikuti oleh 40 perwakilan kelompok tani di wilayah Sigi Biromaru.',
    kategori: 'Sertifikasi',
  },
  {
    id: 'news-2',
    judul: 'Pengawasan Peredaran Benih Bawang Merah Lembah Palu Jelang Musim Tanam',
    tanggal: '2026-07-08',
    ringkasan: 'Petugas Pengawas Benih Tanaman (PBT) memperketat pemeriksaan label kemasan bawang merah Lembah Palu di pengecer.',
    isi: 'PALU — Guna melindungi petani dari benih tiruan, Tim PBT Sulteng melaksanakan inspeksi mendadak ke berbagai toko sarana pertanian di Kota Palu dan Donggala. Dalam sidak ini, petugas memindai kode QR pada label kemasan menggunakan aplikasi BINE MABELO. Ditemukan 1 toko yang memajang benih tanpa sertifikasi resmi dan langsung diberikan surat teguran agar benih tersebut tidak diperjualbelikan.',
    kategori: 'Regulasi',
  },
  {
    id: 'news-3',
    judul: 'Mengenal Bawang Merah Lembah Palu: Varietas Unggulan Sulteng untuk Dunia',
    tanggal: '2026-07-01',
    ringkasan: 'Mengapa varietas lokal ini begitu istimewa? Karakteristik fisik dan aroma menjadikannya primadona bahan baku industri makanan.',
    isi: 'BAWANG MERAH LEMBAH PALU memiliki daya adaptasi luar biasa di tanah dataran Palu yang panas dan kering. Memiliki kandungan minyak atsiri yang tinggi dan kadar air yang sangat rendah membuat bawang goreng yang dihasilkan dari kultivar ini menjadi sangat renyah, manis alami tanpa campuran tepung, serta mampu bertahan berbulan-bulan tanpa tengik. Pemerintah Provinsi terus mendorong perluasan kawasan penangkaran benih bawang ini di Sigi dan Palu.',
    kategori: 'Hortikultura'
  }
];

// Seed Notifications
export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Pengajuan Sertifikasi Baru',
    description: 'Produsen Koperasi Tani Sintuvu Poso mengajukan sertifikasi benih Padi Ciliwung.',
    time: '2 jam yang lalu',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-2',
    title: 'Sertifikat Terbit',
    description: 'Sertifikat benih Cabai Kencana Donggala dengan nomor 521/192/Sert-Horti/2026 telah terbit.',
    time: '1 hari yang lalu',
    read: true,
    type: 'success'
  },
  {
    id: 'notif-3',
    title: 'Peringatan Pengawasan',
    description: 'Benih Cabai Tanjung-2 di Sarana Tani Tolitoli dilarang edar karena melewati masa kedaluwarsa.',
    time: '2 hari yang lalu',
    read: false,
    type: 'warning'
  }
];

// Seed History Log (Riwayat Kegiatan)
export const initialHistoryLogs: HistoryLog[] = [
  {
    id: 'log-1',
    user: 'Admin Utama (BTHP)',
    action: 'Penerbitan Sertifikat',
    details: 'Menerbitkan sertifikat benih No. 521/112/Sert-Horti/2026 untuk CV. Agro Lestari Palu',
    timestamp: '2026-06-08 14:20'
  },
  {
    id: 'log-2',
    user: 'Petugas Input Tanaman Pangan',
    action: 'Input Hasil Pemeriksaan',
    details: 'Menginput data pengawasan Kios Tani Subur Sigi (Layak Edar, Lot: LOT-2026-PADI32-01)',
    timestamp: '2026-06-10 11:15'
  },
  {
    id: 'log-3',
    user: 'Petugas Input Hortikultura',
    action: 'Pengajuan Sertifikasi',
    details: 'Menambahkan pengajuan sertifikasi baru untuk Penangkar Benih Durian Kasimbar (Montong Palu)',
    timestamp: '2026-06-18 16:45'
  }
];

// List of Central Sulawesi Districts (Kabupaten/Kota)
export const SULTENG_KABUPATEN = [
  'Palu',
  'Sigi',
  'Donggala',
  'Parigi Moutong',
  'Poso',
  'Tolitoli',
  'Buol',
  'Banggai',
  'Banggai Kepulauan',
  'Banggai Laut',
  'Morowali',
  'Morowali Utara',
  'Tojo Una-Una'
];

// District Locations for Maps Placement
export const DISTRICT_COORDS: Record<string, { lat: number, lng: number }> = {
  'Palu': { lat: -0.8917, lng: 119.8707 },
  'Sigi': { lat: -1.0333, lng: 119.9500 },
  'Donggala': { lat: -0.6622, lng: 119.7431 },
  'Parigi Moutong': { lat: -0.8311, lng: 120.1833 },
  'Poso': { lat: -1.3958, lng: 120.7525 },
  'Tolitoli': { lat: 1.0378, lng: 120.8122 },
  'Buol': { lat: 1.0125, lng: 121.3917 },
  'Banggai': { lat: -1.5833, lng: 122.7833 },
  'Banggai Kepulauan': { lat: -1.6167, lng: 123.1667 },
  'Banggai Laut': { lat: -1.9833, lng: 123.5333 },
  'Morowali': { lat: -2.0167, lng: 121.8333 },
  'Morowali Utara': { lat: -1.9811, lng: 121.3411 },
  'Tojo Una-Una': { lat: -1.2167, lng: 121.5000 }
};
