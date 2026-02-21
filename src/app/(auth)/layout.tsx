"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Abstract Background Elements (Hidden on mobile for cleaner look) */}
            <div className="hidden md:block absolute top-[10%] left-[5%] w-96 h-96 bg-[#22d3ee]/20 dark:bg-[#22d3ee]/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="hidden md:block absolute top-[20%] right-[10%] w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="hidden md:block absolute bottom-[10%] left-[20%] w-96 h-96 bg-pink-300/20 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative z-10 w-full min-h-[calc(100vh-80px)]">
                {children}
            </main>

            {/* Auth Footer */}
            <footer className="w-full h-20 flex items-center justify-center gap-6 text-[13px] font-semibold text-slate-400 dark:text-slate-500 relative z-10">
                <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy</Link>
                <Link href="/help" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Help</Link>
            </footer>
        </div>
    );
}
