"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, Cpu, Activity, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const performanceData = [
    { time: "00:00", density: 30, efficiency: 85 },
    { time: "04:00", density: 20, efficiency: 95 },
    { time: "08:00", density: 80, efficiency: 60 },
    { time: "12:00", density: 65, efficiency: 75 },
    { time: "16:00", density: 85, efficiency: 55 },
    { time: "20:00", density: 50, efficiency: 80 },
];

const peakHoursData = [
    { name: "Mon", score: 80 },
    { name: "Tue", score: 75 },
    { name: "Wed", score: 85 },
    { name: "Thu", score: 90 },
    { name: "Fri", score: 95 },
    { name: "Sat", score: 60 },
    { name: "Sun", score: 50 },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("24h");

    return (
        <div className="p-6 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                        <BarChart2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System Analytics</h1>
                        <p className="text-slate-400 text-sm">Deep learning predictions & performance metrics</p>
                    </div>
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700 w-fit">
                    {["1h", "24h", "7d", "30d"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === range
                                    ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-cyan-400" />
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Citywide Efficiency Score</h3>
                    <div className="text-4xl font-bold text-cyan-400 font-mono">92.4%</div>
                    <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +2.1% from last week
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Cpu className="w-16 h-16 text-fuchsia-400" />
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">AI Interventions</h3>
                    <div className="text-4xl font-bold text-fuchsia-400 font-mono">1,402</div>
                    <p className="text-slate-500 text-xs mt-2">Automated signal changes today</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-emerald-400" />
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Avg Network Delay</h3>
                    <div className="text-4xl font-bold text-emerald-400 font-mono">4.2m</div>
                    <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 rotate-180" /> -0.8m from average
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-[400px]"
                >
                    <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        Density vs Efficiency Correlation
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="density" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDensity)" name="Density Score" />
                            <Area type="monotone" dataKey="efficiency" stroke="#22d3ee" fillOpacity={1} fill="url(#colorEfficiency)" name="Efficiency Score" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-[400px]"
                >
                    <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-fuchsia-400" />
                        Weekly Congestion Trend
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={peakHoursData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#d946ef" strokeWidth={3} dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Congestion Index" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
