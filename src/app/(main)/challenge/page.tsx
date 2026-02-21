"use client";

import React, { useEffect, useState } from "react";
import { Type, AlignLeft, Code2, ChevronRight, Activity, Lightbulb, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function ChallengeSelectionPage() {
    const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>([]);
    const [selectedProtocol, setSelectedProtocol] = useState<string>("standard");
    const [bestScores, setBestScores] = useState<Record<string, number>>({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // Fetch all-time live rankings from the DB based on the selected protocol
        fetch(`/api/leaderboard?range=all&protocol=${selectedProtocol}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLiveLeaderboard(data.data.slice(0, 5));
                }
            })
            .catch(err => console.error(err));
    }, [selectedProtocol]);

    useEffect(() => {
        // Fetch user stats securely to map Best Scores
        fetch(`/api/user/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.stats && data.stats.bestScores) {
                    setBestScores(data.stats.bestScores);
                }
            })
            .catch(err => console.error(err));
    }, []);
    const challenges = [
        {
            id: "standard",
            title: "Standard A-Z",
            type: "Reflex",
            description: "Test your raw reflex speed on random alphabetic strings. Pure speed, no context.",
            bestScore: bestScores["standard"] || 0,
            icon: <Type className="w-5 h-5 text-cyan-400" />,
            color: "from-cyan-500/10 to-transparent",
            borderColor: "border-cyan-500/20"
        },
        {
            id: "paragraph",
            title: "Paragraph Challenge",
            type: "Endurance",
            description: "Endurance testing on real-world literature and prose. Focus on rhythm and flow.",
            bestScore: bestScores["paragraph"] || 0,
            icon: <AlignLeft className="w-5 h-5 text-blue-400" />,
            color: "from-blue-500/10 to-transparent",
            borderColor: "border-blue-500/20"
        },
        {
            id: "developer",
            title: "Developer Code Snippet",
            type: "Technical",
            description: "Python, JS, and C++ syntax drills for developers. Master special characters, brackets, and indentation patterns used in modern programming.",
            bestScore: bestScores["developer"] || 0,
            icon: <Code2 className="w-5 h-5 text-emerald-400" />,
            color: "from-emerald-500/10 to-transparent",
            borderColor: "border-emerald-500/20"
        },
        {
            id: "daily",
            title: "Global Daily Challenge",
            type: "Seeded",
            description: "The exact same string for everyone on the planet, cycling every 24 hours. Your only chance to prove you are the fastest today.",
            bestScore: bestScores["daily"] || 0,
            icon: <CalendarDays className="w-5 h-5 text-purple-400" />,
            color: "from-purple-500/10 to-transparent",
            borderColor: "border-purple-500/20",
            fullWidth: true
        }
    ];



    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Challenges */}
            <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">Select Your Protocol</h1>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] max-w-2xl mb-8 leading-relaxed">
                    Choose a challenge mode to test your speed and accuracy. Each mode is designed to target specific typing reflexes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {challenges.map((challenge) => (
                        <Link href={`/challenge/${challenge.id}`} key={challenge.id} className="block">
                            <div
                                className={`h-full group relative bg-white dark:bg-[#1e293b]/50 hover:bg-slate-50 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:border-slate-300 dark:hover:border-slate-500 shadow-sm transition-all rounded-2xl p-6 cursor-pointer overflow-hidden ${challenge.fullWidth ? 'md:col-span-2' : ''}`}
                            >
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${challenge.color} rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className={`w-12 h-12 rounded-xl border ${challenge.borderColor} bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shadow-inner`}>
                                        {challenge.icon}
                                    </div>
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {challenge.type}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 relative z-10 group-hover:text-[#0ea5e9] dark:group-hover:text-white transition-colors">
                                    {challenge.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                                    {challenge.description}
                                </p>

                                <div className="flex justify-between items-center pt-5 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Best Score</div>
                                        <div className="text-slate-900 dark:text-white font-bold">{challenge.bestScore} WPM</div>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white text-slate-400 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right side: Sidebar */}
            <div className="w-full lg:w-[350px] shrink-0 space-y-5">

                {/* Live Leaderboard Card */}
                <div className="bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] shadow-sm rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 dark:border-[#334155] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Live Rankings</h3>

                        <div className="relative">
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                            >
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {selectedProtocol === "standard" ? "Standard A-Z" :
                                        selectedProtocol === "paragraph" ? "Paragraph" :
                                            selectedProtocol === "developer" ? "Developer Snippet" : "Daily Challenge"}
                                </span>
                                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-90" : ""}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                        {[
                                            { id: "standard", label: "Standard A-Z" },
                                            { id: "paragraph", label: "Paragraph" },
                                            { id: "developer", label: "Developer Snippet" },
                                            { id: "daily", label: "Daily Challenge" }
                                        ].map((opt) => (
                                            <div
                                                key={opt.id}
                                                onClick={() => {
                                                    setSelectedProtocol(opt.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${selectedProtocol === opt.id
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

                    <div className="flex-1 overflow-hidden">
                        {liveLeaderboard.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                Processing Ranks...
                            </div>
                        ) : (
                            liveLeaderboard.map((user, idx) => (
                                <div key={user.user} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                    <div className="w-5 text-center font-bold text-slate-500 text-sm">#{idx + 1}</div>
                                    <div className="relative">
                                        {user.image ? (
                                            <img src={user.image} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f172a] to-slate-800 dark:from-slate-700 dark:to-slate-800 border border-slate-700 shadow-sm flex items-center justify-center text-white text-xs font-black">
                                                {user.user?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1e293b]" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate">{user.user}</div>
                                        <div className="text-[11px] text-slate-500 font-medium truncate">Online</div>
                                    </div>
                                    <div className="font-bold text-cyan-400">
                                        {user.topSpeed} <span className="text-[10px] text-slate-500">WPM</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-[#334155]">
                        <Link href="/leaderboard" className="block w-full py-2.5 text-center text-sm font-bold text-[#0ea5e9] hover:text-[#06b6d4] hover:bg-[#0ea5e9]/10 rounded-xl transition-colors">
                            View Full Leaderboard
                        </Link>
                    </div>
                </div>

                {/* Pro Tip Card */}
                <div className="bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] shadow-sm rounded-2xl p-5 relative overflow-hidden group">
                    <Lightbulb className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-700/10 dark:text-slate-700/20 group-hover:text-yellow-500/10 transition-colors pointer-events-none" />
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        PRO TIP
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
                        Consistent rhythm is better than bursts of speed. Try to maintain a steady pace to reduce error correction time.
                    </p>
                </div>

            </div>
        </div>
    );
}
