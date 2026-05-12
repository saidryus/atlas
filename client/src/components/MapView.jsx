import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_COLORS = { gym: '#f97316', park: '#22c55e', court: '#3b82f6', store: '#a855f7' };
const CEBU_CENTER = [10.3157, 123.8854];

function categoryIcon(category) {
  const color = CATEGORY_COLORS[category] || '#22c55e';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

// Heatmap circles overlay
function HeatmapLayer({ locations }) {
  return (
    <>
      {locations.map((loc) => {
        const intensity = Math.min((loc.checkInCount || 0) / 50, 1);
        const radius = 80 + intensity * 200;
        const opacity = 0.1 + intensity * 0.35;
        const color = CATEGORY_COLORS[loc.category] || '#22c55e';
        return (
          <Circle
            key={loc._id}
            center={[loc.latitude, loc.longitude]}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: opacity, weight: 0 }}
          />
        );
      })}
    </>
  );
}

export default function MapView({ locations, userLocation, showHeatmapToggle = false }) {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : CEBU_CENTER;
  const [heatmap, setHeatmap] = useState(false);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={14} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {heatmap && <HeatmapLayer locations={locations} />}

        {locations.map((loc) => (
          <Marker key={loc._id} position={[loc.latitude, loc.longitude]} icon={categoryIcon(loc.category)}>
            <Popup>
              <div className="text-sm min-w-[160px]">
                {loc.images?.[0] && (
                  <img src={loc.images[0]} alt={loc.name} className="w-full h-20 object-cover rounded mb-2" />
                )}
                <p className="font-semibold text-gray-900">{loc.name}</p>
                <p className="text-gray-500 text-xs">{loc.area}</p>
                <p className="text-yellow-500 text-xs mt-0.5">★ {loc.rating?.toFixed(1)}</p>
                {loc.checkInCount > 0 && (
                  <p className="text-gray-400 text-xs">{loc.checkInCount} check-ins</p>
                )}
                <Link to={`/location/${loc._id}`} className="text-green-600 text-xs underline mt-1.5 block font-medium">
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: '',
              html: '<div style="background:#22c55e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(34,197,94,0.3)"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Heatmap toggle */}
      {showHeatmapToggle && (
        <button
          onClick={() => setHeatmap(!heatmap)}
          className={`absolute top-3 right-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-md ${
            heatmap
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-gray-900/90 text-white/70 border-white/20 hover:bg-gray-800'
          }`}
        >
          <Layers size={13} />
          Heatmap
        </button>
      )}

      {/* Legend */}
      {showHeatmapToggle && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          <div className="flex flex-col gap-1">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[10px] text-white/60 capitalize">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
