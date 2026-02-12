import { Sidebar } from "@/components/layouts/Sidebar"
import { Topbar } from "@/components/layouts/Topbar"
import { SidebarProvider } from "@/components/layouts/sidebar-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
        {/* Monochrome Layering */}
        <div className="cinematic-noise" />
        
        {/* Subtle White Light Leak */}
        <div className="light-leak bg-white w-[600px] h-[600px] -top-64 -left-64 opacity-5" />
        
        {/* Focused Gradient Background */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.03),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.01),_transparent_40%)]" />
        
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
            <div className="w-full max-w-[1500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
