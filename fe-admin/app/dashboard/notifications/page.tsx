import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Notifications</h1>
        <p className="text-muted-foreground">Manage and send system notifications.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Sent Notifications</CardTitle>
          <CardDescription>History of alerts sent to users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Notification management interface will be implemented here.
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Send New Notification</CardTitle>
          <CardDescription>Create and dispatch announcements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Form to send notification will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
