"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import { authService, LoginParams } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login(formData)
      if (response.accessToken) {
        await login(response.accessToken, response.refreshToken)
        router.push('/')
      }
    } catch (err: any) {
      console.error("Login error:", err)
      const msg = err.response?.data?.message || "Invalid credentials."
      setError(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">Welcome Back</span>
            </div>
            <h1 className="text-6xl font-serif font-bold text-white leading-tight">
              Your Cinema
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Experience
              </span>
              <br />
              Awaits
            </h1>
            <p className="text-xl text-white/60 max-w-md">
              Sign in to access exclusive screenings, book premium seats, and enjoy personalized recommendations.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {["Premium Seats", "Early Access", "Exclusive Deals"].map((feature) => (
              <div key={feature} className="glass px-4 py-2 rounded-full">
                <span className="text-sm text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Sign In</h2>
                <p className="text-white/60">Enter your credentials to continue</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-blue-500/50 rounded-xl transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80">Password</label>
                    <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-blue-500/50 rounded-xl transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
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
                      Signing In...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/50 px-3 text-white/40">New to AESTHETIX?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link 
                  href="/register" 
                  className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  Create an account
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
