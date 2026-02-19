// import Home from '@/components/dashboard/home'
// import { DashboardSidebar } from '@/components/dashboard/sidebar'
// import TopBar from '@/components/dashboard/topbar'
// import React from 'react'

// // this page is the dashboard page 

// function Page() {
//     return (
//         <div className="w-screen h-screen overflow-x-hidden bg-white">
//             <DashboardSidebar />
//             <TopBar />
//             <Home />
//         </div>
//     )
// }

// export default Page

'use client'

import { useState } from 'react'
import { Menu, User, X } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import TopBar from '@/components/dashboard/topbar'
import Home from '@/components/dashboard/home'
import { Button } from '@/components/ui/button'
// import { DashboardSidebar } from './DashboardSidebar'
// import TopBar from './TopBar'

export default function Page() {
    // const [sidebarOpen, setSidebarOpen] = useState(false)
    // const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    // slate-50
    return (
        // <div className="h-screen max-w-full bg-slate-50 flex">
            <Home/>
        // </div>
    )
}

// return (
//     <div className="h-screen max-w-full bg-slate-50 flex">

//         {/* Mobile overlay */}
//         {sidebarOpen && (
//             <div
//                 className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//                 onClick={() => setSidebarOpen(false)}
//             />
//         )}

//         {/* Sidebar */}
//         <DashboardSidebar
//             isOpen={sidebarOpen}
//             isCollapsed={sidebarCollapsed}
//             onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
//             onClose={() => setSidebarOpen(false)}
//         />

//         {/* Main area */}
//         <div
//             className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
//                 }`}
//         >
//             {/* Mobile menu button */}
//             <div className="fixed w-full z-20 bg-white opacity-100 top-0 lg:hidden p-2 flex items-center justify-between">
//                 <button
//                     onClick={() => setSidebarOpen(!sidebarOpen)}
//                     className="w-10 h-10 bg-white shadow rounded-lg flex items-center justify-center"
//                 >
//                     {sidebarOpen ? <X /> : <Menu />}
//                 </button>
//                 {/* <TopBar/> */}
//                 {/* <Button className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors duration-200">
//                     <User className="w-[18px] h-[18px] text-slate-500" />
//                 </Button> */}

//             </div>

//             <main className="h-full w-full">
//                 {/* <TopBar /> */}
//             </main>
//                 <Home />
//         </div>
//     </div>
// )
