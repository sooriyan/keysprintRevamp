"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, RefreshCw, Trophy, Target, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CHALLENGE_TEXTS: Record<string, string[]> = {
    standard: ["abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"],
    paragraph: [
        "The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step. To be or not to be, that is the question. All that glitters is not gold.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. In the middle of every difficulty lies opportunity. Believe you can and you're halfway there.",
        "Happiness depends upon ourselves. It is not something ready made. It comes from your own actions. The purpose of our lives is to be happy. Life is what happens when you're busy."
    ],
    developer: [
        "const handleUpload = async (file: File) => {\n  if (!file) return null;\n  const formData = new FormData();\n  formData.append('data', file);\n  return await api.post('/upload');\n};",
        "function debounce(func: Function, wait: number) {\n  let timeout: NodeJS.Timeout;\n  return function executedFunction(...args: any[]) {\n    const later = () => {\n      clearTimeout();\n    };\n  };\n}",
        "class Singleton {\n  private static instance: Singleton;\n  private constructor() { }\n  public static getInstance(): Singleton {\n    if (!Singleton.instance) {\n      Singleton.instance;\n    }\n  }\n}"
    ],
    daily: [
        "Welcome to the daily keysprint challenge. This text changes exactly once every twenty-four hours for all users across the entire globe. Compete to lock in the fastest time today.",
        "The daily sprint tests your consistency. Every day presents a new sequence of characters to master. Can you maintain your position at the top of the leaderboard against the world?",
        "Another day, another challenge. Focus your mind, steady your hands, and prepare to type. The path to perfection is paved with daily practice and unrelenting determination to win."
    ]
};

const CHALLENGE_NAMES: Record<string, string> = {
    standard: "Standard A-Z",
    paragraph: "Paragraph Challenge",
    developer: "Developer Snippet",
    daily: "Global Daily Challenge"
};

function getDailyIndex(max: number) {
    const today = new Date();
    // Use Year + Month + Date as a deterministic seed
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed % max;
}

