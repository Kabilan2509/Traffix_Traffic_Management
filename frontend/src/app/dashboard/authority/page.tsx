"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BrainCircuit,
    Siren,
    ShieldCheck,
    TriangleAlert,
    Waves,
    Radar,
    ArrowRight,
} from "lucide-react";

interface Hotspot {
    junction_id: string;
    junction_name: string;
    zone: string;
    risk_score: number;
    current_level: string;
    predicted_level: string;
    recommended_action: string;
    clearance_eta_min: number;
}

interface Action {
    title: string;
    impact: string;
    priority: string;
}

interface Corridor {
    id: string;
    name: string;
    route: string[];
    status: string;
    current_eta_min: number;
    optimized_eta_min: number;
    time_saved_min: number;
    confidence: number;
}

interface SensorHealth {
    junction_id: string;
    junction_name: string;
    camera_health: string;
    radar_health: string;
    last_sync_sec: number;
}

interface AuthorityInsights {
    timestamp: string;
    network_score: number;
    critical_alerts: number;
    active_hotspots: Hotspot[];
    recommended_actions: Action[];
    emergency_corridors: Corridor[];
    sensor_health: SensorHealth[];
}

const priorityTone: Record<string, string> = {
    Critical: "text-red-400 border-red-500/30 bg-red-500/10",
    High: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    Medium: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
};

export default function AuthorityDeskPage() {
    const [insights, setInsights] = useState<AuthorityInsights | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/authority/insights");
                const data = await res.json();
                setInsights(data);
            } catch (error) {
                console.error("Failed to load authority insights", error);
            }
        };

        fetchInsights();
        const interval = setInterval(fetchInsights, 12000);
        return () => clearInterval(interval);
    }, []);

    if (!insights) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="glass-panel border border-slate-700/50 rounded-2xl p-8 text-center">
                    <BrainCircuit className="w-10 h-10 text-cyan-400 animate-pulse mx-auto mb-4" />
                    <p className="text-slate-200 font-medium">Building authority briefing...</p>
                    <p className="text-slate-500 text-sm mt-2">Pulling hotspot risk, corridor ETA, and sensor-health intelligence.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <p className="text-cyan-400 text-xs uppercase tracking-[0.35em] mb-2">Authority Decision Support</p>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Operational Intelligence Desk</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-3xl">
                        A citywide action layer for traffic authorities: ranked hotspots, explainable interventions, emergency clearance savings, and field-device health.
                    </p>
                </div>

                <div className="glass-panel rounded-2xl border border-slate-700/50 px-4 py-3">
                    <p className="text-slate-500 text-xs uppercase tracking-widest">Last intelligence refresh</p>
                    <p className="text-cyan-400 font-mono text-sm mt-1">
                        {new Date(insights.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: "Network Readiness", value: `${insights.network_score}%`, note: "Composite serviceability score", icon: ShieldCheck, tone: "text-emerald-400" },
                    { label: "Critical Alerts", value: insights.critical_alerts, note: "Immediate intervention candidates", icon: TriangleAlert, tone: "text-red-400" },
                    { label: "Emergency Time Saved", value: `${insights.emergency_corridors.reduce((sum, item) => sum + item.time_saved_min, 0)} min`, note: "Across active simulated corridors", icon: Siren, tone: "text-cyan-400" },
                ].map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="glass-panel rounded-2xl border border-slate-700/50 p-6"
                    >
                        <card.icon className={`w-6 h-6 ${card.tone} mb-4`} />
                        <p className="text-slate-400 text-sm">{card.label}</p>
                        <div className={`text-4xl font-bold mt-2 ${card.tone}`}>{card.value}</div>
                        <p className="text-slate-500 text-xs mt-3">{card.note}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
                <div className="glass-panel rounded-3xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <Waves className="w-5 h-5 text-red-400" />
                        <div>
                            <h2 className="text-slate-100 text-xl font-semibold">Top Hotspots Requiring Action</h2>
                            <p className="text-slate-500 text-sm">Prioritized by congestion severity, strategic importance, and readiness risk.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {insights.active_hotspots.map((hotspot) => (
                            <div key={hotspot.junction_id} className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-5">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-semibold text-slate-100">{hotspot.junction_name}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
                                                Risk {hotspot.risk_score}/100
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-400">
                                                {hotspot.zone}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">
                                            Current {hotspot.current_level} congestion, predicted {hotspot.predicted_level} in the next cycle window.
                                        </p>
                                    </div>

                                    <div className="text-left lg:text-right">
                                        <p className="text-slate-500 text-xs uppercase tracking-widest">Estimated clearance</p>
                                        <p className="text-cyan-400 font-mono text-lg mt-1">{hotspot.clearance_eta_min} min</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                                    <p className="text-slate-500 text-xs uppercase tracking-widest">Recommended intervention</p>
                                    <p className="text-slate-100 mt-2">{hotspot.recommended_action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel rounded-3xl border border-slate-700/50 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <BrainCircuit className="w-5 h-5 text-cyan-400" />
                            <div>
                                <h2 className="text-slate-100 text-xl font-semibold">Recommended Actions</h2>
                                <p className="text-slate-500 text-sm">Shortlist for control-room approval.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {insights.recommended_actions.map((action) => (
                                <div key={action.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-slate-100 font-medium">{action.title}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${priorityTone[action.priority] || priorityTone.Medium}`}>
                                            {action.priority}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2">{action.impact}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel rounded-3xl border border-slate-700/50 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <Siren className="w-5 h-5 text-amber-400" />
                            <div>
                                <h2 className="text-slate-100 text-xl font-semibold">Emergency Corridor Simulation</h2>
                                <p className="text-slate-500 text-sm">Predictive signal preemption impact before dispatch.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {insights.emergency_corridors.map((corridor) => (
                                <div key={corridor.id} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-slate-100 font-medium">{corridor.name}</p>
                                        <span className="text-xs px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                                            {corridor.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                                        <span>{corridor.current_eta_min} min</span>
                                        <ArrowRight className="w-4 h-4 text-slate-600" />
                                        <span className="text-cyan-400">{corridor.optimized_eta_min} min</span>
                                        <span className="ml-auto text-emerald-400">Saves {corridor.time_saved_min} min</span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-2">
                                        Route: {corridor.route.join(" -> ")} | Confidence {(corridor.confidence * 100).toFixed(0)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-3xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-5">
                    <Radar className="w-5 h-5 text-fuchsia-400" />
                    <div>
                        <h2 className="text-slate-100 text-xl font-semibold">Sensor Health and Audit Confidence</h2>
                        <p className="text-slate-500 text-sm">Helps authorities trust enforcement evidence and spot maintenance risk early.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {insights.sensor_health.map((sensor) => (
                        <div key={sensor.junction_id} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                            <p className="text-slate-100 font-medium">{sensor.junction_name}</p>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-400">
                                    <span>Camera</span>
                                    <span className={sensor.camera_health === "Healthy" ? "text-emerald-400" : "text-amber-400"}>{sensor.camera_health}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Radar</span>
                                    <span className={sensor.radar_health === "Healthy" ? "text-emerald-400" : "text-amber-400"}>{sensor.radar_health}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Last sync</span>
                                    <span className="text-cyan-400">{sensor.last_sync_sec}s ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
