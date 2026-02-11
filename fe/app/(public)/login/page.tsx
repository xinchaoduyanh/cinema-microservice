"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronRight } from "lucide-react"
import { authService, LoginParams } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
      {/* Light Projection Beam Effect - Circular Projector Lens Style */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none z-30 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_25%,transparent_70%)] opacity-80" />

      {/* Dust motes/Film grain overlay for the beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-30 film-grain opacity-[0.03]" />

      {/* Left Decoration - Cinematic Image / Branding */}
      <div className="hidden lg:block relative overflow-hidden border-r border-white/5 h-full">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059"
          alt="Cinema"
          className="absolute inset-0 w-full h-full object-cover grayscale-[40%]"
        />
        <div className="absolute inset-x-0 bottom-0 p-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold block mb-3">The Art of Cinema</span>
            <h1 className="text-6xl font-serif font-bold tracking-tighter uppercase leading-[0.9] text-white">
              Aesthetix<br />Experiences
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 md:p-10 lg:p-16 relative z-20 h-full overflow-hidden">
        {/* Cinema Seats Background behind form - More visible as requested */}
        <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2070"
            alt="Cinema Seats"
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block">Access Your Account</span>
            <h2 className="text-4xl font-serif font-bold tracking-tighter uppercase text-white">Sign In</h2>
          </motion.div>

          <div className="space-y-5">
            {/* Google Login */}
            <motion.div variants={itemVariants}>
              <GoogleLoginButton label="Continue with Google" />
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="h-px w-full bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">or use email</span>
              <div className="h-px w-full bg-white/10" />
            </motion.div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/5 border border-red-500/20 text-red-500/80 text-[10px] rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 rounded-xl transition-all text-xs"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Password</label>
                  <Link href="/forgot-password" title="Forgot password?" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors font-bold">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="pl-12 pr-12 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 rounded-xl transition-all text-xs"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-11 bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] rounded-full shadow-lg shadow-white/5 transition-all group mt-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="text-center pt-4 border-t border-white/5">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">New guest? </span>
            <Link
              href="/register"
              className="text-[10px] text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest inline-flex items-center gap-1 group"
            >
              Create Account
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
