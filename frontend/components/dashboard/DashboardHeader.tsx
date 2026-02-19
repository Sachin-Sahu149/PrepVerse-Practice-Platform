import { Menu, Search, Bell, User, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ onToggleSidebar }: DashboardHeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 
      border-b border-gray-200 
      bg-[#F8FAF9] px-6"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg 
          text-gray-600 hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <GraduationCap size={20} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-1 justify-center">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full max-w-lg"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses, topics, tests..."
            className="h-10 w-full rounded-xl border border-gray-200 
            bg-white pl-9 pr-4 text-sm 
            focus:border-emerald-500 focus:ring-2 
            focus:ring-emerald-200 transition-all duration-200"
          />
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-lg hover:bg-gray-100"
        >
          <Bell size={18} className="text-gray-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        {/* Settings (optional like image) */}
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-lg hover:bg-gray-100"
        >
          <User size={18} className="text-gray-600" />
        </Button>

        {/* Profile */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <User size={18} />
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
