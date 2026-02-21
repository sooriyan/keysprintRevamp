"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, ArrowLeft, Loader2, Check, KeyRound, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";

export default function EditProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (session?.user) {
            if (session.user.name) setName(session.user.name);
            // Fetch the extended details securely
            fetch("/api/user/profile")
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        if (data.user.firstName) setFirstName(data.user.firstName);
                        if (data.user.lastName) setLastName(data.user.lastName);
                    }
                })
                .catch(err => console.error("Failed to load extended profile", err));
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const cleanedName = name.trim();
        if (/\s/.test(cleanedName)) {
            setError("Username cannot contain spaces.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: cleanedName, firstName, lastName }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update profile");
            } else {
                setSuccess(true);
                // Hard reload to bust the App Router NextAuth static cache
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you absolutely sure you want to delete your account? This will permanently erase your profile and all tied typing test histories. This action cannot be reversed."
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch("/api/user/profile", { method: "DELETE" });
            if (res.ok) {
                signOut({ callbackUrl: '/' });
            } else {
                alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            alert("Unexpected error during deletion.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-0">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="bg-white dark:bg-[#1e293b]/50 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-sm border border-cyan-100 dark:border-cyan-500/20">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Profile</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Update your display moniker.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl border border-rose-200 dark:border-rose-500/20">{error}</div>}
                    {success && <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2"><Check className="w-4 h-4" /> Profile updated successfully! Returning...</div>}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Username</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
                            placeholder="Enter your public display name"
                            required
                            minLength={2}
                            maxLength={30}
                            className="h-12 bg-slate-50/50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 dark:text-white text-[15px] font-bold rounded-xl focus-visible:ring-cyan-500 shadow-sm transition-colors w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Legal First Name"
                                className="h-12 bg-slate-50/50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 dark:text-white text-[15px] font-bold rounded-xl focus-visible:ring-cyan-500 shadow-sm transition-colors w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Legal Last Name"
                                className="h-12 bg-slate-50/50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 dark:text-white text-[15px] font-bold rounded-xl focus-visible:ring-cyan-500 shadow-sm transition-colors w-full"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="h-12 px-8 bg-[#0ea5e9] hover:bg-[#06b6d4] text-white rounded-xl text-[15px] font-bold shadow-md transition-colors w-full sm:w-auto"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Profile Details"}
                        </Button>
                    </div>
                </form>

                <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Security Settings</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage your password or permanently delete this account.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link href="/forgot-password" target="_blank" className="h-12 px-6 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto">
                            <KeyRound className="w-4 h-4" /> Reset Password
                        </Link>

                        <button onClick={handleDeleteAccount} className="h-12 px-6 flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto border border-rose-200 dark:border-rose-500/20">
                            <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
