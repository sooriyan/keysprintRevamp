import Link from "next/link";
import { ArrowLeft, Shield, FileText, HelpCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">

                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0ea5e9] hover:text-[#0284c7] mb-10 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium lead">
                        Last updated: February 21, 2026
                    </p>

                    <div className="bg-white dark:bg-[#1e293b] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mt-10 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                By accessing and using Keysprint ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and others who access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. User Accounts</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                                <li>You agree not to disclose your password to any third party.</li>
                                <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Fair Play & Anti-Cheat</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Keysprint is a competitive typing platform. Any use of bots, macros, automated scripts, or modifications to artificially inflate your typing speed or bypass our anti-cheat mechanisms is strictly prohibited. Accounts found violating these rules will be permanently banned and removed from all leaderboards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Intellectual Property</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                The Service and its original content, features, and functionality are and will remain the exclusive property of Keysprint and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Modifications</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
