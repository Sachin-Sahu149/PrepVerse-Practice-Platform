import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type navLinksTypes = {
    name: string,
    href: string
}
const navLinks: navLinksTypes[] = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Practice Areas", href: "#practice" },
    { name: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const router = useRouter();

    const goToDashboard = () => {
        router.push("/dashboard");
    }


    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50'
                    : 'bg-transparent'
                    }`}
            >
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='flex items-center justify-between h-20'>
                        {/* Logo */}
                        {/* <div className='w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25'> */}
                        {/* <Brain className='w-6 h-6 text-white' /> */}
                        {/* </div> */}
                        <a href='#' className='flex items-center gap-2'>
                            <Image src={'/skillverse.png'} width={60} height={60} alt='Logo' />
                            <span className='text-xl font-bold text-slate-900'> SkillVerse</span>
                        </a>
                        {/* Desktop Navigation */}
                        <div className='hidden md:flex items-center gap-8'>
                            {
                                navLinks.map((link, index) => (
                                    <a key={index} href={link.href} className=' text-slate-600 hover:text-indigo-600 font-medium transition-colors'>
                                        {link.name}
                                    </a>
                                ))
                            }
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* <Button
                                variant="ghost"
                                className="text-slate-700 hover:text-indigo-600 font-medium cursor-pointer"
                            >
                                Sign In
                            </Button> */}
                            <Button
                                onClick={goToDashboard}
                                className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 group cursor-pointer"
                            >
                                Get Started
                                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-slate-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-slate-700" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-20 z-40 md:hidden"
                    >
                        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl p-6">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <hr className="border-slate-200" />
                                {/* <Button
                                    variant="outline"
                                    className="w-full justify-center border-slate-300"
                                >
                                    Sign In
                                </Button> */}
                                <Button
                                    onClick={goToDashboard}
                                    className="w-full justify-center bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </>
    );
}