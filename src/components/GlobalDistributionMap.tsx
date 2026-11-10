import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { GLOBAL_TRAFFIC_HUBS, GlobalTrafficLocation } from '../data/worldMapData';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Search, 
  Radio, 
  ExternalLink, 
  Play, 
  CheckCircle2,
  Maximize2,
  Flame
} from 'lucide-react';

type TileTheme = 'roadmap' | 'satellite' | 'streets';

export const GlobalDistributionMap: React.FC = () => {
  const { clickEvents, simulateInstantClick } = useAnalytics();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTheme, setActiveTheme] = useState<TileTheme>('roadmap');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedHub, setSelectedHub] = useState<GlobalTrafficLocation | null>(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState<boolean>(false);

  // Aggregate static hubs with context click events
  const aggregatedHubs = useMemo(() => {
    const hubMap = new Map<string, GlobalTrafficLocation>();
    GLOBAL_TRAFFIC_HUBS.forEach((h) => {
      hubMap.set(h.city.toLowerCase(), { ...h });
    });

    clickEvents.forEach((evt) => {
      const cityKey = evt.city.toLowerCase();
      const existing = hubMap.get(cityKey);
      if (existing) {
        existing.clicks += 1;
        existing.activeNow += 1;
      }
    });

    return Array.from(hubMap.values());
  }, [clickEvents]);

  const totalGlobalClicks = aggregatedHubs.reduce((sum, h) => sum + h.clicks, 0);

  // Map Tile Providers
  const tileConfigs: Record<TileTheme, { url: string; subdomains?: string[]; labelsUrl?: string }> = {
    roadmap: {
      // Carto Voyager: Clean roadmap aesthetic matching Google Maps
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    },
    satellite: {
      // Esri World Imagery (High-res Satellite)
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labelsUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    },
    streets: {
      // Standard OpenStreetMap / Street view
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
    },
  };

  // Helper to create iconic Google Maps red teardrop pin SVG HTML
  const createGoogleMapsPinIcon = (hub: GlobalTrafficLocation, isSelected: boolean) => {
    const size = isSelected ? 44 : 36;
    const badgeText = hub.clicks > 1000 ? `${(hub.clicks / 1000).toFixed(1)}k` : `${hub.clicks}`;

    const html = `
      <div class="relative group cursor-pointer" style="width: ${size}px; height: ${size + 14}px; transform: translate(-50%, -100%);">
        <!-- Google Maps Teardrop Pin -->
        <svg viewBox="0 0 384 512" class="w-full h-full drop-shadow-md transition-transform duration-200 group-hover:scale-110">
          <!-- Pin body -->
          <path fill="#EA4335" stroke="#C5221F" stroke-width="8" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z" />
          <!-- White Center Circle -->
          <circle cx="192" cy="192" r="70" fill="#ffffff" />
          <!-- Platform Color Core Dot -->
          <circle cx="192" cy="192" r="40" fill="#1A73E8" />
        </svg>

        <!-- Metric Click Badge -->
        <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 border border-slate-300 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-sm whitespace-nowrap">
          ${badgeText}
        </div>

        <!-- Animated Pulse Ring for Active Traffic -->
        ${hub.activeNow > 2 ? `
          <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75 pointer-events-none"></div>
        ` : ''}
      </div>
    `;

    return L.divIcon({
      className: 'gmaps-custom-marker',
      html,
      iconSize: [size, size + 14],
      iconAnchor: [size / 2, size + 14],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Indonesia & Southeast Asia (approx Lat: -2.5, Lng: 118)
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118],
        zoom: 4,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false, // We render custom Google Maps style zoom controls
        attributionControl: false,
      });

      // Base tile layer (Google Maps style)
      const tileLayer = L.tileLayer(tileConfigs[activeTheme].url, {
        subdomains: tileConfigs[activeTheme].subdomains || 'abc',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
        labelsLayerRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove old layers
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);

    const config = tileConfigs[activeTheme];
    const newBase = L.tileLayer(config.url, {
      subdomains: config.subdomains || 'abc',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = newBase;

    if (config.labelsUrl) {
      const labels = L.tileLayer(config.labelsUrl, {
        subdomains: ['a', 'b', 'c', 'd'],
        maxZoom: 19,
      }).addTo(map);
      labelsLayerRef.current = labels;
    }
  }, [activeTheme]);

  // Update Markers or Heatmap
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    aggregatedHubs.forEach((hub) => {
      // In Leaflet coordinates are [Latitude, Longitude]
      const lat = hub.coordinates[1];
      const lng = hub.coordinates[0];
      const isSelected = selectedHub?.id === hub.id;

      if (isHeatmapMode) {
        const radius = Math.max(40000, Math.min(300000, hub.clicks * 55));
        const color = hub.clicks > 1500 ? '#EF4444' : hub.clicks > 500 ? '#F97316' : '#EAB308';
        
        const circle = L.circle([lat, lng], {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.42,
          weight: 1.5,
        });

        circle.on('click', () => {
          setSelectedHub(hub);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
          }
        });
        markersGroup.addLayer(circle);

        const centerDot = L.circleMarker([lat, lng], {
          radius: 6,
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 1,
          weight: 2,
        });
        markersGroup.addLayer(centerDot);
      } else {
        const marker = L.marker([lat, lng], {
          icon: createGoogleMapsPinIcon(hub, isSelected),
          title: `${hub.city}, ${hub.country}`,
        });

        marker.on('click', () => {
          setSelectedHub(hub);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
          }
        });

        markersGroup.addLayer(marker);
      }
    });
  }, [aggregatedHubs, selectedHub, isHeatmapMode]);

  // Map Controls Helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetToIndonesia = () => {
    setSelectedHub(null);
    mapInstanceRef.current?.flyTo([-2.5, 118], 5, { duration: 1 });
  };

  const handleResetToWorld = () => {
    setSelectedHub(null);
    mapInstanceRef.current?.flyTo([15, 20], 2, { duration: 1.2 });
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    if (cityName === 'all') {
      handleResetToIndonesia();
      return;
    }
    const hub = aggregatedHubs.find((h) => h.city.toLowerCase() === cityName.toLowerCase());
    if (hub && mapInstanceRef.current) {
      setSelectedHub(hub);
      mapInstanceRef.current.flyTo([hub.coordinates[1], hub.coordinates[0]], 10, { duration: 1 });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Peta Sebaran Trafik Pengunjung (Tampilan Google Maps)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peta jalan & satelit interaktif untuk memantau titik lokasi pengunjung yang mengklik tautan medsos Anda
          </p>
        </div>

        {/* Pin vs Heatmap Toggle & Quick View Presets */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setIsHeatmapMode(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isHeatmapMode
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              🗺️ Pin Lokasi
            </button>
            <button
              onClick={() => setIsHeatmapMode(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                isHeatmapMode
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>🔥 Heatmap Kepadatan</span>
            </button>
          </div>

          <button
            onClick={handleResetToIndonesia}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
          >
            Fokus ID
          </button>
          <button
            onClick={handleResetToWorld}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
          >
            Global
          </button>
        </div>
      </div>

      {/* Interactive Map Viewport with Google Maps Controls */}
      <div className="relative w-full h-80 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Google Maps Style Top-Left Search / Jump Bar */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-1.5 pl-3">
          <Search className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCity}
            onChange={(e) => handleCitySelect(e.target.value)}
            className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none pr-3 cursor-pointer"
          >
            <option value="all">Cari / Lompat ke Kota...</option>
            {aggregatedHubs.map((hub) => (
              <option key={hub.id} value={hub.city}>
                {hub.city} ({hub.country}) - {hub.clicks.toLocaleString('id-ID')} klik
              </option>
            ))}
          </select>
        </div>

        {/* Google Maps Style Bottom-Left Map Type Switcher */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-1 gap-1">
          <button
            onClick={() => setActiveTheme('roadmap')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTheme === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Peta Jalan
          </button>
          <button
            onClick={() => setActiveTheme('satellite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTheme === 'satellite'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Satelit
          </button>
          <button
            onClick={() => setActiveTheme('streets')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTheme === 'streets'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Google Maps Style Bottom-Right Zoom & Navigation Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Perbesar Peta"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Perkecil Peta"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Google Maps InfoWindow Popup Card */}
        {selectedHub && (
          <div className="absolute top-14 left-3 sm:left-4 z-20 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedHub.city}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedHub.country} ({selectedHub.countryCode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHub(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Total Klik</span>
                <div className="text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {selectedHub.clicks.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Pengunjung Aktif</span>
                <div className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {selectedHub.activeNow}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between mb-3">
              <span>Medsos Paling Sering:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedHub.topPlatform}
              </span>
            </div>

            <button
              onClick={() => simulateInstantClick({ city: selectedHub.city })}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulasikan Klik dari {selectedHub.city}</span>
            </button>
          </div>
        )}
      </div>

      {/* Country Leaderboard Cards */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Peringkat Negara Asal Trafik Medsos
          </h4>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Total {totalGlobalClicks.toLocaleString('id-ID')} Klik Global
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { country: 'Indonesia', code: 'ID', clicks: 21000, active: 43 },
            { country: 'Malaysia', code: 'MY', clicks: 940, active: 3 },
            { country: 'Singapura', code: 'SG', clicks: 860, active: 2 },
            { country: 'Jepang', code: 'JP', clicks: 580, active: 2 },
            { country: 'Amerika Serikat', code: 'US', clicks: 810, active: 3 },
          ].map((item, idx) => {
            const share = Math.round((item.clicks / totalGlobalClicks) * 100);
            return (
              <div
                key={item.country}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                    {item.country}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item.active} online
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {item.clicks.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {share}%
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(share * 1.2, 100)}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
