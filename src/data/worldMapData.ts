// Curated simplified GeoJSON land features for fast, hermetic, zero-network-dependency D3 world mapping
export interface GeoFeature {
  type: 'Feature';
  properties: {
    name: string;
    code: string;
    continent: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface GeoJsonData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface GlobalTrafficLocation {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  clicks: number;
  uniqueVisitors: number;
  topPlatform: 'Instagram' | 'TikTok' | 'WhatsApp' | 'YouTube' | 'X (Twitter)';
  activeNow: number;
}

export const GLOBAL_TRAFFIC_HUBS: GlobalTrafficLocation[] = [
  {
    id: 'hub-jkt',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Jakarta',
    coordinates: [106.8456, -6.2088],
    clicks: 8420,
    uniqueVisitors: 6910,
    topPlatform: 'Instagram',
    activeNow: 18,
  },
  {
    id: 'hub-sby',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Surabaya',
    coordinates: [112.7521, -7.2575],
    clicks: 4320,
    uniqueVisitors: 3540,
    topPlatform: 'TikTok',
    activeNow: 9,
  },
  {
    id: 'hub-bdg',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Bandung',
    coordinates: [107.6191, -6.9175],
    clicks: 3610,
    uniqueVisitors: 2980,
    topPlatform: 'Instagram',
    activeNow: 7,
  },
  {
    id: 'hub-mdn',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Medan',
    coordinates: [98.6722, 3.5952],
    clicks: 1980,
    uniqueVisitors: 1620,
    topPlatform: 'WhatsApp',
    activeNow: 4,
  },
  {
    id: 'hub-dps',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Denpasar (Bali)',
    coordinates: [115.2167, -8.6500],
    clicks: 1420,
    uniqueVisitors: 1180,
    topPlatform: 'TikTok',
    activeNow: 5,
  },
  {
    id: 'hub-mks',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Makassar',
    coordinates: [119.4327, -5.1477],
    clicks: 1250,
    uniqueVisitors: 1040,
    topPlatform: 'TikTok',
    activeNow: 3,
  },
  {
    id: 'hub-kul',
    country: 'Malaysia',
    countryCode: 'MY',
    city: 'Kuala Lumpur',
    coordinates: [101.6869, 3.1390],
    clicks: 940,
    uniqueVisitors: 820,
    topPlatform: 'Instagram',
    activeNow: 3,
  },
  {
    id: 'hub-sin',
    country: 'Singapura',
    countryCode: 'SG',
    city: 'Singapore',
    coordinates: [103.8198, 1.3521],
    clicks: 860,
    uniqueVisitors: 750,
    topPlatform: 'X (Twitter)',
    activeNow: 2,
  },
  {
    id: 'hub-tyo',
    country: 'Jepang',
    countryCode: 'JP',
    city: 'Tokyo',
    coordinates: [139.6917, 35.6895],
    clicks: 580,
    uniqueVisitors: 510,
    topPlatform: 'YouTube',
    activeNow: 2,
  },
  {
    id: 'hub-syd',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    coordinates: [151.2093, -33.8688],
    clicks: 490,
    uniqueVisitors: 430,
    topPlatform: 'Instagram',
    activeNow: 1,
  },
  {
    id: 'hub-lax',
    country: 'Amerika Serikat',
    countryCode: 'US',
    city: 'Los Angeles',
    coordinates: [-118.2437, 34.0522],
    clicks: 420,
    uniqueVisitors: 380,
    topPlatform: 'TikTok',
    activeNow: 2,
  },
  {
    id: 'hub-nyc',
    country: 'Amerika Serikat',
    countryCode: 'US',
    city: 'New York',
    coordinates: [-74.0060, 40.7128],
    clicks: 390,
    uniqueVisitors: 340,
    topPlatform: 'X (Twitter)',
    activeNow: 1,
  },
  {
    id: 'hub-lon',
    country: 'Inggris',
    countryCode: 'GB',
    city: 'London',
    coordinates: [-0.1278, 51.5074],
    clicks: 360,
    uniqueVisitors: 310,
    topPlatform: 'Instagram',
    activeNow: 1,
  },
  {
    id: 'hub-ruh',
    country: 'Arab Saudi',
    countryCode: 'SA',
    city: 'Riyadh',
    coordinates: [46.6753, 24.7136],
    clicks: 310,
    uniqueVisitors: 280,
    topPlatform: 'WhatsApp',
    activeNow: 2,
  },
  {
    id: 'hub-ams',
    country: 'Belanda',
    countryCode: 'NL',
    city: 'Amsterdam',
    coordinates: [4.9041, 52.3676],
    clicks: 280,
    uniqueVisitors: 250,
    topPlatform: 'YouTube',
    activeNow: 1,
  },
  {
    id: 'hub-sel',
    country: 'Korea Selatan',
    countryCode: 'KR',
    city: 'Seoul',
    coordinates: [126.9780, 37.5665],
    clicks: 260,
    uniqueVisitors: 230,
    topPlatform: 'TikTok',
    activeNow: 1,
  },
];

// Simplified polygons representing the global landmasses
export const WORLD_GEO_DATA: GeoJsonData = {
  type: 'FeatureCollection',
  features: [
    // Eurasia & North Africa Landmass
    {
      type: 'Feature',
      properties: { name: 'Eurasia', code: 'EA', continent: 'Eurasia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-9.5, 36.0], [3.0, 36.5], [10.0, 37.5], [26.0, 40.0], [36.0, 36.0],
          [35.0, 31.0], [44.0, 30.0], [50.0, 25.0], [60.0, 25.0], [68.0, 24.0],
          [72.0, 18.0], [77.0, 8.5], [80.0, 13.0], [88.0, 22.0], [92.0, 21.0],
          [98.5, 10.0], [103.5, 1.2], [104.0, 10.0], [108.0, 15.0], [109.0, 21.5],
          [120.0, 23.0], [121.5, 31.0], [126.0, 38.0], [130.0, 42.0], [140.0, 47.0],
          [142.0, 53.0], [150.0, 59.0], [162.0, 60.0], [170.0, 65.0], [180.0, 66.0],
          [170.0, 69.0], [140.0, 72.0], [100.0, 76.0], [80.0, 73.0], [60.0, 69.0],
          [40.0, 68.0], [28.0, 71.0], [15.0, 68.0], [5.0, 62.0], [8.0, 54.0],
          [2.0, 51.0], [-4.5, 48.0], [-9.0, 43.0], [-9.5, 36.0]
        ]]
      }
    },
    // Africa
    {
      type: 'Feature',
      properties: { name: 'Africa', code: 'AF', continent: 'Africa' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.0, 15.0], [-12.0, 26.0], [-5.0, 35.5], [10.0, 37.0], [25.0, 32.0],
          [32.0, 31.5], [35.0, 27.0], [43.0, 12.5], [51.0, 10.5], [41.0, -2.0],
          [39.0, -5.0], [40.5, -15.0], [35.0, -24.0], [32.0, -28.0], [28.0, -32.5],
          [18.5, -34.8], [15.0, -28.0], [12.0, -17.0], [9.0, -1.0], [3.0, 5.0],
          [-4.0, 5.5], [-15.0, 11.0], [-17.0, 15.0]
        ]]
      }
    },
    // North America
    {
      type: 'Feature',
      properties: { name: 'North America', code: 'NA', continent: 'North America' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-168.0, 66.0], [-155.0, 71.0], [-130.0, 70.0], [-110.0, 72.0], [-80.0, 74.0],
          [-65.0, 60.0], [-55.0, 52.0], [-60.0, 46.0], [-70.0, 43.0], [-75.0, 35.0],
          [-80.5, 25.0], [-82.0, 29.0], [-90.0, 29.5], [-97.5, 26.0], [-97.0, 20.0],
          [-90.0, 16.0], [-83.0, 9.0], [-77.0, 7.5], [-85.0, 13.0], [-95.0, 16.0],
          [-105.0, 20.0], [-110.0, 24.0], [-117.0, 32.5], [-124.0, 40.0], [-124.5, 48.0],
          [-135.0, 57.0], [-150.0, 60.0], [-165.0, 60.0], [-168.0, 66.0]
        ]]
      }
    },
    // South America
    {
      type: 'Feature',
      properties: { name: 'South America', code: 'SA', continent: 'South America' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-77.0, 8.0], [-72.0, 11.5], [-60.0, 8.5], [-50.0, 0.0], [-35.0, -5.0],
          [-37.0, -12.0], [-40.0, -22.0], [-48.0, -28.0], [-55.0, -35.0], [-65.0, -42.0],
          [-66.0, -54.0], [-74.0, -52.0], [-74.0, -42.0], [-71.0, -30.0], [-70.0, -18.0],
          [-81.0, -5.0], [-80.0, 1.0], [-77.0, 8.0]
        ]]
      }
    },
    // Australia
    {
      type: 'Feature',
      properties: { name: 'Australia', code: 'AU', continent: 'Oceania' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [114.0, -22.0], [122.0, -16.0], [130.0, -12.0], [136.0, -12.0], [142.0, -10.5],
          [146.0, -19.0], [153.5, -28.0], [150.0, -35.0], [146.0, -39.0], [138.0, -35.0],
          [130.0, -32.0], [116.0, -34.5], [113.0, -26.0], [114.0, -22.0]
        ]]
      }
    },
    // Indonesia & Maritime Southeast Asia (Detailed archipelago representation)
    {
      type: 'Feature',
      properties: { name: 'Sumatra', code: 'ID-SM', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [95.2, 5.6], [98.6, 3.6], [101.5, 0.5], [105.8, -5.8], [104.5, -5.2],
          [102.0, -3.8], [98.5, -1.5], [96.0, 2.0], [95.2, 5.6]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Java', code: 'ID-JW', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [105.2, -6.0], [106.8, -6.1], [108.5, -6.8], [112.8, -7.2], [114.4, -7.7],
          [114.4, -8.7], [111.0, -8.2], [107.5, -7.7], [105.8, -6.9], [105.2, -6.0]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Kalimantan', code: 'ID-KA', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [109.0, 0.5], [111.5, 2.5], [117.5, 4.2], [118.5, 2.0], [117.2, -1.2],
          [116.0, -3.8], [114.5, -3.5], [111.0, -2.8], [109.0, -1.8], [109.0, 0.5]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Sulawesi', code: 'ID-SL', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [119.8, -0.5], [120.5, 1.2], [125.0, 1.6], [123.0, 0.2], [121.5, -1.8],
          [123.0, -3.8], [121.5, -5.5], [119.5, -5.5], [119.0, -3.0], [119.8, -0.5]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Papua', code: 'ID-PA', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [131.0, -0.8], [134.0, -1.5], [141.0, -2.5], [141.0, -9.0], [138.0, -7.0],
          [135.0, -4.5], [131.5, -3.0], [131.0, -0.8]
        ]]
      }
    },
    // Japan
    {
      type: 'Feature',
      properties: { name: 'Japan', code: 'JP', continent: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [130.0, 31.0], [131.5, 33.5], [136.0, 35.0], [140.0, 36.5], [141.5, 41.0],
          [145.0, 44.0], [141.0, 45.0], [139.5, 41.5], [136.5, 36.5], [132.0, 34.0],
          [130.0, 31.0]
        ]]
      }
    },
    // United Kingdom
    {
      type: 'Feature',
      properties: { name: 'United Kingdom', code: 'GB', continent: 'Europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-5.5, 50.0], [1.5, 51.5], [0.2, 53.5], [-2.0, 57.5], [-5.0, 58.5],
          [-6.0, 55.0], [-3.0, 53.5], [-5.0, 51.5], [-5.5, 50.0]
        ]]
      }
    }
  ]
};
