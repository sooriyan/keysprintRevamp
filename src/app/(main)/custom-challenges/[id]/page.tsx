"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Target, Zap, Clock, Star, MessageSquare, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlayCustomChallengePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params.id as string;

    const [challenge, setChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Typing Game State
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, time: 0 });
    const [testMissedChars, setTestMissedChars] = useState<string[]>([]);
    const [testMissedWords, setTestMissedWords] = useState<string[]>([]);
    const [avgKeyDelay, setAvgKeyDelay] = useState(0);
    const [avgWordDelay, setAvgWordDelay] = useState(0);
    const [maxKeyDelay, setMaxKeyDelay] = useState(0);
    const [maxWordDelay, setMaxWordDelay] = useState(0);

    // Review State
    const [rating, setRating] = useState<"Easy" | "Medium" | "Hard" | "">("");
    const [comment, setComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lastKeyTimeRef = useRef<number>(0);
    const lastWordTimeRef = useRef<number>(0);
    const maxKeyDelayRef = useRef<number>(0);
    const maxWordDelayRef = useRef<number>(0);

    useEffect(() => {
        fetch(`/api/custom-challenges/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChallenge(data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (inputRef.current && status !== "finished") inputRef.current.focus();
    }, [status, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (status === "finished" || !challenge) return;

        const value = e.target.value;
        setInput(value);

        if (status === "idle" && value.length === 1) {
            setStatus("playing");
            const now = Date.now();
            setStartTime(now);
            lastKeyTimeRef.current = now;
            lastWordTimeRef.current = now;
            maxKeyDelayRef.current = 0;
            maxWordDelayRef.current = 0;
        }

        if (status === "playing" && value.length > input.length) {
            const now = Date.now();
            const keyDelay = now - lastKeyTimeRef.current;
            maxKeyDelayRef.current = Math.max(maxKeyDelayRef.current, keyDelay);
            lastKeyTimeRef.current = now;

            if (value.endsWith(' ') && !input.endsWith(' ')) {
                const wordDelay = now - lastWordTimeRef.current;
                maxWordDelayRef.current = Math.max(maxWordDelayRef.current, wordDelay);
                lastWordTimeRef.current = now;
            }
        }

        if (value.length >= challenge.content.length) {
            finishGame(value);
        }
    };

    const finishGame = (finalInput: string) => {
        setStatus("finished");
        const end = Date.now();
        setEndTime(end);

        const timeTakenSec = (end - (startTime || end)) / 1000;
        const timeTakenMin = timeTakenSec / 60;

        let correctChars = 0;
        const missedChars: Record<string, number> = {};

        for (let i = 0; i < challenge.content.length; i++) {
            if (finalInput[i] === challenge.content[i]) {
                correctChars++;
            } else if (challenge.content[i]) {
                const char = challenge.content[i].toLowerCase();
                if (char.trim()) {
                    missedChars[char] = (missedChars[char] || 0) + 1;
                }
            }
        }

        const missedWords: Record<string, number> = {};
        const originalWords = challenge.content.split(/\s+/);
        const inputWords = finalInput.split(/\s+/);

        originalWords.forEach((word: string, index: number) => {
            if (inputWords[index] !== word) {
                const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
                if (cleanWord.length > 0) {
                    missedWords[cleanWord] = (missedWords[cleanWord] || 0) + 1;
                }
            }
        });

        const accuracy = Math.round((correctChars / challenge.content.length) * 100);
        const wpm = Math.round((correctChars / 5) / (timeTakenMin || 1));

        const timeTakenMs = end - (startTime || end);
        const avgCharTime = Math.round(timeTakenMs / (challenge.content.length || 1));
        const avgWordTime = Math.round(timeTakenMs / (originalWords.length || 1));

        const finalWordDelay = end - lastWordTimeRef.current;
        const finalMaxWordDelay = Math.max(maxWordDelayRef.current, finalWordDelay);

        setStats({ wpm, accuracy, time: Math.round(timeTakenSec) });
        setTestMissedChars(Object.entries(missedChars).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]));
        setTestMissedWords(Object.entries(missedWords).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]));
        setAvgKeyDelay(avgCharTime);
        setAvgWordDelay(avgWordTime);
        setMaxKeyDelay(maxKeyDelayRef.current);
        setMaxWordDelay(finalMaxWordDelay);
        // Can optionally post score to global leaderboard from here too if needed
        // Since it's a typing test, we can use the same generic results endpoint:
        fetch("/api/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                challengeType: "custom", // Note: You might map this to developer/standard based on content type if desired
                wpm,
                accuracy,
                timeTaken: Math.round(timeTakenSec),
                missedChars,
                missedWords,
                avgTimeBetweenLetters: avgCharTime,
                avgTimeBetweenWords: avgWordTime,
                maxTimeBetweenLetters: maxKeyDelayRef.current,
                maxTimeBetweenWords: finalMaxWordDelay
            })
        }).catch(err => console.error(err));
    };

    const resetGame = () => {
        setInput("");
        setStatus("idle");
        setStartTime(null);
        setEndTime(null);
        setStats({ wpm: 0, accuracy: 0, time: 0 });
        setTestMissedChars([]);
        setTestMissedWords([]);
        setAvgKeyDelay(0);
        setAvgWordDelay(0);
        setMaxKeyDelay(0);
        setMaxWordDelay(0);
        lastKeyTimeRef.current = 0;
        lastWordTimeRef.current = 0;
        maxKeyDelayRef.current = 0;
        maxWordDelayRef.current = 0;
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            setReviewError("Please select a difficulty rating.");
            return;
        }
        if (!comment.trim()) {
            setReviewError("Please write a comment.");
            return;
        }

        setIsSubmittingReview(true);
        setReviewError("");

        try {
            const res = await fetch(`/api/custom-challenges/${id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit review");

            // Update local state to show new review
            setChallenge({ ...challenge, reviews: data.data });
            setComment("");
            setRating("");
        } catch (err: any) {
            setReviewError(err.message);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const renderText = () => {
        if (!challenge) return null;
        return challenge.content.split("").map((char: string, index: number) => {
            let stateClass = "text-slate-400 dark:text-slate-500 opacity-60";
            if (index < input.length) {
                if (input[index] === char) stateClass = "text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20";
                else stateClass = "text-rose-500 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/30 underline decoration-rose-500/50";
            } else if (index === input.length && status !== "finished") {
                stateClass = "border-b-2 border-cyan-500 text-slate-900 dark:text-white font-bold animate-pulse bg-cyan-50 dark:bg-cyan-900/20";
            }
            return (
                <span key={index} className={`transition-colors duration-100 rounded-sm ${stateClass}`}>
                    {char === '\n' ? '↵\n' : char}
                </span>
            );
        });
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    }

    if (!challenge) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 text-xl">Challenge Not Found</div>;
    }

    const hasReviewed = session && challenge.reviews.some((r: any) => r.user.toString() === (session.user as any).id);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center py-10 px-4">
            <div className="w-full flex justify-between items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
                <Link href="/custom-challenges" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Playground
                </Link>
                <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{challenge.title}</h1>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">By {challenge.creatorName}</div>
                </div>
            </div>

            {/* Game Canvas */}
            <div className="w-full bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] p-8 sm:p-12 rounded-3xl shadow-sm relative overflow-hidden transition-colors mb-12">
                {status === "finished" ? (
                    <div className="flex flex-col items-center justify-center py-10 animation-fade-in">
                        <div className="w-20 h-20 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-6 border-4 border-cyan-100 dark:border-cyan-500/20">
                            <Trophy className="w-10 h-10 text-cyan-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Challenge Complete!</h2>

                        <div className="flex flex-row justify-center items-center gap-4 sm:gap-12 mb-10 w-full">
                            <div className="text-center flex-1">
                                <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-center items-center gap-1 sm:gap-1.5"><Zap className="w-3 h-3 sm:w-4 sm:h-4" /> WPM</div>
                                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{stats.wpm}</div>
                            </div>
                            <div className="w-px h-12 sm:h-16 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center flex-1">
                                <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-center items-center gap-1 sm:gap-1.5"><Target className="w-3 h-3 sm:w-4 sm:h-4" /> ACC</div>
                                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{stats.accuracy}%</div>
                            </div>
                            <div className="w-px h-12 sm:h-16 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center flex-1">
                                <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-center items-center gap-1 sm:gap-1.5"><Clock className="w-3 h-3 sm:w-4 sm:h-4" /> TIME</div>
                                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{stats.time}s</div>
                            </div>
                        </div>

                        {/* Test Insights Analytics */}
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 text-left">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                                <span className="text-xs font-bold text-amber-500 tracking-widest uppercase mb-3 block">Pain Points</span>
                                {testMissedChars.length > 0 || testMissedWords.length > 0 ? (
                                    <div className="space-y-4">
                                        {testMissedChars.length > 0 && (
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Keys</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {testMissedChars.map((l: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-500/20 shadow-sm">{l}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {testMissedWords.length > 0 && (
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Word Sequences</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {testMissedWords.map((w: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-500/20 shadow-sm">{w}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Flawless execution! You didn't miss any characters.
                                    </p>
                                )}
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                                <span className="text-xs font-bold text-purple-500 tracking-widest uppercase mb-3 block">Area to Improve</span>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {stats.accuracy < 90
                                        ? "Accuracy is crucial! Slow down and focus on hitting every key cleanly instead of pushing raw speed."
                                        : stats.accuracy < 96
                                            ? "Solid typing! Try to eliminate those few remaining typos to significantly boost your net WPM."
                                            : "Incredible precision! You can start pushing your boundaries on speed since your accuracy is locked in."}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                                <span className="text-xs font-bold text-cyan-500 tracking-widest uppercase mb-3 block">Cadence Profile</span>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex flex-col mb-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Avg / Key</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none whitespace-nowrap mt-1">{avgKeyDelay} <span className="text-xs text-slate-400 font-bold">ms</span></span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col mb-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Max / Key</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none whitespace-nowrap mt-1">{maxKeyDelay} <span className="text-xs text-slate-400 font-bold">ms</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(10, (100 - (avgKeyDelay / 10))))}%` }}></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <div className="flex flex-col mb-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Avg / Word</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none whitespace-nowrap mt-1">{avgWordDelay} <span className="text-xs text-slate-400 font-bold">ms</span></span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col mb-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Max / Word</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none whitespace-nowrap mt-1">{maxWordDelay} <span className="text-xs text-slate-400 font-bold">ms</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(10, (100 - (avgWordDelay / 50))))}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button onClick={resetGame} variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200 dark:border-slate-700 flex gap-2">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                            <div className="h-full bg-cyan-500 transition-all duration-200" style={{ width: `${(input.length / challenge.content.length) * 100}%` }} />
                        </div>
                        <div className="font-mono text-2xl md:text-3xl leading-[1.8] text-left break-words whitespace-pre-wrap select-none mt-4 cursor-text" onClick={() => inputRef.current?.focus()}>
                            {renderText()}
                        </div>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleChange}
                            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-text resize-none z-0"
                            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                        />
                        {(status === "idle" || status === "playing") && (
                            <div className="flex justify-between items-center mt-12 relative z-50 pointer-events-none">
                                <div className={`text-xs font-bold text-slate-400 uppercase tracking-widest ${status === 'idle' ? 'animate-pulse' : ''} pointer-events-auto`}>
                                    {status === "idle" ? "Start typing to begin" : "Typing..."}
                                </div>
                                <button onClick={resetGame} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors pointer-events-auto">
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Ratings & Comments Section */}
            <div className="w-full">
                <div className="flex items-center gap-3 mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-[#0ea5e9]" /> Ratings & Feedback
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">{challenge.reviews.length}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Review Form */}
                    <div className="lg:col-span-1">
                        {!session ? (
                            <div className="bg-slate-50 dark:bg-[#1e293b]/30 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-sm font-medium text-slate-500 mb-4">Sign in to rate and comment on this challenge.</p>
                                <Link href="/login" className="inline-block px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm">Sign In</Link>
                            </div>
                        ) : hasReviewed ? (
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-500/20 text-center">
                                <Star className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">You have already reviewed this challenge. Thank you for the feedback!</p>
                            </div>
                        ) : (
                            <form onSubmit={submitReview} className="bg-white dark:bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="font-black text-slate-900 dark:text-white mb-4">Leave a Review</h4>

                                {reviewError && <p className="text-xs font-bold text-rose-500 mb-4">{reviewError}</p>}

                                <div className="flex gap-2 mb-4">
                                    {['Easy', 'Medium', 'Hard'].map(lvl => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setRating(lvl as any)}
                                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border ${rating === lvl ? 'bg-[#0ea5e9] text-white border-[#0ea5e9]' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="What did you think of the snippet?"
                                    className="w-full h-24 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none mb-4"
                                />
                                <Button type="submit" disabled={isSubmittingReview} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 border-0">
                                    {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Submit Review</>}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-4">
                        {challenge.reviews.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-medium">
                                No reviews yet. Be the first to share your thoughts!
                            </div>
                        ) : (
                            // Sort by newest string matching using simple reverse
                            [...challenge.reviews].reverse().map((r: any, i: number) => {
                                const diffColors: Record<string, string> = {
                                    Easy: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
                                    Medium: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
                                    Hard: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                                };
                                return (
                                    <div key={i} className="bg-white dark:bg-[#1e293b]/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                            {r.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-slate-900 dark:text-white">{r.username}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${diffColors[r.rating]}`}>{r.rating}</span>
                                                <span className="text-xs font-medium text-slate-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">{r.comment}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
