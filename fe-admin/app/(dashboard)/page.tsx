export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for Stat Cards */}
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-sm font-medium text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold text-white">$45,231.89</div>
          <div className="text-xs text-green-500">+20.1% from last month</div>
        </div>
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-sm font-medium text-gray-500">Active Movies</div>
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-xs text-gray-500">Now Showing</div>
        </div>
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-sm font-medium text-gray-500">Bookings</div>
          <div className="text-2xl font-bold text-white">+2350</div>
          <div className="text-xs text-green-500">+180.1% from last month</div>
        </div>
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="text-sm font-medium text-gray-500">Active Users</div>
          <div className="text-2xl font-bold text-white">+573</div>
          <div className="text-xs text-green-500">+201 since last hour</div>
        </div>
      </div>
    </div>
  )
}
