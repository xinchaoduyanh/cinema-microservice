export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <div className="group relative p-6 glass rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-400 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-white mb-2">$45,231.89</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <span>↗</span> +20.1% from last month
            </div>
          </div>
        </div>

        {/* Active Movies Card */}
        <div className="group relative p-6 glass rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-400 mb-1">Active Movies</div>
            <div className="text-3xl font-bold text-white mb-2">12</div>
            <div className="text-xs text-gray-500">Now Showing</div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="group relative p-6 glass rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-400 mb-1">Bookings</div>
            <div className="text-3xl font-bold text-white mb-2">+2,350</div>
            <div className="text-xs text-purple-400 flex items-center gap-1">
              <span>↗</span> +180.1% from last month
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="group relative p-6 glass rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-400 mb-1">Active Users</div>
            <div className="text-3xl font-bold text-white mb-2">+573</div>
            <div className="text-xs text-orange-400 flex items-center gap-1">
              <span>↗</span> +201 since last hour
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
