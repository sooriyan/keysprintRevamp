import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">

                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0ea5e9] hover:text-[#0284c7] mb-10 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium lead">
                        Last updated: February 21, 2026
                    </p>

                    <div className="bg-white dark:bg-[#1e293b] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mt-10 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Introduction</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                At Keysprint, your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application. Please read this privacy policy carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Information We Collect</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                We collect information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Personal Data</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Name, email address, and authentication credentials (including OAuth tokens via Google).</p>
                                </div>
                                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Usage Data</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Typing speeds (WPM), accuracy metrics, test history, and leaderboard rankings automatically tracked during play.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How We Use Your Information</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                We use personal information collected via our application for a variety of business purposes described below:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>To facilitate account creation and logon process.</li>
                                <li>To manage player accounts and maintain the integrity of global leaderboards.</li>
                                <li>To send administrative information to you regarding account recovery.</li>
                                <li>To protect our Services (e.g., fraud monitoring and prevention).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Analytics & Tracking</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                If you have questions or comments about this Privacy Policy, please email us at <a href="mailto:privacy@keysprint.in" className="text-[#0ea5e9] hover:underline font-medium">privacy@keysprint.in</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
