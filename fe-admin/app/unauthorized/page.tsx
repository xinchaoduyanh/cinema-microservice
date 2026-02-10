"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Atmospheric Background Effects */}
      <div className="bg-aura" />
      <div className="film-grain" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="w-full max-w-lg relative z-10">
        <div className="glass rounded-3xl p-12 shadow-2xl border border-white/10 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-2xl shadow-red-500/30">
              <ShieldAlert className="h-14 w-14 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8 text-lg">
            You don't have administrator privileges to access this area.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg">
                Back to Login
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 mt-8">
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