export default function ChallengeGamePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params.id as string;

    const [originalText, setOriginalText] = useState("");

    useEffect(() => {
        const textArray = CHALLENGE_TEXTS[id] || CHALLENGE_TEXTS["standard"];
        if (id === 'daily') {
            setOriginalText(textArray[getDailyIndex(textArray.length)]);
        } else {
            // Randomize for others
            setOriginalText(textArray[Math.floor(Math.random() * textArray.length)]);
        }
    }, [id]);

    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, time: 0 });
    const [saving, setSaving] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (status === "finished") return;

        const value = e.target.value;
        setInput(value);

        if (status === "idle" && value.length > 0) {
            setStatus("playing");
            setStartTime(Date.now());
        }

        if (value.length >= originalText.length) {
            finishGame(value);
        }
    };

    const finishGame = async (finalInput: string) => {
        setStatus("finished");
        const end = Date.now();
        setEndTime(end);

        const timeTakenSec = (end - (startTime || end)) / 1000;
        const timeTakenMin = timeTakenSec / 60;

        let correctChars = 0;
        for (let i = 0; i < originalText.length; i++) {
            if (finalInput[i] === originalText[i]) correctChars++;
        }

        const accuracy = Math.round((correctChars / originalText.length) * 100);
        // Standard formula: (total characters / 5) / time in min. Here we use correctChars for net WPM.
        const wpm = Math.round((correctChars / 5) / (timeTakenMin || 1));

        setStats({ wpm, accuracy, time: Math.round(timeTakenSec) });

        // Save to DB
        setSaving(true);
        try {
            await fetch("/api/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    challengeType: id,
                    wpm,
                    accuracy,
                    timeTaken: Math.round(timeTakenSec)
                })
            });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const resetGame = () => {
        const textArray = CHALLENGE_TEXTS[id] || CHALLENGE_TEXTS["standard"];
        if (id !== 'daily') {
            let nextText = textArray[Math.floor(Math.random() * textArray.length)];
            // If there's more than one possible text, ensure we get a new one to prevent perceived non-resets
            if (textArray.length > 1) {
                while (nextText === originalText) {
                    nextText = textArray[Math.floor(Math.random() * textArray.length)];
                }
            }
            // Use setTimeout to ensure state updates sequentially if React batches them too aggressively
            setTimeout(() => {
                setOriginalText(nextText);
            }, 0);
        }

        setInput("");
        setStatus("idle");
        setStartTime(null);
        setEndTime(null);
        setStats({ wpm: 0, accuracy: 0, time: 0 });

        // Force focus back to textarea
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.value = ""; // Force DOM clear
                inputRef.current.focus();
            }
        }, 10);
    };

    // Render characters with styling based on correctness
    const renderText = () => {
        return originalText.split("").map((char, index) => {
            let stateClass = "text-slate-400 dark:text-slate-500 opacity-60"; // not typed yet

            if (index < input.length) {
                if (input[index] === char) {
                    stateClass = "text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20"; // correct
                } else {
                    stateClass = "text-rose-500 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/30 underline decoration-rose-500/50"; // incorrect
                }
            } else if (index === input.length && status !== "finished") {
                stateClass = "border-b-2 border-cyan-500 text-slate-900 dark:text-white font-bold animate-pulse bg-cyan-50 dark:bg-cyan-900/20"; // current cursor
            }

            return (
                <span key={index} className={`transition-colors duration-100 rounded-sm ${stateClass}`}>
                    {char === '\n' ? '↵\n' : char}
                </span>
            );
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">

            <div className="w-full flex justify-between items-center mb-10">
                <Link href="/challenge" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Protocols
                </Link>
                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                    {CHALLENGE_NAMES[id] || "Unknown Mode"}
                </div>
            </div>

            {/* Main Game Card */}
            <div className="w-full bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] p-8 sm:p-12 rounded-3xl shadow-sm relative overflow-hidden transition-colors">

                {status === "finished" ? (
                    <div className="flex flex-col items-center justify-center py-10 animation-fade-in">
                        <div className="w-20 h-20 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-6 border-4 border-cyan-100 dark:border-cyan-500/20">
                            <Trophy className="w-10 h-10 text-cyan-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Challenge Complete!</h2>
                        {!session && <p className="text-amber-600 dark:text-amber-400 text-sm font-bold bg-amber-50 dark:bg-amber-500/10 px-4 py-1.5 rounded-full mb-8 border border-amber-200 dark:border-amber-500/20">Guest Mode: Stats were not saved.</p>}
                        {session && saving && <p className="text-slate-500 text-sm font-medium mb-8">Saving to leaderboard...</p>}
                        {session && !saving && <p className="text-emerald-500 text-sm font-bold mb-8">Result saved to your profile!</p>}

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

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button onClick={resetGame} variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200 dark:border-slate-700 flex gap-2 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </Button>
                            <Button onClick={() => setIsShareOpen(true)} className="h-12 px-6 rounded-xl font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors">
                                Share Result
                            </Button>
                            <Button onClick={() => router.push('/leaderboard')} className="h-12 px-6 rounded-xl font-bold bg-[#0ea5e9] hover:bg-[#06b6d4] text-white flex gap-2 transition-colors">
                                View Leaderboard
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full bg-cyan-500 transition-all duration-200"
                                style={{ width: `${(input.length / originalText.length) * 100}%` }}
                            />
                        </div>

                        <div
                            className="font-mono text-2xl md:text-3xl leading-[1.8] text-left break-words whitespace-pre-wrap select-none mt-4 cursor-text"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {renderText()}
                        </div>

                        {/* Hidden Input field intercepting everything */}
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Tab') {
                                    e.preventDefault();

                                    const value = input + "  ";
                                    setInput(value);

                                    if (status === "idle" && value.length > 0) {
                                        setStatus("playing");
                                        setStartTime(Date.now());
                                    }

                                    if (value.length >= originalText.length) {
                                        finishGame(value);
                                    }
                                }
                            }}
                            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-text resize-none z-0"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />

                        {(status === "idle" || status === "playing") && (
                            <div className="flex justify-between items-center mt-12 relative z-50 pointer-events-none">
                                <div className={`text-xs font-bold text-slate-400 uppercase tracking-widest ${status === 'idle' ? 'animate-pulse' : ''} pointer-events-auto`}>
                                    {status === "idle" ? "Start typing to begin" : "Typing..."}
                                </div>
                                <button onClick={resetGame} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors tooltip overflow-hidden group pointer-events-auto">
                                    <RefreshCw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Share Modal */}
            {isShareOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsShareOpen(false)}>
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2rem] p-8 shadow-2xl scale-in-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Share Your Speed</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Challenge your friends to beat you.</p>

                        <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-col items-center">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{CHALLENGE_NAMES[id] || "Challenge"}</div>
                            <div className="text-5xl font-black text-[#0ea5e9] mb-4">{stats.wpm}</div>

                            <div className="w-full flex justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 px-2 text-sm font-bold">
                                <span className="text-slate-500">Accuracy</span>
                                <span className="text-emerald-500">{stats.accuracy}%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`I just hit ${stats.wpm} WPM & ${stats.accuracy}% Accuracy in ${stats.time}s on the Keysprint ${CHALLENGE_NAMES[id] || "Typing"} Challenge! Can you beat me? https://keysprint.in`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just hit ${stats.wpm} WPM & ${stats.accuracy}% Accuracy in ${stats.time}s on the Keysprint ${CHALLENGE_NAMES[id] || "Typing"} Challenge! Can you beat me?`)}&url=https://keysprint.in`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                X (Twitter)
                            </a>
                        </div>
                        <div className="space-y-3">
                            <a
                                href={`mailto:?subject=Check out my Keysprint stats!&body=${encodeURIComponent(`I just hit ${stats.wpm} WPM & ${stats.accuracy}% Accuracy in ${stats.time}s on the Keysprint ${CHALLENGE_NAMES[id] || "Typing"} Challenge! Can you beat me?\n\nPlay here: https://keysprint.in`)}`}
                                className="w-full flex justify-center py-3.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors"
                            >
                                Share via Email
                            </a>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`I just hit ${stats.wpm} WPM & ${stats.accuracy}% Accuracy in ${stats.time}s on the Keysprint ${CHALLENGE_NAMES[id] || "Typing"} Challenge! Can you beat me? https://keysprint.in`);
                                    alert('Copied to clipboard!');
                                }}
                                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                Copy Link
                            </button>
                            <button onClick={() => setIsShareOpen(false)} className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
