import React from 'react'
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, BarChart, Trophy, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        number: "01",
        title: "Create Your Profile",
        description: "Tell us your goals, experience level, and target roles. Our AI builds a personalized learning path just for you.",
        color: "indigo"
    },
    {
        icon: BookOpen,
        number: "02",
        title: "Practice with AI MCQs",
        description: "Dive into adaptive assessments that adjust to your level. Cover DSA, System Design, Programming Languages, and more.",
        color: "violet"
    },
    {
        icon: BarChart,
        number: "03",
        title: "Track Your Progress",
        description: "Review detailed analytics showing your growth. See exactly where you're strong and what needs more attention.",
        color: "sky"
    },
    {
        icon: Trophy,
        number: "04",
        title: "Become Interview Ready",
        description: "Build unstoppable confidence through consistent practice. Walk into any interview knowing you're prepared.",
        color: "emerald"
    }
];

const colorClasses = {
    "indigo": {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        gradient: "from-indigo-500 to-indigo-600",
        glow: "shadow-indigo-500/25"
    },
    "violet": {
        bg: "bg-violet-100",
        text: "text-violet-600",
        gradient: "from-violet-500 to-violet-600",
        glow: "shadow-violet-500/25"
    },
    "sky": {
        bg: "bg-sky-100",
        text: "text-sky-600",
        gradient: "from-sky-500 to-sky-600",
        glow: "shadow-sky-500/25"
    },
    "emerald": {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        gradient: "from-emerald-500 to-emerald-600",
        glow: "shadow-emerald-500/25"
    }
};

function HowItWorksSection() {
    return (
        <section className="py-24 bg-linear-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <motion.div
                className="absolute top-20 right-0 w-96 h-96 bg-linear-to-br from-violet-200/30 to-indigo-200/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-0 w-80 h-80 bg-linear-to-br from-sky-200/30 to-cyan-200/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        How{' '}
                        <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            SkillVerse
                        </span>{' '}
                        Works
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Four simple steps to transform your interview preparation and land your dream job.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-200 via-violet-200 to-emerald-200 -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            console.log(step.color);
                            const key = step.color as keyof typeof colorClasses
                            const colors = colorClasses[key];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                                        {/* Number Badge */}
                                        <div className={`absolute -top-4 left-8 px-4 py-1 rounded-full bg-linear-to-r ${colors.gradient} text-white font-bold text-sm shadow-lg ${colors.glow}`}>
                                            {step.number}
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 mt-4`}>
                                            <step.icon className={`w-8 h-8 ${colors.text}`} />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Arrow (hidden on last item) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md">
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection