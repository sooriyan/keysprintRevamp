"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User, Trophy, Zap, Target, Loader2, Star, Flame, Moon, Shield, Crown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.id as string;

    const [stats, setStats] = useState({ totalTests: 0, avgWpm: 0, highestAccuracy: 0 });
    const [badges, setBadges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userNotFound, setUserNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        setUserNotFound(false);

        fetch(`/api/user/${encodeURIComponent(username)}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) setUserNotFound(true);
                    throw new Error("Failed to fetch user");
                }
                return res.json();
            })
            .then(data => {
                if (data.stats) setStats(data.stats);
                if (data.badges) setBadges(data.badges);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [username]);

    if (userNotFound) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">User Not Found</h1>
                <p className="text-slate-500 mb-8">This sprinter doesn't exist or has deleted their account.</p>
                <Link href="/leaderboard" className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold bg-[#0ea5e9] text-white hover:bg-[#06b6d4] transition-colors">
                    Back to Leaderboard
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-0">
            <Link href="/leaderboard" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
            </Link>

            <div className="bg-white dark:bg-[#1e293b]/50 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                        <User className="w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{decodeURIComponent(username)}</h1>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                            Member
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4"><Zap className="w-6 h-6" /></div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Avg WPM</div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.avgWpm}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4"><Target className="w-6 h-6" /></div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.highestAccuracy}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center mb-4"><Trophy className="w-6 h-6" /></div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Tests Taken</div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalTests}</div>
                            </div>
                        </div>

                        {/* Badges Section */}
                        <div className="border-t border-slate-100 dark:border-slate-800/50 pt-10">
                            <div className="flex items-center gap-3 mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-500" /> Earned Badges
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">{badges.length}</span>
                            </div>

                            {badges.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-medium">
                                    No badges earned yet.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {badges.map((badge, i) => {
                                        const iconMap: Record<string, any> = { Zap, Flame, Target, Moon, Shield, Crown };
                                        const IconComponent = iconMap[badge.icon] || Star;
                                        return (
                                            <div
                                                key={i}
                                                className="group relative flex items-center gap-3 p-2.5 pr-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm rounded-full hover:-translate-y-1 hover:shadow-md hover:border-yellow-400/50 dark:hover:border-yellow-500/30 transition-all cursor-default"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-inner text-white flex-shrink-0 relative overflow-hidden">
                                                    {/* Shine effect logic */}
                                                    <div className="absolute top-0 -left-full w-1/2 h-full bg-white/30 skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                                                    <IconComponent className="w-5 h-5 relative z-10" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-none mb-1">{badge.title}</h4>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                                                        {new Date(badge.unlockedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>

                                                {/* Tooltip on hover */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-20 text-center shadow-xl">
                                                    {badge.description}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
