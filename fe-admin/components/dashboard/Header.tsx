"use client"

import Link from "next/link"
import { Bell, LogOut, Search, Shield, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user, logout } = useAuth()

  const getUserInitials = () => {
    if (!user?.fullName) return "AD"
    const names = user.fullName.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return user.fullName.substring(0, 2).toUpperCase()
  }

  return (
    <header className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl fixed top-0 w-full z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white hidden md:block tracking-tight">
            Cinema<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Admin</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 h-10 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 transition-all duration-300 rounded-xl"
          />
        </div>

        <button className="relative p-2.5 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl group">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-black animate-pulse" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-9 w-9 border-2 border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105">
              <AvatarImage src={user?.avatar} alt={user?.fullName || "Admin"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10 text-gray-200">
            <DropdownMenuLabel className="text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.fullName || "Admin"}</p>
                <p className="text-xs text-gray-400 font-normal">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 text-red-400 focus:text-red-400 rounded-lg" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
