import React, { useState, useMemo } from 'react';
import { MapPin, Info, Layers, Navigation, Plus, Search, Filter, Wheat, Sprout, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Sertifikasi, Pengawasan } from '../types';
import { DISTRICT_COORDS, SULTENG_KABUPATEN } from '../data';

interface PetaLokasiProps {
  certifications: Sertifikasi[];
  monitoringList: Pengawasan[];
  onSelectItem?: (type: 'cert' | 'mon', id: string) => void;
  userRole: string;
}

export default function PetaLokasi({ certifications, monitoringList, onSelectItem, userRole }: PetaLokasiProps) {
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<'semua' | 'pangan' | 'horti'>('semua');
  const [typeFilter, setTypeFilter] = useState<'semua' | 'sertifikasi' | 'pengawasan'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'cert' | 'mon'; data: any } | null>(null);

  // Map coordinates scaling helper
  // Sulteng latitude is roughly -2.5 to 1.5, longitude is 119.5 to 124.0
  const mapWidth = 600;
  const mapHeight = 450;
  
  const scaleCoords = (lat: number, lng: number) => {
    // Standard linear scaling to convert lat/lng to SVG pixels
    const minLng = 119.0;
    const maxLng = 124.0;
    const minLat = -2.5;
    const maxLat = 1.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    // SVG y goes down, lat goes up
    const y = mapHeight - (((lat - minLat) / (maxLat - minLat)) * mapHeight);
    
    return { x, y };
  };

  // Compile active points on the map
  const mapPoints = useMemo(() => {
    const points: Array<{
      id: string;
      type: 'cert' | 'mon';
      kategori: 'pangan' | 'horti';
      title: string;
      subtitle: string;
      komoditas: string;
      varietas: string;
      kabupaten: string;
      status: string;
      lat: number;
      lng: number;
      originalData: any;
    }> = [];

    // Add certifications
    if (typeFilter === 'semua' || typeFilter === 'sertifikasi') {
      certifications.forEach(cert => {
        if (categoryFilter === 'semua' || cert.kategori === categoryFilter) {
          if (selectedKabupaten === 'Semua' || cert.kabupaten === selectedKabupaten) {
            points.push({
              id: cert.id,
              type: 'cert',
              kategori: cert.kategori,
              title: cert.namaProdusen,
              subtitle: cert.noSertifikat,
              komoditas: cert.komoditas,
              varietas: cert.varietas,
              kabupaten: cert.kabupaten,
              status: cert.status,
              lat: cert.latitude,
              lng: cert.longitude,
              originalData: cert
            });
          }
        }
      });
    }

    // Add monitoring
    if (typeFilter === 'semua' || typeFilter === 'pengawasan') {
      monitoringList.forEach(mon => {
        if (categoryFilter === 'semua' || mon.kategori === categoryFilter) {
          if (selectedKabupaten === 'Semua' || mon.kabupaten === selectedKabupaten) {
            points.push({
              id: mon.id,
              type: 'mon',
              kategori: mon.kategori,
              title: mon.namaPengecer,
              subtitle: `Lot: ${mon.noLot}`,
              komoditas: mon.komoditas,
              varietas: mon.varietas,
              kabupaten: mon.kabupaten,
              status: mon.statusKelayakan,
              lat: mon.latitude,
              lng: mon.longitude,
              originalData: mon
            });
          }
        }
      });
    }

    // Apply Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return points.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.komoditas.toLowerCase().includes(q) || 
        p.varietas.toLowerCase().includes(q) || 
        p.kabupaten.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
      );
    }

    return points;
  }, [certifications, monitoringList, selectedKabupaten, categoryFilter, typeFilter, searchQuery]);

  const handlePointClick = (point: any) => {
    setSelectedItem({
      type: point.type,
      data: point.originalData
    });
  };

  return (
    <div id="peta-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-5">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-xs">
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Kontrol Peta Lokasi</span>
          </h3>

          <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
              <input
                id="map-search"
                type="text"
                placeholder="Cari produsen, varietas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>

            {/* Filter Kabupaten */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500">Pilih Wilayah Kabupaten</label>
              <select
                id="map-filter-kab"
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden dark:text-white"
              >
                <option value="Semua">Semua Wilayah (Sulteng)</option>
                {SULTENG_KABUPATEN.map(kab => (
                  <option key={kab} value={kab}>{kab}</option>
                ))}
              </select>
            </div>

            {/* Filter Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500">Kategori Benih</label>
              <div className="grid grid-cols-3 gap-2">
                {(['semua', 'pangan', 'horti'] as const).map(cat => (
                  <button
                    key={cat}
                    id={`btn-cat-${cat}`}
                    onClick={() => setCategoryFilter(cat)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg capitalize border transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {cat === 'semua' ? 'Semua' : cat === 'pangan' ? 'Pangan' : 'Horti'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tipe Data */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500">Tipe Data Lokasi</label>
              <div className="grid grid-cols-3 gap-2">
                {(['semua', 'sertifikasi', 'pengawasan'] as const).map(type => (
                  <button
                    key={type}
                    id={`btn-type-${type}`}
                    onClick={() => setTypeFilter(type)}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg capitalize border transition-all cursor-pointer ${
                      typeFilter === type
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {type === 'semua' ? 'Semua' : type === 'sertifikasi' ? 'Sertifikasi' : 'Monitoring'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Pin Details Box */}
        {selectedItem ? (
          <div id="map-detail-card" className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                  selectedItem.type === 'cert' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50' 
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50'
                }`}>
                  {selectedItem.type === 'cert' ? 'Sertifikasi' : 'Monitoring Peredaran'}
                </span>
                <span className="ml-1.5 text-xs text-neutral-400 font-medium">
                  {selectedItem.data.kabupaten}
                </span>
              </div>
              <button 
                id="close-map-detail"
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                {selectedItem.type === 'cert' ? selectedItem.data.namaProdusen : selectedItem.data.namaPengecer}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {selectedItem.type === 'cert' ? selectedItem.data.noSertifikat : `No Lot: ${selectedItem.data.noLot}`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100/50 dark:border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Komoditas / Varietas</span>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 mt-0.5">
                  {selectedItem.data.kategori === 'pangan' ? <Wheat className="w-3.5 h-3.5 text-amber-500" /> : <Sprout className="w-3.5 h-3.5 text-emerald-500" />}
                  {selectedItem.data.komoditas} ({selectedItem.data.varietas})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Status</span>
                <span className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${
                  selectedItem.data.status === 'Sertifikat Terbit' || selectedItem.data.statusKelayakan === 'Layak Edar'
                    ? 'text-emerald-600'
                    : selectedItem.data.status === 'Ditolak' || selectedItem.data.statusKelayakan === 'Dilarang Edar'
                    ? 'text-red-600'
                    : 'text-amber-500'
                }`}>
                  {selectedItem.type === 'cert' ? selectedItem.data.status : selectedItem.data.statusKelayakan}
                </span>
              </div>

              {selectedItem.data.luasLahan && (
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Luas Lahan</span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {selectedItem.data.luasLahan} Ha
                  </span>
                </div>
              )}
              {selectedItem.data.perkiraanProduksi && (
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Est. Produksi</span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {selectedItem.data.perkiraanProduksi} Ton
                  </span>
                </div>
              )}
              {selectedItem.data.dayaTumbuh && (
                <div className="col-span-2 pt-1 border-t border-neutral-100 dark:border-neutral-700 flex justify-between">
                  <span className="text-[10px] text-neutral-400">Uji Benih (KA / Murni / Tumbuh):</span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {selectedItem.data.kadarAir}% / {selectedItem.data.kemurnian}% / {selectedItem.data.dayaTumbuh}%
                  </span>
                </div>
              )}
            </div>

            {selectedItem.data.catatan && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-amber-50/40 dark:bg-amber-950/10 p-2.5 rounded-lg border border-amber-100/20">
                &ldquo;{selectedItem.data.catatan}&rdquo;
              </p>
            )}

            <div className="flex gap-2">
              {onSelectItem && (
                <button
                  id="view-full-detail-btn"
                  onClick={() => onSelectItem(selectedItem.type, selectedItem.data.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Detail Lengkap</span>
                </button>
              )}
              <a
                href={`https://maps.google.com/?q=${selectedItem.data.latitude},${selectedItem.data.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigasi GPS</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl p-6 border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <MapPin className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="text-xs font-semibold text-neutral-500">Pilih pin di peta untuk melihat detail lokasi secara real-time.</h4>
            <p className="text-[10px] text-neutral-400">Peta interaktif memantau persebaran sertifikasi mandiri dan audit berkala peredaran benih tanaman pangan di Sulteng.</p>
          </div>
        )}
      </div>

      {/* SVG Interactive Map Column */}
      <div className="lg:col-span-8 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden relative flex flex-col justify-between">
        
        {/* Map Header */}
        <div className="p-4 bg-neutral-900/85 border-b border-neutral-800 flex justify-between items-center z-10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              Sistem GIS BINE MABELO (Sulawesi Tengah)
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Memantau {mapPoints.length} Titik Lokasi Terdaftar</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Pangan
            </span>
            <span className="flex items-center gap-1 text-violet-400 font-semibold">
              <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
              Hortikultura
            </span>
          </div>
        </div>

        {/* Map Stage */}
        <div id="svg-map-stage" className="flex-1 flex items-center justify-center p-4 relative min-h-[350px] bg-radial from-neutral-850 to-neutral-900">
          
          {/* Compass Rose */}
          <div className="absolute right-6 bottom-6 opacity-30 flex flex-col items-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-dashed border-neutral-500 rounded-full flex items-center justify-center text-[9px] font-bold text-neutral-400 font-mono">U</div>
            <div className="h-4 w-[1px] bg-neutral-500 mt-1"></div>
          </div>

          <svg 
            viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
            className="w-full max-w-[550px] aspect-4/3 relative"
          >
            {/* Outline of Central Sulawesi (Sulteng) */}
            {/* Drawn beautifully representing the Palu valley, Sigi, Donggala, Parigi, Poso, Ampana, Luwuk, Morowali, and the Northern arms */}
            <path
              id="sulteng-main-island"
              d="M 50,220 
                 C 70,200 90,190 110,180
                 C 120,185 140,200 150,210 
                 C 155,200 170,190 185,185
                 C 200,180 230,190 250,200
                 C 270,180 300,170 320,175
                 C 335,180 345,190 350,200
                 C 370,195 390,190 410,195
                 C 430,200 460,210 490,205
                 C 510,210 530,220 550,230
                 C 540,240 520,245 500,245
                 C 480,240 450,230 430,225
                 C 410,230 380,245 365,255
                 C 350,265 330,285 340,300
                 C 345,310 355,320 370,325
                 C 390,320 420,310 440,315
                 C 460,320 480,335 500,340
                 C 480,350 450,355 430,350
                 C 410,340 380,330 360,340
                 C 340,350 320,360 305,370
                 C 290,380 280,390 270,410
                 C 260,420 250,430 240,440
                 C 230,420 235,390 230,370
                 C 225,350 200,335 180,330
                 C 170,320 160,300 150,290
                 C 140,280 120,260 110,240
                 C 105,230 90,225 80,220
                 Z"
              className="fill-neutral-800 stroke-neutral-700 stroke-2 hover:fill-neutral-750 transition-colors duration-500 cursor-pointer"
              onClick={() => setSelectedKabupaten('Semua')}
            />

            {/* Sigi, Palu, Donggala Gulf Area Detail */}
            <path
              id="palu-gulf-detail"
              d="M 110,180 C 108,190 106,200 108,210 C 110,220 112,230 115,240"
              className="fill-none stroke-emerald-600/35 stroke-3 stroke-dasharray-[4,4]"
            />

            {/* Clickable Area Overlay circles for major districts (Kabupaten) to filter */}
            {Object.entries(DISTRICT_COORDS).map(([kab, val]) => {
              const coords = val as { lat: number; lng: number };
              const { x, y } = scaleCoords(coords.lat, coords.lng);
              const isSelected = selectedKabupaten === kab;
              
              return (
                <g key={kab} className="group cursor-pointer">
                  {/* Outer circle for hover/active state */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 16 : 10}
                    className={`transition-all duration-300 ${
                      isSelected 
                        ? 'fill-emerald-500/20 stroke-emerald-500 stroke-2' 
                        : 'fill-neutral-700/40 stroke-neutral-500/50 hover:stroke-white hover:fill-emerald-600/10'
                    }`}
                    onClick={() => setSelectedKabupaten(kab)}
                  />
                  {/* Center Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={3}
                    className={`fill-white ${isSelected ? 'fill-emerald-400 r-4 animate-pulse' : 'group-hover:fill-emerald-400'}`}
                  />
                  {/* Label (Shows on hover or if selected) */}
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    className={`font-sans font-medium text-[9px] pointer-events-none transition-all duration-300 ${
                      isSelected 
                        ? 'fill-emerald-400 font-bold scale-110' 
                        : 'fill-neutral-400 group-hover:fill-white'
                    }`}
                  >
                    {kab}
                  </text>
                </g>
              );
            })}

            {/* Pins representing active Certifications and Monitoring locations */}
            {mapPoints.map(point => {
              const { x, y } = scaleCoords(point.lat, point.lng);
              const isPointSelected = selectedItem && selectedItem.data.id === point.id;
              
              let markerColor = 'fill-emerald-500';
              let ringColor = 'stroke-emerald-400';
              if (point.type === 'mon') {
                markerColor = 'fill-violet-500';
                ringColor = 'stroke-violet-400';
              }
              if (point.status === 'Ditolak' || point.status === 'Dilarang Edar') {
                markerColor = 'fill-red-500';
                ringColor = 'stroke-red-400';
              } else if (point.status === 'Dalam Pengawasan' || point.status === 'Pengajuan') {
                markerColor = 'fill-amber-500';
                ringColor = 'stroke-amber-400';
              }

              return (
                <g 
                  key={point.id} 
                  className="cursor-pointer group/pin"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePointClick(point);
                  }}
                >
                  {/* Ripple Ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isPointSelected ? 12 : 6}
                    className={`fill-none ${ringColor} stroke-2 opacity-75 group-hover/pin:animate-ping`}
                  />
                  {/* Pine Head Pin */}
                  <path
                    d={`M ${x},${y} m 0,-10 c -4,0 -7,3 -7,7 c 0,5 7,11 7,11 c 0,0 7,-6 7,-11 c 0,-4 -3,-7 -7,-7 z`}
                    className={`${markerColor} transition-all duration-300 ${isPointSelected ? 'scale-125' : 'group-hover/pin:scale-110'}`}
                    transform-origin={`${x} ${y}`}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={x}
                    cy={y - 6}
                    r={2.5}
                    className="fill-white"
                  />
                </g>
              );
            })}
          </svg>

          {/* Map Overlay HUD controls */}
          <div className="absolute left-4 bottom-4 bg-neutral-900/90 backdrop-blur-xs p-3 rounded-xl border border-neutral-800 text-xs space-y-2 pointer-events-auto">
            <h5 className="font-bold text-neutral-300">Suhu & Lokasi GPS</h5>
            <div className="space-y-1 font-mono text-[10px] text-neutral-400">
              <p>GPS: -0.8917 S, 119.8707 E</p>
              <p>Presisi: &plusmn; 4 meter (Akurat)</p>
              <p>Ketinggian: 82m dpl (Palu)</p>
            </div>
            {userRole !== 'public' && (
              <button
                id="gps-locate-btn"
                onClick={() => {
                  alert("GPS Berhasil Disinkronisasikan! Lokasi Anda diidentifikasi berada di Palu, Sigi, Sulawesi Tengah.");
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-1 rounded-sm text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Navigation className="w-3 h-3" />
                <span>Simulasi GPS</span>
              </button>
            )}
          </div>
        </div>

        {/* Map Footer Info */}
        <div className="p-3 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <p className="flex items-center gap-1.5 font-sans">
            <Info className="w-3.5 h-3.5 text-emerald-500" />
            <span>Klik pin atau nama wilayah kabupaten untuk pemetaan data sertifikasi.</span>
          </p>
          <span className="font-mono text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
            v1.2.0-GIS
          </span>
        </div>
      </div>
    </div>
  );
}
