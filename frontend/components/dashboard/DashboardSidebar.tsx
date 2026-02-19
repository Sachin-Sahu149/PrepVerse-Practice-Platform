import {
    Home,
    BookOpen,
    FileText,
    BarChart3,
    Award,
    MessageSquare,
    Settings,
    HelpCircle,
    ChevronLeft,
    Briefcase,
    Code,
    GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface NavItem {
    icon: React.ElementType;
    label: string;
}

const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard" },
    { icon: BookOpen, label: "Aptitude" },
    { icon: Code, label: "Programming" },
    { icon: Briefcase, label: "Engineering" },
    { icon: FileText, label: "Practice Tests" },
    { icon: GraduationCap, label: "Courses" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Award, label: "Achievements" },
    { icon: MessageSquare, label: "Discussion" },
    { icon: Briefcase, label: "Engineering" },
    { icon: FileText, label: "Practice Tests" },
    { icon: GraduationCap, label: "Courses" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Award, label: "Achievements" },
    { icon: MessageSquare, label: "Discussion" },
];

const bottomItems: NavItem[] = [
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help" },
];
interface DashboardSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    setMobileOpen: (value: boolean) => void;
    isMobile: boolean;
}


const DashboardSidebar = ({ collapsed, mobileOpen, isMobile, setMobileOpen, onToggle }: DashboardSidebarProps) => {
    const [activeItem, setActiveItem] = useState("Dashboard");

    return (
        <>
            {/* Mobile Overlay */}
            {
                isMobile && mobileOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/30"
                        onClick={() => setMobileOpen(false)}
                    />
                )
            }

            <motion.aside
                initial={false}
                animate={{
                    x: isMobile ? (mobileOpen ? 0 : -240) : 0,
                    width: !isMobile ? (collapsed ? 72 : 240) : 240,
                }}
                transition={{ duration: 0.3 }}
                className="
      fixed top-16 left-0 z-40
      h-[calc(100vh-64px)]
      border-r border-gray-200 bg-[#F8FAF9]
      flex flex-col
    "
            >
                {/* Toggle Button */}
                <Button
                    onClick={onToggle}
                    className="absolute -right-3 top-6 z-30 flex h-7 w-7 items-center justify-center 
        rounded-full border border-gray-200 bg-white text-gray-500 
        shadow-sm hover:bg-gray-100 transition"
                >
                    <ChevronLeft
                        size={14}
                        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                            }`}
                    />
                </Button>

                {/* Scrollable Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = activeItem === item.label;
                                return (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => setActiveItem(item.label)}
                                            className={`relative group flex w-full items-center gap-3 
                    rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${isActive
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {/* Active left indicator */}
                                            {isActive && (
                                                <motion.span
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 
                        rounded-r-full bg-emerald-500"
                                                />
                                            )}

                                            <item.icon
                                                size={20}
                                                className={`shrink-0 transition-colors ${isActive
                                                    ? "text-emerald-600"
                                                    : "text-gray-400 group-hover:text-emerald-600"
                                                    }`}
                                            />

                                            <AnimatePresence>
                                                {!collapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="whitespace-nowrap"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-200 px-3 py-3">
                        <ul className="space-y-1">
                            {bottomItems.map((item) => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => setActiveItem(item.label)}
                                        className="group flex w-full items-center gap-3 
                  rounded-xl px-3 py-2.5 text-sm font-medium 
                  text-gray-600 transition-all duration-200 
                  hover:bg-gray-100"
                                    >
                                        <item.icon
                                            size={20}
                                            className="shrink-0 text-gray-400 group-hover:text-emerald-600 transition"
                                        />

                                        {!collapsed && (
                                            <span className="whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default DashboardSidebar;
