import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    RefreshCw,
    Brain,
    BarChart3,
    Clock,
    Users,
    XCircle,
    CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const comparisons = [
    {
        traditional: "Same static questions",
        skillverse: "AI-generated fresh questions every time",
        icon: RefreshCw
    },
    {
        traditional: "Generic study material",
        skillverse: "Personalized learning path",
        icon: Brain
    },
    {
        traditional: "No performance insights",
        skillverse: "Deep analytics & weak area detection",
        icon: BarChart3
    },
    {
        traditional: "No interview simulation",
        skillverse: "Timed tests mimicking real pressure",
        icon: Clock
    },
    {
        traditional: "Learn alone",
        skillverse: "Community support & guidance",
        icon: Users
    },
    {
        traditional: "Slow feedback loop",
        skillverse: "Instant AI-powered feedback",
        icon: Zap
    }
];


function WhySkillVerseSection() {
    const router = useRouter();
    const goToDashboard = () => {
        router.push("/dashboard");
    }
    return (
        <section className="py-24 bg-linear-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
            {/* Background */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-br from-rose-100/30 to-orange-100/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
                        The Difference
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Why{' '}
                        <span className="bg-linear-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                            SkillVerse
                        </span>{' '}
                        Stands Out
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Traditional MCQ platforms are stuck in the past. See how SkillVerse revolutionizes your preparation.
                    </p>
                </motion.div>

                {/* Comparison Grid */}
                <div className="grid gap-4 max-w-4xl mx-auto">
                    {comparisons.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            // viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-center "
                        // className="md:flex gap-2 items-center justify-between"
                        >
                            {/* Traditional */}
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-200">
                                <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                <span className="text-slate-600">{item.traditional}</span>
                            </div>

                            {/* Icon */}
                            <div className="hidden md:flex w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 items-center justify-center shadow-lg">
                                <item.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* SkillVerse */}
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span className="text-slate-800 font-medium">{item.skillverse}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    // viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <p className="text-xl text-slate-600 mb-6">
                        Ready to ace every online assessment with confidence?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToDashboard}
                        className=" cursor-pointer px-8 py-4 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                    >
                        Start Acing Assessments →
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

export default WhySkillVerseSection