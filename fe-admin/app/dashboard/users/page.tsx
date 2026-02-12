import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">User Management</h1>
        <p className="text-muted-foreground">Manage service users and administrators.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Comprehensive list of all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            User data table will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
