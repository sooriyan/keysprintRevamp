"use client";

import React from "react";
import { Navbar } from "@/components/ui/navbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans flex flex-col transition-colors duration-300 bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />
            <main className="flex-1 w-full max-w-[1100px] mx-auto p-6 sm:p-10">
                {children}
            </main>
        </div>
    );
}
