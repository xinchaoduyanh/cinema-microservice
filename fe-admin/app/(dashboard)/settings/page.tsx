import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the interface theme.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme Mode</span>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
               <span className="text-muted-foreground">Profile editing will be implemented here.</span>
               <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
