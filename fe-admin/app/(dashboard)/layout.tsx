import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
        <Sidebar />
        <Header />
        <main className="md:pl-64 pt-16 min-h-screen">
          <div className="p-6 md:p-8 animate-fade-in">
            {children}
          </div>
        </main>
    </div>
  )
}
