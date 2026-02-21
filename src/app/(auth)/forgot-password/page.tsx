"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || "Reset link sent!");
                // Simulate checking email in development
                if (data.devToken) console.log("Dev Reset Token:", data.devToken);
            } else {
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] bg-white dark:bg-[#1e293b]/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-slate-100 dark:border-[#334155]">
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Mail className="w-7 h-7 text-[#0ea5e9]" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center mb-2">
                    Forgot Password?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] text-center max-w-[300px]">
                    No worries, we'll send you reset instructions.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl font-medium border border-red-100">{error}</div>}
                {success && <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-xl font-medium border border-emerald-100">{success}</div>}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="pl-11 h-12 bg-slate-50/50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 dark:text-white text-[15px] rounded-xl focus-visible:ring-cyan-500 shadow-sm transition-colors"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading || !!success}
                    className="w-full h-12 bg-[#22d3ee] hover:bg-[#06b6d4] text-white rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                    {loading ? "Sending link..." : "Send Reset Link"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
            </form>

            <div className="mt-8 text-center text-[15px] text-slate-500 font-medium flex items-center justify-center">
                <Link href="/login" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Back to log in
                </Link>
            </div>
        </div>
    );
}
