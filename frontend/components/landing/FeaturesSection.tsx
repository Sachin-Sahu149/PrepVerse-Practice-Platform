import React from 'react'
import { motion } from 'framer-motion';
import {
    Brain,
    BarChart3,
    MessageSquareText,
    // Zap,
    Target,
    TrendingUp,
    Lightbulb,
    // Shield
} from 'lucide-react';

const features = [
    {
        icon: Brain, 
        title: "AI-Generated Questions",
        description: "Our AI creates fresh, relevant MCQs tailored to your skill level and learning goals. Never see the same test twice.",
        gradient: "from-indigo-500 to-violet-500",
        bgGradient: "from-indigo-50 to-violet-50"
    },
    {
        icon: Target,
        title: "Interview Simulation",
        description: "Practice under real interview pressure with timed assessments and difficulty progression that mirrors actual tech interviews.",
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-50 to-purple-50"
    },
    {
        icon: BarChart3,
        title: "Deep Performance Analytics",
        description: "Understand your strengths and weaknesses with detailed breakdowns by topic, concept, and question type.",
        gradient: "from-sky-500 to-cyan-500",
        bgGradient: "from-sky-50 to-cyan-50"
    },
    {
        icon: Lightbulb,
        title: "AI-Powered Recommendations",
        description: "Get personalized suggestions on what to study next based on your performance patterns and knowledge gaps.",
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-50 to-teal-50"
    },
    {
        icon: MessageSquareText,
        title: "Writing Skills Practice",
        description: "Master professional communication with email writing, essay composition, and structured response exercises.",
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-50 to-orange-50"
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "Watch your confidence grow with visual progress charts, streak tracking, and milestone celebrations.",
        gradient: "from-rose-500 to-pink-500",
        bgGradient: "from-rose-50 to-pink-50"
    }
];


function FeaturesSection() {
    return (
        <section className="py-24 bg-linear-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-linear-to-br from-indigo-100/40 to-violet-100/30 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                        Powerful Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Everything You Need to{' '}
                        <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Excel
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        SkillVerse combines cutting-edge AI with proven learning techniques to accelerate your interview preparation.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:border-slate-200 transition-all duration-300">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection