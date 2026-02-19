// 'use client'
// import React from "react";
// import { motion } from "framer-motion";
// import {
//     Brain,
//     MessageSquare,
//     Code2,
//     Monitor,
//     PenTool,
//     Users,
//     ClipboardCheck,
//     Cpu,
//     TrendingUp,
// } from "lucide-react";
// import { CategoryCard } from "./category_card";

// const categories = [
//     {
//         title: "General Aptitude",
//         icon: Brain,
//         topics: [
//             "Arithmetic Aptitude",
//             "Data Interpretation",
//             "Time & Work",
//             "Profit & Loss",
//             "Speed & Distance",
//         ],
//     },
//     {
//         title: "Verbal & Reasoning",
//         icon: MessageSquare,
//         topics: [
//             "Verbal Ability",
//             "Logical Reasoning",
//             "Analytical Reasoning",
//             "Critical Thinking",
//             "Number Series",
//         ],
//     },
//     {
//         title: "Programming",
//         icon: Code2,
//         topics: [
//             "Java",
//             "Python",
//             "C++",
//             "Data Structures",
//             "Algorithms",
//         ],
//     },
//     {
//         title: "Computer Science",
//         icon: Monitor,
//         topics: [
//             "Operating Systems",
//             "Database Management",
//             "Computer Networks",
//             "Compiler Design",
//             "Software Engineering",
//         ],
//     },
//     {
//         title: "Writing Skills",
//         icon: PenTool,
//         topics: [
//             "Grammar Practice",
//             "Essay Writing",
//             "Email Writing",
//             "Vocabulary",
//             "Comprehension",
//         ],
//     },
//     {
//         title: "Mock Interviews",
//         icon: Users,
//         topics: [
//             "Technical Round",
//             "HR Round",
//             "Behavioral Questions",
//             "System Design",
//             "Coding Interview",
//         ],
//     },
//     {
//         title: "Online Tests",
//         icon: ClipboardCheck,
//         topics: [
//             "Full Length Tests",
//             "Topic-wise Tests",
//             "Previous Year Papers",
//             "Daily Practice",
//             "Speed Tests",
//         ],
//     },
//     {
//         title: "Engineering",
//         icon: Cpu,
//         topics: [
//             "Digital Electronics",
//             "Microprocessors",
//             "Control Systems",
//             "Signals & Systems",
//             "Communication",
//         ],
//     },
//     {
//         title: "Quantitative Aptitude",
//         icon: TrendingUp,
//         topics: [
//             "Percentage",
//             "Ratio & Proportion",
//             "Averages",
//             "Simple Interest",
//             "Compound Interest",
//         ],
//     },
// ];

// export default function Home() {

//     return (
//         <div className="min-h-screen bg-gray-70 mt-16 lg:mt-0">
//             <div className="px-6 lg:px-8 py-8 max-w-[1800px] mx-auto ">
//                 {/* Header */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 12 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4 }}
//                     className="mb-8"
//                 >
//                     <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1.5">
//                         Ace your any online assessment
//                     </h1>
//                     <p className="text-slate-500 text-sm">
//                         Choose a category and start practicing today
//                     </p>
//                 </motion.div>

//                 {/* Category Cards Grid - 3 cards per row on desktop */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {categories.map((category, index) => {
//                         // const Icon = category.icon;
//                         const updatedCategory = { ...category, index: index };
//                         return <CategoryCard key={index} category={updatedCategory} />
//                     })}
//                 </div>

//                 {/* Footer */}
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     className="mt-12 text-center"
//                 >
//                     <p className="text-xs text-slate-400">
//                         Practice · Learn · Excel · Get placed at top companies
//                     </p>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
// import DashboardHeader from "@/components/DashboardHeader";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import TopicCard from "@/components/TopicCard";
import {
    BookOpen,
    Calculator,
    Globe,
    Code,
    Cpu,
    Database,
    FileText,
    BarChart3,
    Briefcase,
    Lightbulb,
    Puzzle,
    Languages,
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
// import { DashboardSidebar } from "./sidebar";
import { CategoryCard } from "./CategoryCard";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "./DashboardSidebar";

const topics = [
    {
        title: "Quantitative Aptitude",
        index: 1,
        icon: Calculator,
        topics: ["Profit and Loss", "Time and Work", "Percentages", "Simple Interest", "Ratio & Proportion"],
    },
    {
        title: "Logical Reasoning",
        icon: Puzzle,
        index: 2,
        topics: ["Blood Relations", "Coding-Decoding", "Analogies", "Syllogisms", "Data Sufficiency"],
    },
    {
        title: "Verbal Ability",
        icon: Languages,
        index: 3,
        topics: ["Sentence Correction", "Reading Comprehension", "Synonyms & Antonyms", "Fill in the Blanks", "Idioms & Phrases"],
    },
    {
        title: "C Programming",
        icon: Code,
        index: 4,
        topics: ["Pointers", "Arrays", "Strings", "Functions", "Structures"],
    },
    {
        title: "Computer Science",
        icon: Cpu,
        index: 5,
        topics: ["Operating Systems", "Computer Networks", "DBMS", "Data Structures", "Algorithms"],
    },
    {
        title: "Database Management",
        icon: Database,
        index: 6,
        topics: ["SQL Basics", "Normalization", "ER Diagrams", "Transactions", "Indexing"],
    },
    {
        title: "General Knowledge",
        icon: Globe,
        index: 7,
        topics: ["Indian History", "Geography", "Indian Polity", "Economics", "Science & Tech"],
    },
    {
        title: "Current Affairs",
        icon: FileText,
        index: 8,
        topics: ["National News", "International Events", "Sports", "Awards & Honours", "Science Discoveries"],
    },
    {
        title: "Data Interpretation",
        icon: BarChart3,
        index: 9,
        topics: ["Bar Graphs", "Pie Charts", "Line Graphs", "Tables", "Caselets"],
    },
    {
        title: "HR Interview",
        icon: Briefcase,
        index: 10,
        topics: ["Tell Me About Yourself", "Strengths & Weaknesses", "Why This Company?", "Salary Negotiation", "Behavioral Questions"],
    },
    {
        title: "English Grammar",
        icon: BookOpen,
        index: 11,
        topics: ["Tenses", "Articles", "Prepositions", "Active & Passive Voice", "Direct & Indirect Speech"],
    },
    {
        title: "Puzzles",
        icon: Lightbulb,
        index: 12,
        topics: ["Number Puzzles", "Letter Puzzles", "Clock Puzzles", "Calendar Problems", "Age Problems"],
    },
];

// Pending task --- -handle the sidebar responsiveness in mobile view 

const Index = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const isMobile = useIsMobile();
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    console.log("isMobile : ", isMobile);
    const handleToggle = () => {
        if (isMobile) {
            setMobileOpen(true); // mobile drawer
        } else {
            setSidebarCollapsed((c) => !c); // desktop collapse
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader onToggleSidebar={handleToggle} />

            <DashboardSidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                isMobile={isMobile}
                onToggle={() => setSidebarCollapsed((c) => !c)}
            />

            <main
                className={`
                min-h-[calc(100vh-var(--header-height))]
                transition-all duration-300
                ${!isMobile && (sidebarCollapsed ? "ml-[72px]" : "ml-60")}
                `}
            >
                <div className="p-6 lg:p-8">
                    {/* Welcome section */}
                    <div className="mb-8">
                        <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
                            Welcome back! 👋
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Pick a topic and start learning. Practice makes perfect.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            { label: "Topics", value: "120+", color: "text-primary" },
                            { label: "Questions", value: "50K+", color: "text-primary" },
                            { label: "Tests Taken", value: "2.4K", color: "text-primary" },
                            { label: "Your Score", value: "78%", color: "text-primary" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-border bg-card p-4 card-shadow text-center transition-all hover:card-shadow-hover"
                            >
                                <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Topic cards grid */}
                    <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                        Explore Topics
                    </h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {topics.map((topic, i) => (
                            // <TopicCard
                            //     key={topic.title}
                            //     title={topic.title}
                            //     icon={topic.icon}
                            //     links={topic.links}
                            //     delay={i * 60}
                            // />

                            <CategoryCard key={topic.title} category={topic} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Index;
