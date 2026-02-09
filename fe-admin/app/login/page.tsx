"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  role?: string;
  sub?: string;
  email?: string;
  exp?: number;
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Call Auth Service via APISIX Gateway
      const response = await api.post('/auth-service/api/auth/login', formData)
      
      const { accessToken, refreshToken, email } = response.data

      if (accessToken) {
        // Decode token to check role
        const decoded = jwtDecode<JwtPayload>(accessToken)
        
        if (decoded.role === 'ADMIN') {
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
          if (email) localStorage.setItem('userEmail', email)
          
          // Redirect to Admin Dashboard
          router.push('/')
        } else {
          setError("Access Denied: You do not have administrator privileges.")
        }
      } else {
        setError("Login failed: No access token received.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      const msg = err.response?.data?.message || "Invalid credentials or server error."
      setError(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Atmospheric Background Effects */}
      <div className="bg-aura" />
      <div className="film-grain" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Cinema Admin</h1>
          <p className="text-gray-400 text-center">Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-white">Secure Login</h2>
            <p className="text-gray-400 text-sm">
              Enter your admin credentials to continue
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3 animate-slide-up">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cinema.com"
                  className="pl-12 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
          
          <p className="text-xs text-center text-gray-500 mt-6">
            Protected area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}
