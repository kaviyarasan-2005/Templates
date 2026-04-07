/**
 * maps.js
 * Leaflet.js Initialization
 */

export function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Make sure Leaflet is loaded globally by CDN
  if (typeof L === 'undefined') {
    console.error('Leaflet.js not loaded. Include CDN link in HTML.');
    return;
  }

  // Base Map configuration (Coordinates for dummy base location)
  const map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US roughly

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Sample Markers
  const locations = [
    { name: 'Yosemite Basecamp', coords: [37.8651, -119.5383] },
    { name: 'Grand Canyon Post', coords: [36.0544, -112.1401] },
    { name: 'Yellowstone Hub', coords: [44.4280, -110.5885] }
  ];

  // Custom Icon (Olive color placeholder SVG)
  const oliveIcon = L.divIcon({
    className: 'custom-map-icon',
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#596E53"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  });

  locations.forEach(loc => {
    L.marker(loc.coords, { icon: oliveIcon })
      .addTo(map)
      .bindPopup(`<b>${loc.name}</b><br>Available RVs: 5+`);
  });
}
