'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { LucideIcon, LucideProps, MoveRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// interface CategoryCardProps {
//     title: string
//     icon: LucideIcon
//     color: string
//     subtopics: string[]
// }

interface CategoriesProps {
    index: number
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    topics: string[];
}

export function CategoryCard({ category }: { category: CategoriesProps }) {
    const Icon = category.icon;
    return (
        <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: category.index * 0.04 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500/85 hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
        >
            {/* Icon Watermark Background */}
            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Icon className="w-24 h-24 text-emerald-600" />
            </div>

            {/* Card Header */}
            <div className="relative px-6 py-4 border-b border-gray-100 bg-linear-to-r from-emerald-50/50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800 tracking-tight">
                        {category.title}
                    </h2>
                </div>
            </div>

            {/* Topics List */}
            <div className="relative p-4">
                <ul className="space-y-1.5">
                    {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>
                            {/* <a
                                href="#"
                                className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 group/link"
                            >
                                <div className='flex items-start gap-2.5'>
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-emerald-500 transition-colors shrink-0" />
                                    <span className="text-sm font-medium">{topic}</span>
                                </div>
                                <MoveRight className='hidden hover:block' />
                            </a> */}
                            <a
                                href="#"
                                className="group/link flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200"
                            >
                                <div className="flex items-start gap-2.5">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-emerald-500 transition-colors shrink-0" />
                                    <span className="text-sm font-medium">{topic}</span>
                                </div>

                                {/* Animated MoveRight */}
                                <MoveRight
                                    className="
                                        w-4 h-4 text-emerald-500
                                        opacity-0 -translate-x-1.5
                                        group-hover/link:opacity-100 group-hover/link:translate-x-0
                                        transition-all duration-300 ease-out
                                        "
                                />
                            </a>

                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
