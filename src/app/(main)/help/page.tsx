"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Mail, MessageSquare } from "lucide-react";

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: "How is my WPM (Words Per Minute) calculated?",
            answer: "Your WPM is calculated based on the standard formula: (Total Characters Typed / 5) / Time in Minutes. We strictly factor in uncorrected errors, which decreases your final net WPM speed to ensure accurate ladder rankings."
        },
        {
            question: "Can I reset my statistics?",
            answer: "Currently, account statistics are permanent to maintain the integrity of the global leaderboards. If you wish to start fresh, you will need to create a new account using a different email address."
        },
        {
            question: "Why aren't my scores saving to the leaderboard?",
            answer: "Ensure you are logged into your account before starting a test. Guest players can take typing challenges, but their results are local-only and will not be recorded on the global or daily leaderboards."
        },
        {
            question: "How do I earn the '100 WPM Club' achievement?",
            answer: "You must complete a standard test (duration 60 seconds or 50 words) with a net WPM of 100 or higher and an accuracy strictly above 95%. The achievement will unlock immediately upon the test's conclusion."
        },
        {
            question: "Does Keysprint support custom themes?",
            answer: "Yes! Keysprint currently supports automatic Light and Dark modes based on your system preferences. You can also manually toggle this using the sun/moon icon in the top navigation bar."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">

                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0ea5e9] hover:text-[#0284c7] mb-10 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Help Center</h1>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] max-w-sm">
                        Find answers to common questions about typing mechanics, leaderboards, and account management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { icon: MessageSquare, title: "Community Discord", desc: "Join thousands of typists", color: "text-[#5865F2]", bg: "bg-[#5865F2]/10" },
                        { icon: Mail, title: "Email Support", desc: "support@keysprint.in", color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className={`w-12 h-12 rounded-full ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{card.title}</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">{card.desc}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-[#1e293b] rounded-2xl border ${openFaq === index ? 'border-[#0ea5e9] shadow-md dark:border-[#0ea5e9]/50' : 'border-slate-200 dark:border-slate-800 shadow-sm'} overflow-hidden transition-all`}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                            >
                                <span className="font-bold text-slate-900 dark:text-white pr-8">{faq.question}</span>
                                {openFaq === index ? (
                                    <ChevronUp className="w-5 h-5 text-[#0ea5e9] flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                )}
                            </button>

                            {openFaq === index && (
                                <div className="px-6 pb-6 pt-0">
                                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
