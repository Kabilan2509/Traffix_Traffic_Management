"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Cpu,
  Bell,
  Shield,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react";

export default function SettingsPage() {
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [emergencyBroadcast, setEmergencyBroadcast] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [congestionThreshold, setCongestionThreshold] = useState(75);
  const [syncSeconds, setSyncSeconds] = useState(10);

  return (
    <div className="p-6 pb-20 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
            <Settings className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System Settings</h1>
            <p className="text-sm text-slate-400">Configure traffic AI behavior, failover, and notifications</p>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-fuchsia-600/20 transition-colors">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-slate-700/50 rounded-2xl p-5"
        >
          <h2 className="text-slate-200 font-semibold mb-4 inline-flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Optimization Engine
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900/30 p-3">
              <div>
                <p className="text-sm text-slate-100">Auto-Optimize Signal Phases</p>
                <p className="text-xs text-slate-500">Allow model to rebalance cycles without manual review.</p>
              </div>
              <input type="checkbox" checked={autoOptimize} onChange={(e) => setAutoOptimize(e.target.checked)} className="h-4 w-4 accent-cyan-500" />
            </label>

            <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-3">
              <div className="flex items-center justify-between text-sm">
                <p className="text-slate-100">Congestion Alert Threshold</p>
                <span className="text-cyan-400 font-mono">{congestionThreshold}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={congestionThreshold}
                onChange={(e) => setCongestionThreshold(Number(e.target.value))}
                className="w-full mt-3 accent-cyan-500"
              />
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <p className="text-slate-100">Telemetry Sync Interval</p>
                <span className="text-fuchsia-400 font-mono">{syncSeconds}s</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={syncSeconds}
                onChange={(e) => setSyncSeconds(Number(e.target.value))}
                className="w-full mt-2 accent-fuchsia-500"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel border border-slate-700/50 rounded-2xl p-5"
        >
          <h2 className="text-slate-200 font-semibold mb-4 inline-flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" /> Safety and Override
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900/30 p-3">
              <div>
                <p className="text-sm text-slate-100">Emergency Broadcast Channel</p>
                <p className="text-xs text-slate-500">Send hard-priority preemption signals citywide.</p>
              </div>
              <input
                type="checkbox"
                checked={emergencyBroadcast}
                onChange={(e) => setEmergencyBroadcast(e.target.checked)}
                className="h-4 w-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900/30 p-3">
              <div>
                <p className="text-sm text-slate-100">Immutable Audit Logging</p>
                <p className="text-xs text-slate-500">Keep complete signal-control trace for compliance.</p>
              </div>
              <input
                type="checkbox"
                checked={auditLogging}
                onChange={(e) => setAuditLogging(e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
            </label>

            <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold transition-colors">
              <RefreshCcw className="w-4 h-4" /> Reset Fallback Timing Matrix
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel border border-slate-700/50 rounded-2xl p-5 lg:col-span-2"
        >
          <h2 className="text-slate-200 font-semibold mb-4 inline-flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Notification and Ops Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider inline-flex items-center gap-1">
                <Bell className="w-3 h-3" /> Alert Route
              </p>
              <p className="text-sm text-slate-100 mt-2">city-command@traffic.gov</p>
              <p className="text-xs text-slate-500 mt-1">Primary NOC mailbox for escalations.</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Runtime Profile</p>
              <p className="text-sm text-cyan-400 mt-2 font-mono">production.ai-balanced.v3</p>
              <p className="text-xs text-slate-500 mt-1">Current optimization profile in use.</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Last Config Update</p>
              <p className="text-sm text-slate-100 mt-2">2026-03-05 09:28:14</p>
              <p className="text-xs text-slate-500 mt-1">Synchronized with central controller.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
