"use client"

import { Bell, Search, User, ChevronDown, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { useSidebar } from "./sidebar-context"

export function Topbar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <header className="h-20 bg-background border-b border-white/5 flex items-center justify-between px-12">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hover:bg-foreground hover:text-background transition-colors rounded-xl h-10 w-10 border border-white/5"
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
        
        {/* Monochrome Search */}
        <div className="relative group w-80 lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            type="search"
            placeholder="Search the vault..."
            className="pl-12 bg-white/5 border-white/5 rounded-full h-10 focus:bg-white/10 focus:border-white/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all group">
          <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-foreground rounded-full"></span>
        </button>
        
        <ModeToggle />

        {/* Monochrome Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/5 cursor-pointer group">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground group-hover:opacity-70 transition-opacity">System Root</p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground opacity-50">Administrator</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-foreground border border-white/10 flex items-center justify-center">
              <User className="h-5 w-5 text-background" />
           </div>
           <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  )
}
