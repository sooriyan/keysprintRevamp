"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User as UserIcon, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!res?.error) {
                window.location.href = "/dashboard";
            } else {
                setError(res.error || "Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-slate-100 dark:bg-[#1e293b]/50 dark:border-[#334155]">
            <div className="flex flex-col items-center mb-8">
                <Logo className="mb-3 text-slate-900 dark:text-white" iconClassName="w-8 h-8" textClassName="text-3xl" />
                <p className="text-slate-500 font-medium text-[15px]">Welcome back, Sprinter.</p>
            </div>

            <form className="space-y-5" onSubmit={handleCredentialsLogin}>
                {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 font-medium">{error}</div>}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
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

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
                        >
                            (Forgot?)
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="pl-11 pr-11 h-12 bg-slate-50/50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 dark:text-white text-[15px] rounded-xl focus-visible:ring-cyan-500 shadow-sm transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#22d3ee] hover:bg-[#06b6d4] text-white rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                    {loading ? "Logging in..." : "Login to Dashboard"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
            </form>

            <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-slate-100"></div>
                <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Or Sign in with
                </span>
                <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-[14px] shadow-sm transition-colors"
                >
                    <Icons.google className="w-5 h-5 mr-2" />
                    Continue with Google
                </Button>
            </div>

            <div className="mt-8 text-center text-[15px] text-slate-500 font-medium">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#0ea5e9] font-semibold hover:text-[#0284c7] transition-colors">
                    Start Typing
                </Link>
            </div>
        </div>
    );
}
