"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react"
import { authService } from "@/services/auth.service"
import { useAuth } from "@/lib/auth-context"
import { jwtDecode } from "jwt-decode"
import { motion } from "framer-motion"

interface JwtPayload {
  role?: string;
  sub?: string;
  email?: string;
  exp?: number;
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(formData)
      
      const { accessToken, refreshToken } = response

      if (accessToken) {
        // Decode token to check role
        const decoded = jwtDecode<JwtPayload>(accessToken)
        
        if (decoded.role === 'ADMIN' || decoded.role === 'SUPER_ADMIN') {
          // Use Auth Context to login
          await login(accessToken, refreshToken)
          
          // Redirect to Admin Dashboard
          router.push('/')
        } else {
          setError("Access Denied: Administrator privileges required.")
        }
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      const msg = err.response?.data?.message || "Invalid credentials. Please check your email and password."
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
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-center space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30">
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Cinema<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Admin</span>
              </h1>
              <p className="text-white/60 text-sm">Management Portal</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Secure Access
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Control Center
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-md">
              Manage your cinema operations, monitor bookings, and control content from a unified dashboard.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              "Real-time Analytics",
              "Content Management",
              "User Administration",
              "Booking Oversight"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
            {/* Mobile Logo */}
            <div className="md:hidden flex flex-col items-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30 mb-3">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Cinema Admin</h1>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Administrator Login</h2>
                <p className="text-white/60">Secure access for authorized personnel only</p>
              </div>
              
              {/* Error Alert */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/80 block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@cinema.com"
                      className="pl-12 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 rounded-xl text-white placeholder:text-white/30 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/80 block">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 rounded-xl text-white placeholder:text-white/30 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Access Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
              
              {/* Security Notice */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-center text-white/40">
                  🔒 Protected area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
