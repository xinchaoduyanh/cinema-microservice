"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ChevronRight } from "lucide-react"
import { authService, RegisterParams } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<RegisterParams>({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "GUEST"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.register(formData)
      router.push('/login?registered=true')
    } catch (err: any) {
      console.error("Register error:", err)
      const msg = err.response?.data?.message || "Registration failed. Please try again."
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

      {/* Form Section */}
      <div className="flex items-center justify-center p-6 md:p-10 lg:p-16 relative z-20 order-2 lg:order-1 h-full overflow-hidden">
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
          className="w-full max-w-md space-y-6 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block">Join the Experience</span>
            <h2 className="text-4xl font-serif font-bold tracking-tighter uppercase text-white">Register</h2>
          </motion.div>

          <div className="space-y-5">
            {/* Google Login */}
            <motion.div variants={itemVariants}>
              <GoogleLoginButton label="Sign up with Google" />
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="h-px w-full bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">or fill details</span>
              <div className="h-px w-full bg-white/10" />
            </motion.div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/5 border border-red-500/20 text-red-500/80 text-[10px] rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Full Name */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    placeholder="Grand Guest"
                    className="pl-12 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 rounded-xl transition-all text-xs"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    type="email"
                    placeholder="guest@aesthetix.com"
                    className="pl-12 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 rounded-xl transition-all text-xs"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    type="tel"
                    placeholder="+84 ..."
                    className="pl-12 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 rounded-xl transition-all text-xs"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
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
                      Creating Account...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="text-center pt-4 border-t border-white/5">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Already registered? </span>
            <Link
              href="/login"
              className="text-[10px] text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest inline-flex items-center gap-1 group"
            >
              Back to Login
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Left Decoration - Shared Cinematic Style */}
      <div className="hidden lg:block relative overflow-hidden border-l border-white/5 order-1 lg:order-2 h-full">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2070"
          alt="Cinema Interior"
          className="absolute inset-0 w-full h-full object-cover grayscale-[40%]"
        />
        <div className="absolute inset-x-0 bottom-0 p-16 z-20 text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold block mb-3">Luxury Defined</span>
            <h1 className="text-6xl font-serif font-bold tracking-tighter uppercase leading-[0.9] text-white">
              The Finest<br />Seats
            </h1>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
