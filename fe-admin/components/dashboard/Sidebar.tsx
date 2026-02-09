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
    <div className="w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-md hidden md:flex flex-col h-screen fixed left-0 top-0 pt-16 z-20">
      <div className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600/10 text-blue-500 hover:bg-blue-600/20" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
