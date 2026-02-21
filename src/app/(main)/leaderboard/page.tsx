"use client";

import React, { useEffect, useState } from "react";
import { Globe, Trophy, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("daily");
    const [page, setPage] = useState(1);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/leaderboard?range=${activeTab}&page=${page}&limit=50`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLeaderboard(data.data);
                    if (data.pagination) setPagination(data.pagination);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [activeTab, page]);

    // Reset page when tab changes
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const topThree = leaderboard.slice(0, 3);
    const tableData = leaderboard.map((item, idx) => ({
        ...item,
        rank: ((page - 1) * pagination.limit + idx + 1).toString().padStart(2, '0')
    }));

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Globe className="w-9 h-9 text-[#0ea5e9]" />
                        Global Rankings
                    </h1>
                    <p className="text-slate-500 font-medium mt-3 text-[15px] max-w-lg leading-relaxed">
                        Compete with the fastest typists on the planet. <span className="text-[#0ea5e9] font-bold">Speed defines you.</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm flex items-center gap-1 self-start md:self-auto transition-colors">
                    <button onClick={() => setActiveTab('daily')} className={`px-5 py-2 font-bold text-sm rounded-lg shadow-sm transition-colors ${activeTab === 'daily' ? 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent'}`}>Daily</button>
                    <button onClick={() => setActiveTab('weekly')} className={`px-5 py-2 font-bold text-sm rounded-lg shadow-sm transition-colors ${activeTab === 'weekly' ? 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent'}`}>Weekly</button>
                    <button onClick={() => setActiveTab('all-time')} className={`px-5 py-2 font-bold text-sm rounded-lg shadow-sm transition-colors ${activeTab === 'all-time' ? 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent'}`}>All-Time</button>
                </div>
            </div>

            {/* Podium */}
            <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-12 relative w-full px-4 pt-10">

                {/* Silver (2nd) */}
                <div className="w-full md:w-[30%] bg-white dark:bg-[#1e293b]/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center relative md:-mb-2 z-10 transition-transform hover:-translate-y-2 pb-8">
                    <div className="absolute -top-4 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm border border-slate-300 dark:border-slate-600">
                        SILVER
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm mt-4 overflow-hidden relative flex items-center justify-center">
                        {topThree[1]?.image ? (
                            <img src={topThree[1].image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 text-3xl font-black">
                                {topThree[1]?.user?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    {loading ? <Loader2 className="animate-spin text-slate-300 mt-6" /> : (
                        <>
                            <h3 className="font-extrabold text-slate-900 dark:text-white mt-4 text-lg">{topThree[1]?.user || '---'}</h3>
                            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mt-1 mb-6">
                                {topThree[1]?.topSpeed || 0}<span className="text-sm text-slate-400 dark:text-slate-500 font-bold tracking-normal ml-1">WPM</span>
                            </div>

                            <div className="w-full space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                                        <span>Accuracy</span><span>{topThree[1]?.accuracy || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: `${topThree[1]?.accuracy || 0}%` }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 dark:text-slate-400">Avg Speed</span>
                                    <span className="text-pink-500">{topThree[1]?.avgWpm || 0} WPM</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Gold (1st) */}
                <div className="w-full md:w-[32%] bg-white dark:bg-[#1e293b]/80 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.08)] dark:shadow-none border-2 border-yellow-400/20 dark:border-yellow-500/30 p-8 flex flex-col items-center relative z-20 pb-10 transition-transform hover:-translate-y-2">
                    {/* subtle glow behind gold card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400/5 dark:bg-yellow-400/10 blur-[50px] pointer-events-none -z-10" />

                    <div className="absolute -top-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-widest shadow-md flex items-center gap-1.5">
                        <Trophy className="w-4 h-4" /> GOLD
                    </div>
                    <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md mt-4 overflow-hidden p-1 flex items-center justify-center">
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                            {topThree[0]?.image ? (
                                <img src={topThree[0].image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-slate-500 dark:text-slate-300 text-4xl font-black">
                                    {topThree[0]?.user?.charAt(0).toUpperCase() || "?"}
                                </span>
                            )}
                        </div>
                    </div>
                    {loading ? <Loader2 className="animate-spin text-slate-300 mt-6" /> : (
                        <>
                            <h3 className="font-extrabold text-slate-900 dark:text-white mt-5 text-xl">{topThree[0]?.user || '---'}</h3>
                            <div className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mt-1 mb-8">
                                {topThree[0]?.topSpeed || 0}<span className="text-xl text-slate-400 dark:text-slate-500 font-bold tracking-normal ml-1">WPM</span>
                            </div>

                            <div className="w-full space-y-5">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                                        <span>Accuracy</span><span className="text-emerald-500">{topThree[0]?.accuracy || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${topThree[0]?.accuracy || 0}%` }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 dark:text-slate-400">Avg Speed</span>
                                    <span className="text-pink-500 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {topThree[0]?.avgWpm || 0} WPM</span>
                                </div>
                            </div>
                        </>
                    )}

                    <button onClick={() => router.push(`/${topThree[0]?.user}`)} disabled={!topThree[0]?.user} className="w-full mt-8 py-3 bg-[#0f172a] dark:bg-[#0ea5e9] hover:bg-slate-800 dark:hover:bg-[#06b6d4] text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        View Profile
                    </button>
                </div>

                {/* Bronze (3rd) */}
                <div className="w-full md:w-[30%] bg-white dark:bg-[#1e293b]/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center relative md:-mb-2 z-10 transition-transform hover:-translate-y-2 pb-8">
                    <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm">
                        BRONZE
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-orange-500/20 bg-orange-50 dark:bg-orange-900/20 mt-4 shadow-sm overflow-hidden flex items-center justify-center p-1">
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                            {topThree[2]?.image ? (
                                <img src={topThree[2].image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-slate-500 dark:text-slate-300 text-3xl font-black">
                                    {topThree[2]?.user?.charAt(0).toUpperCase() || "?"}
                                </span>
                            )}
                        </div>
                    </div>
                    {loading ? <Loader2 className="animate-spin text-slate-300 mt-6" /> : (
                        <>
                            <h3 className="font-extrabold text-slate-900 dark:text-white mt-4 text-lg">{topThree[2]?.user || '---'}</h3>
                            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mt-1 mb-6">
                                {topThree[2]?.topSpeed || 0}<span className="text-sm text-slate-400 dark:text-slate-500 font-bold tracking-normal ml-1">WPM</span>
                            </div>

                            <div className="w-full space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                                        <span>Accuracy</span><span>{topThree[2]?.accuracy || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${topThree[2]?.accuracy || 0}%` }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 dark:text-slate-400">Avg Speed</span>
                                    <span className="text-pink-500">{topThree[2]?.avgWpm || 0} WPM</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Rankings Table */}
            <div className="bg-white dark:bg-[#1e293b]/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left bg-slate-50/50 dark:bg-[#1e293b]/50">
                                <th className="py-5 px-6">Rank</th>
                                <th className="py-5 px-6">User</th>
                                <th className="py-5 px-6 text-center">Avg WPM</th>
                                <th className="py-5 px-6 text-center">Top Speed</th>
                                <th className="py-5 px-6 text-center">Accuracy</th>
                                <th className="py-5 px-6 text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tableData.map((row) => (
                                <tr
                                    key={row.rank}
                                    onClick={() => router.push(`/${row.user}`)}
                                    className={`group hover:bg-slate-50 dark:hover:bg-[#1e293b]/80 transition-colors cursor-pointer ${row.isCurrent ? 'bg-cyan-50/50 dark:bg-cyan-900/20 hover:bg-cyan-50/80 dark:hover:bg-cyan-900/30' : ''}`}
                                >
                                    <td className={`py-4 px-6 font-bold text-sm ${row.isCurrent ? 'text-[#0ea5e9]' : 'text-slate-400 dark:text-slate-500 group-hover:text-[#0ea5e9]'} transition-colors`}>
                                        {row.rank}
                                    </td>
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm flex items-center justify-center">
                                            {row.image ? (
                                                <img src={row.image} alt={row.user} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
                                                    {row.user?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-1.5">
                                                {row.user}
                                            </div>
                                            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                {row.type || "Sprinter"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="font-extrabold text-slate-900 dark:text-slate-200">{row.avgWpm}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="font-bold text-slate-500 dark:text-slate-400">{row.topSpeed}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${parseInt(row.accuracy) >= 99 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                            parseInt(row.accuracy) >= 98 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500' :
                                                parseInt(row.accuracy) >= 96 ? 'text-emerald-500' :
                                                    'text-slate-500 dark:text-slate-400'
                                            }`}>
                                            {row.accuracy}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center items-center">
                                            <Minus className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-[#1e293b]/30">
                    <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-900 dark:text-slate-300">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-bold text-slate-900 dark:text-slate-300">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-bold text-slate-900 dark:text-slate-300">{pagination.total}</span> results
                    </div>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="w-auto px-4 h-9 rounded-lg bg-[#0ea5e9] text-white font-bold text-sm flex items-center justify-center shadow-md">
                            Page {page} of {pagination.totalPages || 1}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages || pagination.totalPages === 0}
                            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
