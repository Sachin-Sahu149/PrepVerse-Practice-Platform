import React from 'react'
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

type testimonialsTypes = {
    name: string,
    role: string,
    image: string,
    content: string,
    rating: number,
    id: string

}


const TestimonialCard = ({ testimonial }: { testimonial: testimonialsTypes }) => {
    console.log(testimonial);
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group h-full"
        >
            <div className="absolute inset-0 bg-linear-to-br from-violet-100/50 to-purple-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full">

                {/* Quote */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center opacity-50">
                    <Quote className="w-5 h-5 text-violet-600" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                    <q>{testimonial.content}</q>
                </p>

                <div className="flex items-center gap-4 mt-auto">
                    <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover ring-2 ring-violet-100"
                    />
                    <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};









// type testimonialsTypes = {
//     name: string,
//     role: string,
//     image: string,
//     content: string,
//     rating: number,
//     id: string

// }


const testimonials: testimonialsTypes[] = [
    {
        name: "Priya Sharma",
        role: "Software Engineer at Google",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        content: "SkillVerse transformed my interview prep. The AI-generated questions were incredibly relevant, and the analytics helped me focus on my weak areas. Landed my dream job!",
        rating: 5,
        id: "10101"
    },
    {
        name: "Rahul Verma",
        role: "SDE-2 at Amazon",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        content: "The interview simulation feature is a game-changer. Practicing under timed pressure made real interviews feel much easier. Highly recommend for anyone serious about their career.",
        rating: 5,
        id: "iav23"
    },
    {
        name: "Sneha Patel",
        role: "Final Year CS Student",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        content: "As a student, I was overwhelmed with what to study. SkillVerse's personalized recommendations made everything clear. My confidence has skyrocketed!",
        rating: 5,
        id: "sf123"
    },
    {
        name: "Arjun Reddy",
        role: "Backend Developer at Microsoft",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        content: "The depth of topics covered is impressive. From DSA to System Design, everything I needed was here. The progress tracking kept me motivated throughout my prep.",
        rating: 5,
        id: "st223"
    },
    {
        name: "Ananya Singh",
        role: "Tech Lead at Flipkart",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        content: "I used SkillVerse to switch roles and it exceeded my expectations. The writing practice feature helped me ace behavioral rounds too. Complete package!",
        rating: 5,
        id: "43dgs"
    },
    {
        name: "Vikram Joshi",
        role: "Full Stack Developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        content: "What sets SkillVerse apart is how it adapts to your level. Questions get harder as you improve, keeping you challenged. Best investment in my career.",
        rating: 5,
        id: "st342"
    }
];

function TestimonialsSection() {
    return (
        <section className="py-24 bg-linear-to-b from-white via-violet-50/30 to-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-100/30 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
                        Success Stories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Loved by{' '}
                        <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            Thousands
                        </span>{' '}
                        of Learners
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join the community of successful professionals who transformed their careers with SkillVerse.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}

                <div className="relative overflow-hidden py-3">
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-linear-to-r from-white to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-linear-to-l from-white to-transparent z-10" />

                    <motion.div
                        className="flex gap-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            ease: "linear",
                            duration: 20,
                            repeat: Infinity,
                        }}
                        whileHover={{ animationPlayState: "paused" }}
                    >
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div key={index} className="min-w-[350px]">
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 p-8 rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-2xl"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { value: "50,000+", label: "Active Learners" },
                            { value: "2M+", label: "Questions Practiced" },
                            { value: "95%", label: "Success Rate" },
                            { value: "4.9/5", label: "User Rating" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                                <p className="text-violet-200 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section >
    )
}





export default TestimonialsSection