"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Bell, UserCircle, LogOut, Sun, Moon, Settings, User, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/challenge", label: "Challenges" },
        { href: "/leaderboard", label: "Leaderboard" },
    ];

    return (
        <nav className="w-full h-20 border-b flex items-center justify-between px-6 sm:px-10 z-50 relative bg-white dark:bg-[#0f172a] border-slate-200 dark:border-[#1e293b] text-slate-800 dark:text-white transition-colors duration-300">
            <Link href="/">
                <Logo
                    className="text-slate-900 dark:text-white"
                    textClassName="text-slate-900 dark:text-white"
                />
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-semibold transition-colors ${pathname === link.href
                            ? "text-[#0ea5e9]"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1e293b] dark:hover:text-white transition-all hidden sm:flex"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                {status === "unauthenticated" ? (
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                        <Link href="/signup" className="text-sm font-semibold bg-[#22d3ee] hover:bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl transition-colors">Sign Up</Link>
                    </div>
                ) : status === "authenticated" ? (
                    <div className="hidden sm:flex items-center gap-3">
                        <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#334155] transition-all">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-[#1e293b] hover:border-[#0ea5e9] dark:hover:border-[#0ea5e9] transition-all cursor-pointer">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="User Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-indigo-400 to-cyan-400 text-white font-bold">{session.user?.name?.charAt(0) || "U"}</div>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] shadow-xl rounded-2xl p-2 font-medium">
                                    <DropdownMenuLabel className="font-bold text-slate-500 dark:text-slate-400 text-xs tracking-widest uppercase">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-2" />
                                    <Link href="/profile/edit">
                                        <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e293b] focus:bg-slate-50 dark:focus:bg-[#1e293b] text-slate-700 dark:text-slate-200">
                                            <User className="w-4 h-4" /> My Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer gap-2 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-500">
                                        <LogOut className="w-4 h-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-[#1e293b] animate-pulse bg-slate-100 dark:bg-slate-800 hidden sm:block" />
                )}

                {/* Mobile Menu Drawer */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-[#0f172a] border-slate-200 dark:border-[#1e293b] flex flex-col p-0">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between">
                            <SheetTitle className="text-left">
                                Menu
                            </SheetTitle>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1e293b] dark:hover:text-white transition-all sm:hidden"
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </button>
                        </div>
                        <div className="flex flex-col h-full overflow-y-auto w-full">
                            <div className="flex flex-col p-6 gap-2 border-b border-slate-200 dark:border-[#1e293b]">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-lg font-bold py-3 px-4 rounded-xl transition-colors ${pathname === link.href
                                            ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1e293b]"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="p-6 mt-auto">
                                {status === "unauthenticated" ? (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 border-2 border-slate-200 dark:border-slate-800 dark:hover:text-white transition-colors py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e293b]">
                                            Sign In
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full text-center text-sm font-semibold bg-[#22d3ee] hover:bg-[#06b6d4] text-white py-3 rounded-xl transition-colors">
                                            Sign Up
                                        </Link>
                                    </div>
                                ) : status === "authenticated" ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 mb-4 px-2">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-[#1e293b]">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt="User Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-indigo-400 to-cyan-400 text-white font-bold">{session.user?.name?.charAt(0) || "U"}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">{session.user?.name || "User"}</span>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{session.user?.email || ""}</span>
                                            </div>
                                        </div>

                                        <Link href="/profile/edit" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-[#1e293b] transition-colors py-3 px-4 rounded-xl">
                                            <User className="w-5 h-5" /> My Profile
                                        </Link>
                                        <button onClick={() => { setIsOpen(false); signOut(); }} className="flex w-full items-center gap-3 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors py-3 px-4 rounded-xl">
                                            <LogOut className="w-5 h-5" /> Log out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
