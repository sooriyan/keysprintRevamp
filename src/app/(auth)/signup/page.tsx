"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Lock, Mail, ArrowRight, AtSign, RefreshCw, ShieldCheck, Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (e.target.name === "username") {
            value = value.replace(/\s/g, "");
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const cleanedUsername = formData.username.trim();
        if (/\s/.test(cleanedUsername)) {
            setError("Username cannot contain spaces");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, username: cleanedUsername }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess("Account created successfully! Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.message || "Failed to create account");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Top Navigation for Signup */}
            <div className="absolute top-0 left-0 w-full p-6 sm:p-10 flex justify-between items-center z-20">
                <Logo className="text-slate-900 dark:text-white" iconClassName="w-8 h-8" textClassName="text-2xl" />
                <div className="text-[15px] text-slate-500 font-medium flex items-center gap-2">
                    Already a member?{" "}
                    <Link href="/login" className="text-[#0ea5e9] font-bold hover:text-[#0284c7] transition-colors">
                        Log In
                    </Link>
                </div>
            </div>

            {/* Main Split Card */}
            <div className="w-full max-w-[1000px] bg-white dark:bg-[#1e293b]/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800 mt-16 md:mt-0">
                {/* Left Panel */}
                <div className="w-full md:w-[45%] bg-[#f8fafc] dark:bg-[#0f172a]/50 p-10 sm:p-12 flex flex-col relative border-r border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700">
                        <Keyboard className="w-6 h-6 text-[#0ea5e9]" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
                        Unlock<br />
                        <span className="text-[#0ea5e9]">Your Speed</span>
                    </h1>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-10 mt-4 pr-4">
                        Join the fastest growing typing community. Track your WPM, compete on leaderboards, and master your keyboard.
                    </p>

                    <div className="mt-auto relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-inner bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl border border-slate-700/50">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-900 opacity-80" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-slate-400 font-medium text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        Secure Encryption
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-[55%] p-10 sm:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create your account</h2>
                        <p className="text-slate-500 font-medium mt-2 text-[15px]">Enter your details below to get started.</p>
                    </div>

                    <div className="flex justify-center mb-6">
                        <Button
                            variant="outline"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                        >
                            <Icons.google className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                    </div>

                    <div className="mb-6 flex items-center">
                        <div className="flex-1 border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Or continue with email
                        </span>
                        <div className="flex-1 border-t border-slate-100 dark:border-slate-800"></div>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl font-medium border border-red-100">{error}</div>}
                        {success && <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-xl font-medium border border-emerald-100">{success}</div>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="username" value={formData.username} onChange={handleChange} placeholder="speedracer" required className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="jane@example.com" required className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="password" value={formData.password} onChange={handleChange} required type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 text-lg tracking-widest placeholder:tracking-normal placeholder:text-base shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <RefreshCw className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                                    <Input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-cyan-500 text-lg tracking-widest placeholder:tracking-normal placeholder:text-base shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 pt-2">
                            <Checkbox id="terms" className="mt-1 data-[state=checked]:bg-[#0ea5e9] data-[state=checked]:border-[#0ea5e9] rounded-sm" />
                            <label htmlFor="terms" className="text-sm text-slate-500 font-medium leading-relaxed">
                                By creating an account, you agree to the{" "}
                                <Link href="/terms" className="text-[#0ea5e9] hover:underline">Terms of Service</Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-[#0ea5e9] hover:underline">Privacy Policy</Link>.
                            </label>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#22d3ee] hover:bg-[#06b6d4] text-white rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-cyan-500/20 transition-all">
                            {loading ? "Creating Account..." : "Create Account"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
