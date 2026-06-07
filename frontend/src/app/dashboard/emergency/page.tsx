"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, RadioTower, Power, Siren, MapPin, CheckCircle } from "lucide-react";

export default function EmergencyPage() {
    const [activeOverride, setActiveOverride] = useState<string | null>(null);

    const handleOverride = (id: string) => {
        setActiveOverride(id);
        // Real implementation would call API
        setTimeout(() => {
            setActiveOverride(null);
        }, 5000); // Reset after 5s for demo
    };

    const emergencyCorridors = [
        { id: "corr-1", name: "Hospital Route A (North-South)", status: "Standby", junctions: ["J1", "J4", "J8"] },
        { id: "corr-2", name: "Fire Dept Corridor (East-West)", status: "Active", junctions: ["J2", "J5"] },
        { id: "corr-3", name: "Evacuation Protocol X", status: "Disabled", junctions: ["All"] },
    ];

    return (
        <div className="p-6 pb-20 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                    <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-red-400 tracking-tight uppercase">Emergency Command Center</h1>
                    <p className="text-slate-400 text-sm">Critical override protocols for first responders only</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 rounded-2xl border border-red-500/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />

                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500/20 p-2 rounded-lg">
                                <Siren className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-100">Global Preemption</h2>
                                <p className="text-red-400/80 text-xs">Instantly secure priority routes</p>
                            </div>
                        </div>
                        {activeOverride && (
                            <span className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                <RadioTower className="w-3 h-3 animate-ping" /> SIGNAL BROADCASTING
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {emergencyCorridors.map((corr) => (
                            <div key={corr.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-red-500/30 transition-colors">
                                <div>
                                    <h3 className="text-slate-200 font-medium flex items-center gap-2">
                                        {corr.name}
                                    </h3>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Area: {corr.junctions.join(", ")}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOverride(corr.id)}
                                    disabled={activeOverride !== null && activeOverride !== corr.id}
                                    className={`relative overflow-hidden group px-6 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 min-w-[160px]
                    ${activeOverride === corr.id
                                            ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400"
                                            : "bg-slate-800 text-red-400 border border-red-500/30 hover:bg-red-500/10"
                                        }
                    ${activeOverride !== null && activeOverride !== corr.id ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                                >
                                    {activeOverride === corr.id ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" /> ACTIVE
                                        </>
                                    ) : (
                                        <>
                                            <Power className="w-4 h-4" /> INITIATE
                                        </>
                                    )}
                                    {/* Sweep animation on hover */}
                                    {!activeOverride && (
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-orange-500/30 bg-orange-500/5"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-6 h-6 text-orange-500" />
                        <h2 className="text-xl font-bold text-slate-100">Disaster Modes</h2>
                    </div>

                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        Warning: Activating disaster modes will suspend all AI optimization and enforce hardcoded signal timings across the entire city grid. This action requires authorization key verification.
                    </p>

                    <div className="space-y-4">
                        <div className="border border-orange-500/20 bg-slate-900/80 p-5 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-orange-400 font-bold mb-1">Total System Flash (All Red)</h3>
                                    <p className="text-xs text-slate-500">Forces all signals in the network to blink RED. Usable during catastrophic network fail or city-wide freeze.</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 text-red-500 hover:text-red-400 border border-red-500/50 rounded-lg font-mono font-bold uppercase transition-colors">
                                [ FORCE FLASH MODE ]
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
