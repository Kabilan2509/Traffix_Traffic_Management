"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    Activity, Map, BarChart2, Calendar, Settings,
    LogOut, ShieldAlert, Users, Bell, Search, Menu
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [role] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("traffix_role") || "";
    });
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("traffix_token");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("traffix_token");
        localStorage.removeItem("traffix_role");
        router.push("/");
    };

    const navItems = [
        { label: "City Map", icon: Map, path: "/dashboard", allowed: ["Super Admin", "Traffic Engineer", "Traffic Operator", "Emergency Authority"] },
        { label: "Authority Desk", icon: Activity, path: "/dashboard/authority", allowed: ["Super Admin", "Traffic Engineer", "Traffic Operator", "Emergency Authority"] },
        { label: "Analytics", icon: BarChart2, path: "/dashboard/analytics", allowed: ["Super Admin", "Traffic Engineer"] },
        { label: "History", icon: Calendar, path: "/dashboard/history", allowed: ["Super Admin", "Traffic Engineer"] },
        { label: "Emergency", icon: ShieldAlert, path: "/dashboard/emergency", allowed: ["Super Admin", "Emergency Authority"], highlight: true },
        { label: "Users", icon: Users, path: "/dashboard/users", allowed: ["Super Admin"] },
        { label: "Settings", icon: Settings, path: "/dashboard/settings", allowed: ["Super Admin"] },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: isSidebarOpen ? 256 : 80 }}
                animate={{ width: isSidebarOpen ? 256 : 80 }}
                className="glass-panel border-r border-slate-700/50 flex flex-col transition-all duration-300 z-50 fixed md:relative h-screen"
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 flex-shrink-0">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <Activity className="text-cyan-400 w-6 h-6 animate-pulse" />
                            <span className="text-xl font-bold text-gradient leading-none tracking-tight">Traffix</span>
                        </div>
                    ) : (
                        <Activity className="text-cyan-400 w-6 h-6 mx-auto animate-pulse" />
                    )}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 hidden md:block">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
                    {/* Role badge */}
                    {isSidebarOpen && (
                        <div className="px-3 py-2 mb-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Authority Level</p>
                            <div className="text-sm text-cyan-400 font-mono font-semibold flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${role === 'Emergency Authority' ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}></span>
                                {role || "Loading..."}
                            </div>
                        </div>
                    )}

                    <nav className="space-y-1">
                        {navItems.filter(item => item.allowed.includes(role)).map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link key={item.path} href={item.path}>
                                    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${isActive ? 'bg-cyan-500/10 text-cyan-400 neon-border' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                    ${item.highlight ? 'hover:bg-red-500/10 hover:text-red-400' : ''}
                  `}>
                                        <item.icon className={`w-5 h-5 flex-shrink-0 ${item.highlight && isActive ? 'text-red-400' : ''}`} />
                                        {isSidebarOpen && (
                                            <span className={`font-medium text-sm ${item.highlight && isActive ? 'text-red-400' : ''}`}>
                                                {item.label}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-700/50">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors
              ${!isSidebarOpen && 'justify-center'}
            `}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-medium text-sm">Disconnect</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300 h-screen">
                {/* Top Navbar */}
                <header className="h-16 glass-panel border-b border-slate-700/50 flex items-center justify-between px-6 z-40 flex-shrink-0 shadow-lg">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="md:hidden text-slate-400 hover:text-cyan-400" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden sm:flex relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search junction ID (e.g. j1, Downtown)..."
                                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-cyan-400 hidden sm:inline-block border border-cyan-500/30 px-2 py-1 rounded bg-cyan-500/10">
                            SYSTEM: ONLINE
                        </span>
                        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/50 rounded-full border border-slate-700">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900 animate-pulse"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-[#0F172A] relative">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.05),transparent_40%)]" />
                    {children}
                </div>
            </main>
        </div>
    );
}
