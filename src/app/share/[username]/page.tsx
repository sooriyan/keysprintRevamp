import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { TypingResult } from "@/models/TypingResult";
import { ACHIEVEMENTS } from "@/app/api/user/stats/route";
import { Type, AlignLeft, Code2, CalendarDays, Zap, TrendingUp, Medal, Star, Shield, Moon, Flame, Target, Crown } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = { Zap, Flame, Target, Moon, Shield, Crown, Star };

export default async function SharedStatsPage({
    params,
    searchParams
}: {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { username } = await params;
    const { protocol } = await searchParams;
    const selectedProtocol = (protocol as string) || "standard";

    const protocols = [
        { id: "standard", label: "A-Z Standard", icon: Type, color: "from-cyan-500 to-blue-500", glow: "bg-cyan-500/20" },
        { id: "paragraph", label: "Paragraph", icon: AlignLeft, color: "from-blue-500 to-indigo-500", glow: "bg-indigo-500/20" },
        { id: "developer", label: "Developer", icon: Code2, color: "from-emerald-400 to-emerald-600", glow: "bg-emerald-500/20" },
        { id: "daily", label: "Daily Global", icon: CalendarDays, color: "from-purple-500 to-pink-500", glow: "bg-purple-500/20" }
    ];

    const protocolMeta = protocols.find(p => p.id === selectedProtocol) || protocols[0];
    const IconNode = protocolMeta.icon;

    await connectToDatabase();

    const usernameDecoded = decodeURIComponent(username);
    const user = await User.findOne({ name: { $regex: new RegExp(`^${usernameDecoded}$`, "i") } });

    if (!user) {
        redirect("/");
    }

    const tests = await TypingResult.find({ user: user._id });

    // Aggregate shared metrics
    let bestWpm = 0;
    let avgWpm = 0;
    let highestAcc = 0;
    let totalTime = 0;
    let matches = 0;

    tests.forEach(t => {
        totalTime += (t.timeTaken || 0);
        if (t.challengeType === selectedProtocol && t.wpm > bestWpm) {
            bestWpm = t.wpm;
        }
        if (t.challengeType === selectedProtocol) {
            avgWpm += t.wpm;
            if (t.accuracy > highestAcc) highestAcc = t.accuracy;
            matches++;
        }
    });

    if (matches > 0) avgWpm = Math.round(avgWpm / matches);

    // Get Badges
    const unlockedBadges = (user.unlockedAchievements || []).map((unlocked: any) => {
        const definition = ACHIEVEMENTS.find(a => a.id === unlocked.achievementId);
        return definition ? { ...definition, unlockedAt: unlocked.unlockedAt } : null;
    }).filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-20 ${protocolMeta.glow}`} />

            <div className="w-full max-w-lg relative z-10">
                {/* Author Card */}
                <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">

                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-xl" />
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-slate-800 dark:from-slate-800 dark:to-slate-900 shadow-xl border-4 border-white dark:border-slate-800 flex-shrink-0 relative overflow-hidden z-10">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex justify-center items-center text-white text-5xl font-black">{user.name.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        {unlockedBadges.length > 0 && (
                            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-white dark:border-[#1e293b] flex items-center justify-center text-white shadow-lg z-20">
                                <Medal className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{user.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Shared their Keysprint Metrics</p>

                    {/* Shared Stat Card (Replicating Swiper Look) */}
                    <div className={`w-full rounded-[2rem] p-1 bg-gradient-to-br ${protocolMeta.color} shadow-2xl transform hover:scale-[1.02] transition-transform duration-300`}>
                        <div className="w-full bg-white dark:bg-[#0f172a] rounded-[30px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                            <IconNode className="absolute top-4 right-4 w-24 h-24 opacity-5 text-slate-900 dark:text-white pointer-events-none" />

                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> {protocolMeta.label}
                            </div>

                            <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br border-none pb-2 mb-4" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}>
                                <span className={`bg-gradient-to-br ${protocolMeta.color} bg-clip-text text-transparent`}>{bestWpm}</span>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg WPM</div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{avgWpm}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Highest Acc</div>
                                    <div className="text-2xl font-black text-emerald-500">{highestAcc}%</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-6 text-sm font-bold text-slate-600 dark:text-slate-300">
                                Total Practice: {Math.round(totalTime / 60)} mins
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 w-full pt-10 border-t border-slate-100 dark:border-slate-800/50">
                        <Link href="/" className="w-full block py-4 bg-[#0f172a] dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl shadow-slate-900/10 dark:shadow-white/10 transition-all hover:-translate-y-1">
                            Beat this score on Keysprint
                        </Link>
                        <p className="mt-4 text-xs font-semibold text-slate-400">Join the competitive typing revolution</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
