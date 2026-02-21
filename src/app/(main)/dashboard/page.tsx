"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Activity, Trophy, Flame, Target, CalendarDays, Zap, Shield, Crown, Clock, Star, TrendingUp, Keyboard, Moon, ChevronDown, CheckCircle2, Type, AlignLeft, Code2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const iconMap: Record<string, React.ElementType> = {
    Zap,
    Flame,
    Target,
    Moon,
    Shield,
    Crown
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState({ totalTests: 0, avgWpm: 0, highestAccuracy: 0 });
    const [achievements, setAchievements] = useState<any>({ unlocked: [], allList: [] });
    const [recentTests, setRecentTests] = useState<any[]>([]);
    const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
    const [graphRange, setGraphRange] = useState<"7" | "30" | "all">("30");
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
    const [isGraphDropdownOpen, setIsGraphDropdownOpen] = useState(false);
    const [activeShareCard, setActiveShareCard] = useState<string>("standard");
    const [loading, setLoading] = useState(true);

    const chartData = useMemo(() => {
        if (!performanceHistory || performanceHistory.length === 0) return [];
        let data = performanceHistory;
        if (graphRange !== "all") {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - parseInt(graphRange));
            data = performanceHistory.filter(t => new Date(t.isoDate) >= cutoff);
        }

        // Recharts AreaChart requires at least 2 points to draw an area/line.
        if (data.length === 1) {
            return [
                { ...data[0], date: 'Start' },
                { ...data[0] }
            ];
        }
        return data;
    }, [performanceHistory, graphRange]);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user/stats")
                .then(res => res.json())
                .then(data => {
                    if (data.stats) {
                        setStats(data.stats);
                        setAchievements(data.achievements);
                        if (data.recentTests) setRecentTests(data.recentTests);
                        if (data.performanceHistory) setPerformanceHistory(data.performanceHistory);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-[#0ea5e9] rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 pb-12">
            {/* Profile Header Block */}
            <div className="bg-white dark:bg-[#1e293b]/70 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden transition-colors">

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

                {/* Avatar */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-slate-800 dark:from-slate-800 dark:to-slate-900 shadow-xl border-4 border-white dark:border-slate-800 flex-shrink-0 relative overflow-hidden">
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center text-white text-5xl font-black">{session?.user?.name?.charAt(0) || "U"}</div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{session?.user?.name || "Sprinter"}</h1>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Joined Feb 2026</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <Link href="/profile/edit" className="px-6 py-2.5 bg-[#0f172a] dark:bg-[#0ea5e9] hover:bg-slate-800 dark:hover:bg-[#06b6d4] text-white rounded-xl text-sm font-bold shadow-md transition-colors block">
                            Edit Profile
                        </Link>
                        <button onClick={() => setIsShareOpen(true)} className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            Share Stats
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e293b]/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between group transition-all hover:border-[#0ea5e9]/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Tests</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalTests}</div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                            <div className="w-[100%] h-full bg-blue-500 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b]/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between group transition-all hover:border-emerald-500/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Avg WPM</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.avgWpm} <span className="text-lg text-slate-400 font-bold ml-1">wpm</span></div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                            <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b]/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between group transition-all hover:border-purple-500/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Highest Acc</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.highestAccuracy}%</div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                            <div className="w-[100%] h-full bg-purple-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white dark:bg-[#1e293b]/50 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#0ea5e9]" /> {graphRange === "7" ? "7-Day" : graphRange === "30" ? "30-Day" : "All-Time"} Performance
                        </h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Your typing speed strictly increasing</p>
                    </div>
                    <div className="relative">
                        <div
                            onClick={() => setIsGraphDropdownOpen(!isGraphDropdownOpen)}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                        >
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {graphRange === "30" ? "Last 30 Days" :
                                    graphRange === "7" ? "Last 7 Days" : "All Time"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isGraphDropdownOpen ? "rotate-180" : ""}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isGraphDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsGraphDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                    {[
                                        { id: "30", label: "Last 30 Days" },
                                        { id: "7", label: "Last 7 Days" },
                                        { id: "all", label: "All Time" }
                                    ].map((opt) => (
                                        <div
                                            key={opt.id}
                                            onClick={() => {
                                                setGraphRange(opt.id as any);
                                                setIsGraphDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${graphRange === opt.id
                                                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] dark:text-[#38bdf8]'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="h-[300px] w-full relative">
                    {chartData.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <Activity className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-bold text-sm">No performance data for this period.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} label={{ value: 'WPM', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#0ea5e9' }}
                                />
                                <Area type="monotone" dataKey="wpm" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorWpm)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Achievements */}
                <div className="bg-white dark:bg-[#1e293b]/50 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
                        </h2>
                        <button onClick={() => setIsAchievementsOpen(true)} className="text-sm font-bold text-[#0ea5e9] hover:underline bg-transparent border-none cursor-pointer">View All</button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <TooltipProvider>
                            {(achievements?.allList || []).map((achievement: any, i: number) => {
                                const isUnlocked = (achievements?.unlocked || []).some((u: any) => u.achievementId === achievement.id);
                                const IconComponent = iconMap[achievement.icon] || Star;

                                return (
                                    <Tooltip key={i} delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            <div className={`flex flex-col items-center justify-center p-4 rounded-3xl border ${isUnlocked ? 'bg-yellow-50/50 dark:bg-yellow-500/10 border-yellow-200/50 dark:border-yellow-500/20 cursor-auto' : 'bg-slate-50/50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 cursor-not-allowed'} transition-all text-center h-full`}>
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border mb-3 ${isUnlocked ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-400 text-white' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'}`}>
                                                    <IconComponent className="w-7 h-7" />
                                                </div>
                                                <h4 className={`font-bold text-sm ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{achievement.title}</h4>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-none shadow-xl rounded-xl px-4 py-2.5">
                                            <p>{achievement.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </TooltipProvider>
                    </div>
                </div>

                {/* History */}
                <div className="bg-white dark:bg-[#1e293b]/50 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" /> Recent Tests
                        </h2>
                    </div>

                    {recentTests.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-[#1e293b]/50">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
                                <Keyboard className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">No recent tests</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-[250px] mx-auto">Take a typing challenge to see your history appear here.</p>
                            <Link href="/challenge" className="mt-6 px-6 py-2.5 bg-[#0f172a] dark:bg-[#0ea5e9] hover:bg-slate-800 dark:hover:bg-[#06b6d4] text-white rounded-xl text-sm font-bold shadow-md transition-colors">Start Typing</Link>
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {recentTests.map((test, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-[#1e293b]/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">{test.challengeType || 'Standard'} Mode</h4>
                                            <div className="text-xs font-medium text-slate-400 mt-1">{new Date(test.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-slate-900 dark:text-white">{test.wpm} <span className="text-xs font-bold text-slate-400">WPM</span></div>
                                        <div className="text-xs font-bold text-emerald-500 mt-0.5">{test.accuracy}% ACC</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Basic Modals for custom routing states */}
            {isShareOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsShareOpen(false)}>
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2rem] p-8 shadow-2xl scale-in-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Share Your Stats</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Flex your Keysprint metrics instantly</p>

                        <div className="mb-6 w-full max-w-[280px] mx-auto">
                            <Swiper
                                effect={'cards'}
                                grabCursor={true}
                                modules={[EffectCards, Pagination]}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                className="w-full h-[220px]"
                                onSlideChange={(swiper) => {
                                    const protocols = ["standard", "paragraph", "developer", "daily"];
                                    setActiveShareCard(protocols[swiper.activeIndex] || "standard");
                                }}
                            >
                                {[
                                    { id: "standard", label: "A-Z Standard", icon: Type, color: "from-cyan-500 to-blue-500" },
                                    { id: "paragraph", label: "Paragraph", icon: AlignLeft, color: "from-blue-500 to-indigo-500" },
                                    { id: "developer", label: "Developer", icon: Code2, color: "from-emerald-400 to-emerald-600" },
                                    { id: "daily", label: "Daily Global", icon: CalendarDays, color: "from-purple-500 to-pink-500" }
                                ].map((protocol) => {
                                    const IconNode = protocol.icon;
                                    const bestWpm = (stats as any).bestScores?.[protocol.id] || 0;
                                    return (
                                        <SwiperSlide key={protocol.id} className={`rounded-3xl p-1 bg-gradient-to-br ${protocol.color} shadow-lg`}>
                                            <div className="w-full h-full bg-white dark:bg-[#0f172a] rounded-[22px] flex flex-col items-center justify-center p-5 relative overflow-hidden">
                                                <IconNode className="absolute top-4 right-4 w-12 h-12 opacity-5 text-slate-900 dark:text-white pointer-events-none" />
                                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{protocol.label}</div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br border-none pb-1 mb-2" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}>
                                                    <span className={`bg-gradient-to-br ${protocol.color} bg-clip-text text-transparent`}>{bestWpm}</span>
                                                </div>
                                                <div className="w-full flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-bold mt-auto">
                                                    <span className="text-slate-400">Record WPM</span>
                                                    <span className="text-slate-900 dark:text-white flex items-center gap-1">Top Speed <Zap className="w-3 h-3 text-yellow-500" /></span>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`I just hit a massive ${((stats as any).bestScores?.[activeShareCard] || 0)} WPM on the ${activeShareCard} challenge at Keysprint! Can you beat my high score? https://keysprint.in/share/${session?.user?.name}?protocol=${activeShareCard}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just hit a massive ${((stats as any).bestScores?.[activeShareCard] || 0)} WPM on the ${activeShareCard} challenge at Keysprint! Can you beat my high score?`)}&url=https://keysprint.in/share/${session?.user?.name}?protocol=${activeShareCard}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                X (Twitter)
                            </a>
                        </div>
                        <div className="space-y-3">
                            <a
                                href={`mailto:?subject=Check out my Keysprint record!&body=${encodeURIComponent(`I just hit ${((stats as any).bestScores?.[activeShareCard] || 0)} WPM on the ${activeShareCard} challenge on Keysprint! Can you beat me?\n\nPlay here: https://keysprint.in/share/${session?.user?.name}?protocol=${activeShareCard}`)}`}
                                className="w-full flex justify-center py-3.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors"
                            >
                                Share via Email
                            </a>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`I just hit ${((stats as any).bestScores?.[activeShareCard] || 0)} WPM on the ${activeShareCard} challenge at Keysprint! Can you beat my high score? https://keysprint.in/share/${session?.user?.name}?protocol=${activeShareCard}`);
                                    alert('Copied to clipboard!');
                                }}
                                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                Copy Custom Link
                            </button>
                            <button onClick={() => setIsShareOpen(false)} className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAchievementsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAchievementsOpen(false)}>
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl scale-in-center max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-500" /> All Achievements
                            </h3>
                            <button onClick={() => setIsAchievementsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Collect them all by demonstrating speed, consistency, and accuracy across various challenge modes.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(achievements?.allList || []).map((achievement: any, i: number) => {
                                const isUnlocked = (achievements?.unlocked || []).some((u: any) => u.achievementId === achievement.id);
                                const IconComponent = iconMap[achievement.icon] || Star;

                                return (
                                    <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-3xl border ${isUnlocked ? 'bg-yellow-50/50 dark:bg-yellow-500/10 border-yellow-200/50 dark:border-yellow-500/20' : 'bg-slate-50/50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-60'} transition-all text-center h-full`}>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border mb-3 ${isUnlocked ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-400 text-white' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'}`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                        <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{achievement.title}</h4>
                                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">{achievement.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
