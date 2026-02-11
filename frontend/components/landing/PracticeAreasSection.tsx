import React, { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code,
    Database,
    Server,
    Globe,
    Cpu,
    FileCode,
    Mail,
    FileText,
    PenTool,
    CheckCircle2,
    LucideProps
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type technicalTopicsTypes = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    name: string,
    topics: string[]
}

const technicalTopics: technicalTopicsTypes[] = [
    { icon: Code, name: "Data Structures & Algorithms", topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Sorting"] },
    { icon: Database, name: "Database Management", topics: ["SQL Queries", "Normalization", "Indexing", "Transactions", "NoSQL"] },
    { icon: Server, name: "System Design", topics: ["Scalability", "Load Balancing", "Caching", "Microservices", "API Design"] },
    { icon: Globe, name: "Web Development", topics: ["React", "Node.js", "REST APIs", "Authentication", "Performance"] },
    { icon: Cpu, name: "Operating Systems", topics: ["Process Management", "Memory", "Threading", "Scheduling", "File Systems"] },
    { icon: FileCode, name: "Programming Languages", topics: ["Python", "Java", "JavaScript", "C++", "Go"] },
];

const writingTopics: technicalTopicsTypes[] = [
    { icon: Mail, name: "Professional Email Writing", topics: ["Formal Requests", "Follow-ups", "Client Communication", "Team Updates"] },
    { icon: FileText, name: "Technical Documentation", topics: ["API Docs", "README Files", "User Guides", "Architecture Docs"] },
    { icon: PenTool, name: "Essay & Response Writing", topics: ["Problem Analysis", "Solution Proposals", "Case Studies", "Reports"] },
];


function PracticeAreasSection() {
    const [activeTab, setActiveTab] = useState("technical");

    return (
        <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-4">
                        Comprehensive Coverage
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Practice Areas That{' '}
                        <span className="bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                            Matter
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        From technical fundamentals to professional communication — we&aposve got everything covered.
                    </p>
                </motion.div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-12 bg-slate-100 p-1.5 rounded-2xl">
                        <TabsTrigger
                            value="technical"
                            className="rounded-xl py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                        >
                            Technical Skills
                        </TabsTrigger>
                        <TabsTrigger
                            value="writing"
                            className="rounded-xl py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                        >
                            Writing Skills
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="technical" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {technicalTopics.map((topic, index) => (
                                    <motion.div
                                        key={topic.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <topic.icon className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 mb-3">{topic.name}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {topic.topics.map((t, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="writing" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {writingTopics.map((topic, index) => (
                                    <motion.div
                                        key={topic.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-amber-200 transition-all duration-300"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <topic.icon className="w-7 h-7 text-amber-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-3">{topic.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {topic.topics.map((t, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium"
                                                >
                                                    <CheckCircle2 className="w-3 h-3 text-amber-500" />
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </section>
    )
}

export default PracticeAreasSection