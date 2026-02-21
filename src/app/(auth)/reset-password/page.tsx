"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!token) {
            setError("Missing reset token in URL.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess("Password reset successful! Redirecting...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] bg-white dark:bg-[#1e293b]/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 sm:p-10 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center mb-2">
                    Set New Password
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] text-center max-w-[300px]">
                    Must be at least 8 characters long.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className="p-3 bg-red-50 dark:bg-rose-500/10 text-red-500 dark:text-rose-400 text-sm rounded-xl font-medium border border-red-100 dark:border-rose-500/20">{error}</div>}
                {success && <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl font-medium border border-emerald-100 dark:border-emerald-500/20">{success}</div>}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-11 pr-11 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white text-[15px] tracking-widest placeholder:tracking-normal rounded-xl focus-visible:ring-cyan-500 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-11 pr-11 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white text-[15px] tracking-widest placeholder:tracking-normal rounded-xl focus-visible:ring-cyan-500 shadow-sm"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading || !!success}
                    className="w-full h-12 bg-[#22d3ee] hover:bg-[#06b6d4] text-white rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-cyan-500/20 transition-all"
                >
                    {loading ? "Resetting Password..." : "Reset Password"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
            </form>

            <div className="mt-8 text-center text-[15px] text-slate-500 dark:text-slate-400 font-medium">
                Back to{" "}
                <Link href="/login" className="text-[#0ea5e9] font-semibold hover:text-[#0284c7] transition-colors">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center text-slate-500">Loading form...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
