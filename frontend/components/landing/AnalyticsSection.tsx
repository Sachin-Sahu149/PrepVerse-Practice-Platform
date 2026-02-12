import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Zap, PieChart } from 'lucide-react';

const mockChartData = [30, 45, 55, 70, 65, 80, 85, 90];


function AnalyticsSection() {
    return (
        <section className="py-24 bg-linear-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <motion.div
                className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-linear-to-br from-emerald-200/30 to-teal-200/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                            Smart Analytics
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Track Your{' '}
                            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Growth
                            </span>{' '}
                            in Real-Time
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Our intelligent analytics dashboard shows you exactly where you stand.
                            Identify weak spots, celebrate improvements, and stay motivated with clear progress visualization.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: TrendingUp, label: "Progress Tracking", value: "+45%", color: "emerald" },
                                { icon: Target, label: "Accuracy Rate", value: "87%", color: "sky" },
                                { icon: Award, label: "Topics Mastered", value: "24", color: "violet" },
                                { icon: Zap, label: "Practice Streak", value: "12 days", color: "amber" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    // viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-lg"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-3`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - Mock Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        // viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main Dashboard Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-slate-800">Performance Overview</h3>
                                    <p className="text-sm text-slate-500">Last 30 days</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="h-48 flex items-end gap-3 mb-6 px-2">
                                {mockChartData.map((height, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${height}%` }}
                                        // viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="flex-1 bg-linear-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group cursor-pointer"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {height}%
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-600">156</p>
                                    <p className="text-xs text-slate-500">Questions Solved</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-sky-600">89%</p>
                                    <p className="text-xs text-slate-500">Avg. Score</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-violet-600">8</p>
                                    <p className="text-xs text-slate-500">Topics Improved</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                    <PieChart className="w-5 h-5 text-violet-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">Strength Analysis</p>
                                    <p className="text-xs text-slate-500">DSA • System Design</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="absolute -top-4 -right-4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-xl text-white"
                        >
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-bold">+23% this week</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AnalyticsSection