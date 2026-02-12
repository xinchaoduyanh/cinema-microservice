import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Bookings</h1>
        <p className="text-muted-foreground">Manage ticket bookings and reservations.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
          <CardDescription>View and manage all customer bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Booking management table will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
