"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Calendar, 
  Clapperboard, 
  LayoutDashboard, 
  Settings, 
  Ticket, 
  Users 
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Clapperboard, label: "Movies", href: "/movies" },
  { icon: Building2, label: "Cinemas", href: "/cinemas" },
  { icon: Calendar, label: "Showtimes", href: "/showtimes" },
  { icon: Ticket, label: "Bookings", href: "/bookings" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl hidden md:flex flex-col h-screen fixed left-0 top-0 pt-16 z-20">
      <div className="flex flex-col gap-1.5 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-white shadow-lg shadow-white/5" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
