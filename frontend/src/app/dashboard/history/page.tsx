"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Database, Search, Download, Filter, FileText, Printer } from "lucide-react";

interface AuditLogRow {
    id: string;
    time: string;
    type: string;
    junction: string;
    details: string;
    status: string;
    actor: string;
    role: string;
}

function toCsv(rows: AuditLogRow[]) {
    const header = ["Timestamp", "Event Type", "Location / Target", "Detailed Description", "Status", "Actor", "Role"];
    const body = rows.map((log) => [log.time, log.type, log.junction, log.details, log.status, log.actor, log.role]);
    return [header, ...body]
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");
}

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [historyLogs, setHistoryLogs] = useState<AuditLogRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/activities");
                const data = await res.json();
                setHistoryLogs(data);
            } catch (error) {
                console.error("Failed to load activity logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return historyLogs;

        return historyLogs.filter((log) =>
            [log.time, log.type, log.junction, log.details, log.status, log.actor, log.role]
                .join(" ")
                .toLowerCase()
                .includes(query)
        );
    }, [historyLogs, searchTerm]);

    function exportCSV() {
        const csv = toCsv(filteredLogs);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `traffix_audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function printAuditLog() {
        const printWindow = window.open("", "_blank", "width=1100,height=800");
        if (!printWindow) return;

        const rows = filteredLogs.map((log) => `
            <tr>
                <td>${log.time}</td>
                <td>${log.type}</td>
                <td>${log.junction}</td>
                <td>${log.details}</td>
                <td>${log.status}</td>
                <td>${log.actor}</td>
                <td>${log.role}</td>
            </tr>
        `).join("");

        printWindow.document.write(`
            <html>
                <head>
                    <title>Traffix Audit Log</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
                        h1 { margin-bottom: 4px; }
                        p { margin-top: 0; color: #475569; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; vertical-align: top; font-size: 12px; }
                        th { background: #e2e8f0; }
                    </style>
                </head>
                <body>
                    <h1>Traffix Audit Log</h1>
                    <p>Printed on ${new Date().toLocaleString()} | Total records: ${filteredLogs.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Event Type</th>
                                <th>Location / Target</th>
                                <th>Detailed Description</th>
                                <th>Status</th>
                                <th>Actor</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    return (
        <div className="p-6 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Database className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System History</h1>
                        <p className="text-slate-400 text-sm">Printable and exportable audit ledger for traffic-authority review</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" /> Filtered View
                    </button>
                    <button onClick={printAuditLog} className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <Printer className="w-4 h-4" /> Print Log
                    </button>
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-cyan-600/20">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden"
            >
                <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search logs by keyword, location, actor, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    <div className="text-sm text-slate-400 font-mono hidden sm:block">
                        {loading ? "Loading audit rows..." : `Showing ${filteredLogs.length} entries`}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50 font-medium">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Location / Target</th>
                                <th className="px-6 py-4 w-full">Detailed Description</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30 text-slate-300 bg-slate-900/20">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.time}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-200">{log.junction}</td>
                                    <td className="px-6 py-4 text-slate-400 whitespace-normal min-w-[320px]">{log.details}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs">
                                            <p className="text-slate-200">{log.actor}</p>
                                            <p className="text-slate-500">{log.role}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${log.status === "Success"
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : log.status === "Warning"
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                        No audit rows match the current search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
