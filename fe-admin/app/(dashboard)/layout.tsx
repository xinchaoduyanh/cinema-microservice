"use client";

import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30 relative">
          {/* Atmospheric Background Effects */}
          <div className="bg-aura" />
          <div className="film-grain" />
          
          {/* Main Content */}
          <div className="relative z-10">
            <Sidebar />
            <Header />
            <main className="md:pl-64 pt-16 min-h-screen">
              <div className="p-6 md:p-8 animate-fade-in">
                {children}
              </div>
            </main>
          </div>
      </div>
    </ProtectedRoute>
  )
}
