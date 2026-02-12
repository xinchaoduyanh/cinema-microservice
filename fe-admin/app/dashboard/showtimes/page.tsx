import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShowtimesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Showtimes</h1>
        <p className="text-muted-foreground">Manage movie showtimes and scheduling.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Calendar view of movie showtimes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Showtime scheduler will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
