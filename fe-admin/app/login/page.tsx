"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, ShieldCheck, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
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
        const decoded = jwtDecode<JwtPayload>(accessToken)
        if (decoded.role === 'ADMIN' || decoded.role === 'SUPER_ADMIN') {
          await login(accessToken, refreshToken)
          router.push('/dashboard')
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Cinematic Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 scale-105 animate-slow-zoom"
        style={{ 
          backgroundImage: `url('/admin_login_bg.png')`, // Note: Image added via generate_image usually needs public moving if Next.js
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4) saturate(0.8)'
        }}
      />
      
      {/* Artistic Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-60" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-20 px-6">
        {/* Left Side: Cinematic Branding */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="hidden lg:block space-y-12"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-primary" />
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Aesthetix Cinema Group</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] font-serif uppercase">
              AESTHETIX<br />
              <span className="text-primary italic">ADMIN</span>
            </h1>
            <p className="text-xl text-white/50 max-w-md font-medium leading-relaxed">
              Modern cinema operations management system. Experience sophistication in every control operation.
            </p>
          </div>

          <div className="flex items-center gap-8">
             <div className="space-y-1">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Operation</p>
             </div>
             <div className="h-10 w-[1px] bg-white/10" />
             <div className="space-y-1">
                <p className="text-2xl font-bold text-white">Safe</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Encryption</p>
             </div>
             <div className="h-10 w-[1px] bg-white/10" />
             <div className="space-y-1">
                <p className="text-2xl font-bold text-white">Global</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Standards</p>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Glassmorphism Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-card p-10 md:p-12 relative overflow-hidden group">
            {/* Subtle inner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10 space-y-8">
              <div className="text-center space-y-2">
                 <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                 </div>
                 <h2 className="text-3xl font-bold text-white tracking-tight font-serif uppercase">Admin Authentication</h2>
                 <p className="text-white/40 text-sm font-medium">Please enter your credentials to access</p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="Admin Email"
                      className="pl-12 h-14 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-2xl text-white transition-all font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-12 pr-12 h-14 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-2xl text-white transition-all font-medium"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-2xl cinematic-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                       Enter System
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4">
                 <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                    Copyright © 2026 European Cinema Pro
                 </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative scanline effect */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] overflow-hidden">
         <div className="w-full h-1 bg-white animate-scanline" />
      </div>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
