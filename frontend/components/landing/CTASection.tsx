import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const benefits = [
    "AI-powered personalized learning",
    "Unlimited practice questions",
    "Real-time progress tracking",
    "Interview simulation mode",
    "Writing skills practice",
    "Community support"
];

function CTASection() {

    const router = useRouter();
    const goToDashboard = () => {
        router.push("/dashboard");
    }
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700">
                {/* Floating Elements */}
                <motion.div
                    className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-white"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Start Your Journey Today</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Ready to Build
                            <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-emerald-300">
                                Interview Confidence?
                            </span>
                        </h2>

                        <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                            Join thousands of successful professionals who transformed their careers with SkillVerse.
                            Your dream job is just one smart practice session away.
                        </p>

                        {/* Benefits List */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    // viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span className="text-indigo-100 text-sm">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        // viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    Get Started for Free
                                </h3>
                                <p className="text-slate-600">
                                    No credit card required. Start practicing today.
                                </p>
                            </div>

                            {/* Feature Highlights */}
                            <div className="space-y-4 mb-8">
                                {[
                                    "100+ Free Practice Questions",
                                    "Basic Analytics Dashboard",
                                    "Community Access"
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={goToDashboard}
                                    size="lg"
                                    className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 text-lg rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 group"
                                >
                                    Start Practicing with AI
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={goToDashboard}
                                    className="w-full border-2 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 py-6 text-lg rounded-2xl transition-all duration-300"
                                >
                                    Explore Practice Tests
                                </Button>
                            </div>

                            <p className="text-center text-sm text-slate-500 mt-6">
                                Join 50,000+ learners already on SkillVerse
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default CTASection