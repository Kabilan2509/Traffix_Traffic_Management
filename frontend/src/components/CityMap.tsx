"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { MapPin, Activity } from "lucide-react";

// Fix for custom icons in Leaflet without static assets
const createIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid ${color === '#EF4444' ? '#991B1B' : '#047857'};
        box-shadow: 0 0 10px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        animation: ${color === '#EF4444' ? 'pulse 2s infinite' : 'none'};
      "></div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const getColorCode = (level: string) => {
    switch (level.toLowerCase()) {
        case 'red': return '#EF4444'; // Heavy
        case 'yellow': return '#F59E0B'; // Moderate
        case 'green': return '#10B981'; // Low
        default: return '#3B82F6';
    }
};

interface Junction {
    id: string;
    name: string;
    lat: number;
    lng: number;
    density: string;
    congestion_level: string;
    signal_phase: string;
}

export default function CityMap({ junctions }: { junctions: Junction[] }) {
    const router = useRouter();

    if (!junctions || junctions.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-700/50">
                <Activity className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
                <span className="text-slate-500 font-mono tracking-widest text-sm">NO SIGNAL DETECTED</span>
            </div>
        );
    }

    // Calculate generic center
    const centerLat = junctions.reduce((acc, j) => acc + j.lat, 0) / junctions.length;
    const centerLng = junctions.reduce((acc, j) => acc + j.lng, 0) / junctions.length;

    return (
        <div className="w-full h-full min-h-[500px] z-10 relative">
            <MapContainer
                center={[centerLat, centerLng] as L.LatLngTuple}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '1rem', background: '#0F172A' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {junctions.map((j) => (
                    <Marker
                        key={j.id}
                        position={[j.lat, j.lng]}
                        icon={createIcon(getColorCode(j.congestion_level))}
                        eventHandlers={{
                            click: () => {
                                router.push(`/dashboard/junction/${j.id}`);
                            },
                        }}
                    >
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl min-w-[200px] -m-[13px] overflow-hidden relative">
                                <div className={`absolute top-0 left-0 w-full h-1`} style={{ backgroundColor: getColorCode(j.congestion_level) }}></div>

                                <h3 className="font-bold text-white text-lg mb-1 mt-1 font-sans">{j.name}</h3>

                                <div className="space-y-3 mt-3">
                                    <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                                        <span className="text-slate-400 font-mono">Density</span>
                                        <span className="text-white font-semibold">{j.density}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                                        <span className="text-slate-400 font-mono">Congestion</span>
                                        <span style={{ color: getColorCode(j.congestion_level) }} className="font-bold px-2 py-0.5 rounded bg-slate-800 uppercase tracking-wider">
                                            {j.congestion_level}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-mono">Phase</span>
                                        <span className="text-cyan-400 font-bold truncate max-w-[120px]" title={j.signal_phase}>{j.signal_phase}</span>
                                    </div>
                                </div>

                                <div
                                    className="mt-4 pt-3 border-t border-slate-800 flex justify-center text-xs text-cyan-400 font-mono cursor-pointer hover:text-cyan-300 transition-colors uppercase gap-1 items-center"
                                    onClick={() => router.push(`/dashboard/junction/${j.id}`)}
                                >
                                    <MapPin className="w-3 h-3" /> Inspect Node
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
