
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, Target } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
// import AnimatedBackground from './AnimatedBackground';


function HeroSection() {

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-slate-50 via-white to-indigo-50/30">
            <AnimatedBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-indigo-100 to-violet-100 border border-indigo-200/50 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">AI-Powered Learning Platform</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6"
                >
                    Master Skills.{' '}
                    <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Build Confidence.
                    </span>
                    <br />
                    Ace Interviews.
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    SkillVerse uses <span className="text-indigo-600 font-semibold">AI</span> to generate personalized MCQ assessments,
                    track your progress, and guide you to become truly <span className="text-emerald-600 font-semibold">interview-ready</span>.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 group"
                    >
                        Start Practicing with AI
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-700 px-8 py-6 text-lg rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300"
                    >
                        See How SkillVerse Works
                    </Button>
                </motion.div>

                {/* Floating Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                >
                    {[
                        { icon: Brain, title: "AI-Generated MCQs", desc: "Unlimited practice questions" },
                        { icon: Target, title: "Smart Analytics", desc: "Know your strengths & gaps" },
                        { icon: Sparkles, title: "Personalized Path", desc: "Learn what matters most" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-4 mx-auto">
                                <item.icon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
        </section>
    )
}

export default HeroSection