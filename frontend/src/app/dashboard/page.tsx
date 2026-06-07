"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Activity, BrainCircuit, TriangleAlert } from "lucide-react";

// Dynamically import the Leaflet map to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/CityMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/50 animate-pulse">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
            <span className="text-cyan-400 font-mono text-sm tracking-widest shadow-lg">INITIALIZING SAT-LINK...</span>
        </div>
    ),
});

interface Junction {
    id: string;
    name: string;
    lat: number;
    lng: number;
    density: string;
    congestion_level: string;
    signal_phase: string;
    risk_score: number;
    ai_action: string;
    clearance_eta_min: number;
}

interface AuthorityInsights {
    network_score: number;
    critical_alerts: number;
    active_hotspots: Array<{
        junction_id: string;
        junction_name: string;
        risk_score: number;
        recommended_action: string;
    }>;
}

export default function DashboardPage() {
    const [junctions, setJunctions] = useState<Junction[]>([]);
    const [insights, setInsights] = useState<AuthorityInsights | null>(null);

    useEffect(() => {
        const fetchJunctions = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/junctions");
                const data = await res.json();
                setJunctions(data);
            } catch (err) {
                console.error("Failed to fetch junctions", err);
            }
        };

        const fetchInsights = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/authority/insights");
                const data = await res.json();
                setInsights(data);
            } catch (err) {
                console.error("Failed to fetch authority insights", err);
            }
        };

        fetchJunctions();
        fetchInsights();

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchJunctions, 10000);
        const insightInterval = setInterval(fetchInsights, 12000);
        return () => {
            clearInterval(interval);
            clearInterval(insightInterval);
        };
    }, []);

    return (
        <div className="p-6 md:p-8 flex flex-col gap-6 h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        City Command Center
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time holistic view of active traffic junctions and congestion levels</p>
                </div>

                <div className="flex items-center gap-6 glass-panel px-4 py-2 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Low
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Moderate
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span> Heavy
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_0.85fr] gap-6">
                <div className="min-h-[500px] glass-panel rounded-2xl border border-slate-700/50 overflow-hidden relative shadow-2xl">
                {/* Map Container */}
                    <MapComponent junctions={junctions} />

                {/* Overlay Stats Widget (simulated overlay) */}
                    <div className="absolute top-4 right-4 z-[400] pointer-events-none hidden md:block">
                        <div className="glass-panel p-4 rounded-xl border border-slate-600/50 shadow-2xl bg-slate-900/80 backdrop-blur-md">
                            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Global Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs font-mono">Active Nodes</p>
                                    <p className="text-2xl font-bold text-white">{junctions.length}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-mono">Congested</p>
                                    <p className="text-2xl font-bold text-red-500">{junctions.filter(j => j.congestion_level === 'Red').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl border border-slate-700/50 p-5 shadow-2xl">
                    <div className="flex items-center justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-white text-xl font-bold flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                                Authority Snapshot
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Live triage feed for traffic-authority decision making.</p>
                        </div>
                        {insights && (
                            <div className="px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Readiness</p>
                                <p className="text-cyan-400 text-xl font-bold">{insights.network_score}%</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Critical alerts</p>
                            <p className="text-red-400 text-3xl font-bold mt-2">{insights?.critical_alerts ?? "--"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Avg clearance ETA</p>
                            <p className="text-cyan-400 text-3xl font-bold mt-2">
                                {junctions.length
                                    ? `${Math.round(junctions.reduce((sum, junction) => sum + junction.clearance_eta_min, 0) / junctions.length)}m`
                                    : "--"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-slate-200 font-semibold flex items-center gap-2 mb-3">
                            <TriangleAlert className="w-4 h-4 text-red-400" />
                            Immediate Priority Junctions
                        </h3>
                        <div className="space-y-3">
                            {(insights?.active_hotspots ?? []).map((hotspot) => (
                                <div key={hotspot.junction_id} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-slate-100 font-medium">{hotspot.junction_name}</p>
                                            <p className="text-slate-500 text-xs mt-1">Risk score {hotspot.risk_score}/100</p>
                                        </div>
                                        <span className="px-2 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
                                            Priority
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-3">{hotspot.recommended_action}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
