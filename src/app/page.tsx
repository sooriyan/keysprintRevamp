"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Keyboard, Zap, Trophy, Activity, Type, AlignLeft, Code2, CalendarDays, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const yHeroText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yKeyboardImage = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityHeroText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const challenges = [
    {
      id: "standard",
      title: "Standard A-Z",
      type: "Reflex",
      description: "Test your raw reflex speed on random alphabetic strings. Pure speed, no context.",
      icon: <Type className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-500/20 to-transparent",
      borderColor: "border-cyan-500/20"
    },
    {
      id: "paragraph",
      title: "Paragraph Challenge",
      type: "Endurance",
      description: "Endurance testing on real-world literature and prose. Focus on rhythm and flow.",
      icon: <AlignLeft className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-transparent",
      borderColor: "border-blue-500/20"
    },
    {
      id: "developer",
      title: "Developer Snippet",
      type: "Technical",
      description: "Python, JS, and C++ syntax drills. Master special characters and code indentation.",
      icon: <Code2 className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-transparent",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "daily",
      title: "Global Daily",
      type: "Seeded",
      description: "The exact same string for everyone on the planet, cycling every 24 hours.",
      icon: <CalendarDays className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500/20 to-transparent",
      borderColor: "border-purple-500/20",
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white overflow-hidden selection:bg-cyan-500/30">

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Simple Header for Logo */}
      <header className="absolute top-0 left-0 w-full p-6 sm:px-10 z-50 flex items-center justify-between">
        <Link href="/">
          <Logo className="text-slate-900 dark:text-white" textClassName="text-slate-900 dark:text-white" />
        </Link>
        <div className="flex gap-4 items-center">
          {session ? (
            <Link href="/dashboard" className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
              {session.user?.image ? (
                <img src={session.user.image} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">{session.user?.name?.charAt(0) || "U"}</span>
              )}
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors items-center">Sign In</Link>
              <Link href="/signup" className="text-sm font-semibold bg-[#22d3ee] hover:bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 sm:px-6 z-10">
        <motion.div
          style={{ y: yHeroText, opacity: opacityHeroText }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center z-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Join 10,000+ typists globally</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400"
          >
            Master Your <br className="hidden sm:block" /> Keyboard.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            The premier competitive typing platform. Test your raw speed, improve your accuracy through coding snippets, and compete against the world daily.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/challenge" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 rounded-2xl bg-[#0ea5e9] hover:bg-[#06b6d4] text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] hover:shadow-[0_0_60px_-15px_rgba(14,165,233,0.6)] transition-all group">
                Start Sprinting
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all backdrop-blur-md">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Abstract Keyboard Element */}
        <motion.div
          style={{ y: yKeyboardImage }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative w-full max-w-4xl aspect-[21/9] rounded-t-3xl border-t border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/80 shadow-2xl overflow-hidden backdrop-blur-2xl flex items-center justify-center p-8 z-10"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Decorative mockup lines inside the 'browser' */}
          <div className="w-full h-full border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 bg-slate-50/50 dark:bg-[#0f172a]/50">
            <div className="w-1/3 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/50 animate-pulse" />
            <div className="w-2/3 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/50 animate-pulse delay-75" />
            <div className="flex gap-2 mt-auto">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center"><Activity className="w-5 h-5 text-cyan-500" /></div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"><Zap className="w-5 h-5 text-indigo-500" /></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS STRIP */}
      <section className="relative w-full py-12 bg-white dark:bg-[#1e293b] border-y border-slate-200 dark:border-slate-800 z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-slate-800">
          {[
            { label: "Active Sprinters", value: "10K+" },
            { label: "Total Tests Taken", value: "2.5M" },
            { label: "Top Speed (WPM)", value: "214" },
            { label: "Daily Challenges", value: "365" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROTOCOLS / FEATURES SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Four Ways To Prove It.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">Master every aspect of typing. From raw reflex alphabet strings to endurance paragraphs and technical coding snippets.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] hover:border-slate-300 dark:hover:border-slate-500 rounded-3xl p-8 shadow-sm transition-all overflow-hidden flex flex-col items-start"
              >
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${challenge.color} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className={`w-14 h-14 rounded-2xl border ${challenge.borderColor} bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shadow-inner mb-6 relative z-10`}>
                  {challenge.icon}
                </div>

                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-4 relative z-10">
                  {challenge.type}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 group-hover:text-[#0ea5e9] dark:group-hover:text-[#38bdf8] transition-colors">{challenge.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                  {challenge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / SOCIAL PROOF */}
      <section className="py-24 px-6 bg-slate-100 dark:bg-[#1e293b]/30 border-y border-slate-200 dark:border-slate-800 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Climb the Global <br /> Leaderboards.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Every test you complete contributes to your overall ranking. Earn prestigious badges, track your average WPM, and show the world your true speed.</p>

            <ul className="space-y-4">
              {[
                "Instant precision analytics & heatmaps",
                "Earn distinct achievement badges",
                "Share verified results with one click",
                "Dark & Light mode optimized"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <Zap className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/leaderboard" className="inline-block mt-4">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800">
                View Top Players
              </Button>
            </Link>
          </motion.div>

          {/* Interactive mock leaderboard UI */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Live Rankings</h3>
              <div className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">Standard A-Z</div>
            </div>

            <div className="space-y-3">
              {[
                { name: "faker", wpm: 212, acc: 99 },
                { name: "TypeGod", wpm: 208, acc: 98 },
                { name: "SillyGoose", wpm: 195, acc: 100 },
                { name: "Ninja", wpm: 180, acc: 96 }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#1e293b]/50 group hover:border-[#0ea5e9]/30 transition-colors cursor-default">
                  <div className="w-6 text-center font-bold text-slate-400 text-sm">#{i + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">{user.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg text-slate-900 dark:text-white leading-none">{user.wpm} <span className="text-[10px] text-slate-500">WPM</span></div>
                    <div className="text-xs font-bold text-emerald-500">{user.acc}% ACC</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay gradient to abstract the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-[#0f172a] to-transparent pointer-events-none rounded-b-[2rem]" />
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-6 relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full bg-gradient-to-br from-[#0ea5e9] to-indigo-600 rounded-[3rem] p-12 sm:p-20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grain.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <Keyboard className="absolute -right-8 -top-8 w-64 h-64 text-white/5 -rotate-12 pointer-events-none" />

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to beat your high score?</h2>
          <p className="text-sky-100 text-lg sm:text-xl font-medium mb-10 max-w-2xl mx-auto relative z-10">Stop guessing your words per minute. Accurately measure it and join the sprint to the top of the leaderboard.</p>

          <Link href="/signup" className="relative z-10">
            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 hover:scale-105 transition-all text-xl font-black shadow-xl">
              Create Free Account
            </Button>
          </Link>
          <p className="mt-6 text-sky-200 text-sm font-medium relative z-10">Or <Link href="/challenge" className="underline hover:text-white transition-colors">play as guest</Link></p>
        </motion.div>
      </section>

    </div>
  );
}
