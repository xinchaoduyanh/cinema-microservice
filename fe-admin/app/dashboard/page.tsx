import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Users, 
  Film, 
  Ticket, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Sparkles
} from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "1,234,567,000 ₫",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Tickets Sold",
    value: "8,432",
    change: "+8.2%",
    trend: "up",
    icon: Ticket,
  },
  {
    title: "Total Users",
    value: "12,543",
    change: "+23.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Now Showing",
    value: "24",
    change: "-2",
    trend: "down",
    icon: Film,
  },
]

const recentBookings = [
  { id: "BK001", customer: "John Smith", movie: "Avatar 2", time: "10 mins ago", amount: "150,000 ₫" },
  { id: "BK002", customer: "Sarah Jenkins", movie: "John Wick 4", time: "25 mins ago", amount: "180,000 ₫" },
  { id: "BK003", customer: "Michael Brown", movie: "Mario Bros", time: "1 hour ago", amount: "120,000 ₫" },
  { id: "BK004", customer: "Emily Davis", movie: "Guardians 3", time: "2 hours ago", amount: "200,000 ₫" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Header with European Minimalist Feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em]">
            <Sparkles className="h-3 w-3" />
            System Control
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Aesthetix <span className="opacity-30 italic">Intelligence</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium opacity-50 tracking-wide">
            Status: Synchronized. Monitoring the cinematic global nexus.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full bg-background/50 backdrop-blur-md border-border/50 px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em]">
            <Calendar className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
          <Button className="cinematic-glow font-black rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300 text-[10px] uppercase tracking-[0.2em]">
            <TrendingUp className="h-4 w-4 mr-2 text-black" />
            Global Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid - Refined with Monochrome Aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight
          
          return (
            <div key={stat.title} className="group relative">
              <Card className="glass-card overflow-hidden border-white/5 hover:border-foreground/20 transition-all duration-700 bg-background/20 rounded-[2rem]">
                <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0 p-8">
                  <div className="p-3 rounded-2xl bg-foreground text-background shadow-2xl">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${
                      stat.trend === "up" ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {stat.change}
                      <TrendIcon className="h-3 w-3" />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2 opacity-30">
                    {stat.title}
                  </div>
                  <div className="text-4xl font-serif font-medium text-foreground tracking-tighter line-clamp-1">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Recent Bookings - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-serif font-medium uppercase tracking-tighter opacity-80">Recent Flows</h2>
              <Button variant="link" className="text-foreground text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100">
                Audit Vault
              </Button>
           </div>
           
           <Card className="glass-card border-white/5 bg-background/10 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 divide-y divide-white/5">
                {recentBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between py-6 first:pt-0 last:pb-0 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-foreground transition-all duration-500">
                        <span className="text-xl font-serif text-muted-foreground group-hover:text-background font-medium">{booking.customer.charAt(0)}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-serif font-medium text-foreground group-hover:opacity-70 transition-opacity">{booking.customer}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">{booking.movie}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xl font-serif font-medium text-foreground">{booking.amount}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-20">{booking.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
           </Card>
        </div>

        {/* Quick Insights & Actions - 1/3 width */}
        <div className="space-y-12">
          <section className="space-y-6">
             <h2 className="text-xl font-serif font-medium uppercase tracking-tighter px-2 opacity-80">Utilities</h2>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Film, label: "Add Movie" },
                  { icon: Building2, label: "Theaters" },
                  { icon: Calendar, label: "Schedule" },
                  { icon: Users, label: "Vault" }
                ].map((item, i) => (
                  <Button key={i} variant="secondary" className="h-32 flex-col gap-4 bg-white/5 border-white/5 rounded-[2rem] hover:bg-foreground hover:text-background transition-all duration-700 group">
                    <item.icon className="h-8 w-8 text-muted-foreground group-hover:text-background group-hover:scale-110 transition-all duration-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-background opacity-50 group-hover:opacity-100">{item.label}</span>
                  </Button>
                ))}
             </div>
          </section>

          <Card className="glass-card bg-gradient-to-br from-neutral-800 to-black text-white border-white/10 rounded-[2.5rem] shadow-2xl p-2 overflow-hidden group relative">
            <CardHeader className="p-8">
               <CardTitle className="text-white font-serif text-2xl font-bold flex items-center gap-3 italic tracking-tighter">
                  <TrendingUp className="h-6 w-6" />
                  Premium Insight
               </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
               <p className="font-serif text-lg leading-relaxed mb-8 text-neutral-300">
                  Global cinematic output has shifted. Optimize your vault with <b>monochrome classics</b> for a 20% engagement boost.
               </p>
               <Button className="w-full bg-white text-black rounded-full h-12 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-neutral-200 transition-all">
                  Deep Audit
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
