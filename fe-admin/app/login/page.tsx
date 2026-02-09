"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md relative z-10">
        
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-gray-400">Cinema Management System</p>
        </div>

        <Card className="border-gray-800 bg-gray-950/50 backdrop-blur text-gray-100 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Secure Login</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-900/30 border border-red-900/50 text-red-200 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@cinema.com"
                    className="pl-10 bg-gray-900/50 border-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-gray-900/50 border-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2" 
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center text-gray-500 w-full">
              Protected area. Unauthorized access is prohibited.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
