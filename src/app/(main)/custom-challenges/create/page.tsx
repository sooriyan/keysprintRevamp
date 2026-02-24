"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Send, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateCustomChallengePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    }

    if (status === "unauthenticated") {
        return (
            <div className="max-w-xl mx-auto py-20 px-6 text-center">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Hold Up!</h1>
                <p className="text-slate-500 mb-8">You need to sign in to create custom challenges.</p>
                <Link href="/login" className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:scale-105 transition-transform">
                    Sign In
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (content.length < 50) {
            setError("The paragraph must be at least 50 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/custom-challenges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create challenge");

            // Redirect back to listing or direct to the new challenge id
            router.push("/custom-challenges");
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            <Link href="/custom-challenges" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Playground
            </Link>

            <div className="bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create a Challenge</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">Provide a title and the exact text snippet you want others to type.</p>

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Challenge Title</label>
                        <input
                            type="text"
                            required
                            maxLength={50}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Crazy Programming Syntax, Long Endurance Wall"
                            className="w-full h-14 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Paragraph Content</label>
                            <span className={`text-xs font-bold ${content.length < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{content.length}/2000 chars</span>
                        </div>
                        <textarea
                            required
                            maxLength={2000}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type or paste the snippet here..."
                            className="w-full h-48 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || content.length < 50}
                        className="w-full h-14 rounded-xl bg-[#0ea5e9] hover:bg-[#06b6d4] text-white font-black text-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        Submit Challenge
                    </Button>
                </form>
            </div>
        </div>
    );
}
