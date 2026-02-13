"use client"

import { useEffect, useState } from "react"
import { Search, Receipt, CreditCard, Clock, CheckCircle2, XCircle, MoreHorizontal, Eye, Filter, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { bookingService, Booking } from "@/services/booking.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAll()
      setBookings(data)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  }

  const getStatusBg = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'CANCELLED': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
      case 'PENDING': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default: return 'bg-muted/10 border-border text-muted-foreground';
    }
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em] mb-2">
            <Receipt className="h-3 w-3" />
            Financials / Invoices
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Bookings <span className="opacity-40 italic">& Billings</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm font-medium leading-relaxed opacity-70">
            Monitor sales and transaction history. Tracking revenue from tickets and concessions.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by Invoice ID or User..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-80 bg-background/40 backdrop-blur-md border-border/50 rounded-full h-12 focus:w-96 transition-all duration-500 font-medium"
            />
          </div>
          <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 hover:border-primary/20">
            <Filter className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 w-full bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="glass-card border-white/5 hover:border-primary/10 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* ID & Date */}
                      <div className="p-6 md:w-64 border-b md:border-b-0 md:border-r border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Invoice ID</p>
                        <p className="text-sm font-black font-sans truncate mb-2">#{booking.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold italic">
                           {format(new Date(booking.createdAt), "dd MMM yyyy • HH:mm")}
                        </p>
                      </div>

                      {/* User Info */}
                      <div className="p-6 md:flex-1 flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                            <User className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Customer</p>
                            <p className="text-sm font-bold truncate">User #{booking.userId.slice(0, 8)}</p>
                         </div>
                      </div>

                      {/* Amount */}
                      <div className="p-6 md:w-48 text-right bg-white/[0.02]">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Total Paid</p>
                         <p className="text-xl font-serif font-black text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                         </p>
                      </div>

                      {/* Status */}
                      <div className="p-6 md:w-56 flex items-center justify-end gap-4">
                         <div className={cn(
                           "flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest",
                           getStatusBg(booking.status)
                         )}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <Eye className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-32 glass-card opacity-50">
               <Receipt className="h-16 w-16 mb-4" />
               <p className="text-xl font-serif">No transactions recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
