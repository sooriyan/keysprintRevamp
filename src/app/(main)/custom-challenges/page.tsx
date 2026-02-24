"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomChallengesPage() {
    const { data: session } = useSession();
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/custom-challenges")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChallenges(data.data);
                }
            })
            .catch(err => console.error("Failed to fetch challenges:", err))
            .finally(() => setLoading(false));
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "Medium": return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
            case "Hard": return "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
            default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-10 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Community Playground</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Test your skills on custom paragraphs created by other sprinters.</p>
                </div>
                {session ? (
                    <Link href="/custom-challenges/create" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl font-bold bg-[#0ea5e9] hover:bg-[#06b6d4] text-white transition-colors shadow-sm shrink-0">
                        <Plus className="w-5 h-5" /> Create Challenge
                    </Link>
                ) : (
                    <div className="text-sm font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        Sign in to create a challenge
                    </div>
                )}
            </div>

            {loading ? (
                <div className="w-full flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-300 dark:text-slate-700" />
                </div>
            ) : challenges.length === 0 ? (
                <div className="w-full text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-slate-500 font-bold mb-4">No custom challenges found.</p>
                    {session && (
                        <Link href="/custom-challenges/create" className="text-[#0ea5e9] hover:underline font-bold">Be the first to create one!</Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {challenges.map((challenge) => (
                        <Link href={`/custom-challenges/${challenge._id}`} key={challenge._id} className="group relative bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-6 shadow-sm flex flex-col transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-[#0ea5e9] transition-colors truncate pr-4">{challenge.title}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getDifficultyColor(challenge.averageDifficulty)} shrink-0`}>
                                    {challenge.averageDifficulty}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 font-mono bg-slate-50 dark:bg-[#0f172a] p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                                {challenge.content}
                            </p>

                            <div className="mt-auto flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created By</div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{challenge.creatorName}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plays</div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        {challenge.playCount} <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
