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
  Building2
} from "lucide-react"

// Mock data - sẽ fetch từ API sau
const stats = [
  {
    title: "Tổng doanh thu",
    value: "1,234,567,000 ₫",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-600 to-emerald-600",
  },
  {
    title: "Vé đã bán",
    value: "8,432",
    change: "+8.2%",
    trend: "up",
    icon: Ticket,
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "Người dùng",
    value: "12,543",
    change: "+23.1%",
    trend: "up",
    icon: Users,
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Phim đang chiếu",
    value: "24",
    change: "-2",
    trend: "down",
    icon: Film,
    color: "from-orange-600 to-red-600",
  },
]

const recentBookings = [
  { id: "BK001", customer: "Nguyễn Văn A", movie: "Avatar 2", time: "10 phút trước", amount: "150,000 ₫" },
  { id: "BK002", customer: "Trần Thị B", movie: "John Wick 4", time: "25 phút trước", amount: "180,000 ₫" },
  { id: "BK003", customer: "Lê Văn C", movie: "Mario Bros", time: "1 giờ trước", amount: "120,000 ₫" },
  { id: "BK004", customer: "Phạm Thị D", movie: "Guardians 3", time: "2 giờ trước", amount: "200,000 ₫" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại! Đây là tổng quan hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Hôm nay
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Xem báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight
          
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon 
                    className={`h-4 w-4 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`} 
                  />
                  <span 
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Đặt vé gần đây</CardTitle>
            <CardDescription>Danh sách đặt vé mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                      {booking.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-gray-500">{booking.movie}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{booking.amount}</p>
                    <p className="text-xs text-gray-500">{booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Film className="h-6 w-6" />
              <span>Thêm phim mới</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Building2 className="h-6 w-6" />
              <span>Thêm rạp chiếu</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Tạo lịch chiếu</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Quản lý user</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
