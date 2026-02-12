"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Ticket,
  Building2,
  Wallet,
  ShoppingBag,
  Bell
} from "lucide-react"

import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Film, label: "Movies", href: "/dashboard/movies" },
  { icon: Ticket, label: "Tickets & Booking", href: "/dashboard/bookings" },
  { icon: Building2, label: "Theaters", href: "/dashboard/cinemas" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/showtimes" },
  { icon: ShoppingBag, label: "Products / F&B", href: "/dashboard/products" },
  { icon: Wallet, label: "Payments / Wallet", href: "/dashboard/payments" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

  return (
    <aside className={cn(
      "glass-sidebar flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 relative overflow-hidden bg-background border-r border-white/5",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className={cn("p-8 mb-4", isCollapsed && "px-4")}>
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="h-10 w-10 shrink-0 bg-foreground rounded-xl flex items-center justify-center cinematic-glow group-hover:rotate-[360deg] transition-all duration-1000 ease-in-out">
             <Film className="text-background h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
               <span className="text-xl font-black tracking-tighter text-foreground uppercase italic font-serif leading-none">
                 AESTHE<span className="opacity-50 font-serif">TIX</span>
               </span>
               <span className="text-[7px] font-bold tracking-[0.4em] text-muted-foreground uppercase opacity-40 mt-1">Admin Suite</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.5em] px-4 py-8 mb-2 opacity-30">
            Navigation
          </div>
        )}
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "flex items-center rounded-xl transition-all duration-500 group relative overflow-hidden",
                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-4 px-5 py-3",
                isActive 
                  ? "bg-foreground text-background shadow-2xl" 
                  : "text-muted-foreground hover:bg-foreground hover:text-background"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-500",
                isActive ? "text-background" : "group-hover:text-background"
              )} />
              
              {!isCollapsed && (
                <span className="font-serif font-medium tracking-tight text-base">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className={cn("p-6 border-t border-white/5 space-y-2", isCollapsed && "px-3")}>
        <Link 
            href="/dashboard/settings" 
            title={isCollapsed ? "Settings" : ""}
            className={cn(
              "flex items-center rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 group",
              isCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-4 px-5 py-2"
            )}
        >
          <Settings className="h-4 w-4 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          {!isCollapsed && <span className="text-xs font-medium opacity-50 group-hover:opacity-100 transition-opacity">Account Settings</span>}
        </Link>
        <button className={cn(
          "w-full flex items-center rounded-xl bg-destructive/5 text-destructive border border-destructive/10 hover:bg-destructive hover:text-white transition-all duration-500 px-5",
          isCollapsed ? "justify-center h-12 mx-auto w-12 p-0" : "gap-4 py-3"
        )}>
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.25em]">Terminate</span>}
        </button>
      </div>
    </aside>
  )
}
