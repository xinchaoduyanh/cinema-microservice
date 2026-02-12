import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CinemasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Theaters & Cinemas</h1>
        <p className="text-muted-foreground">Manage cinema locations and theater rooms.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Cinema List</CardTitle>
          <CardDescription>View and edit cinema locations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Cinema management interface will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
