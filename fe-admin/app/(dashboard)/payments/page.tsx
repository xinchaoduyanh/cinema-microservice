import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Payments & Wallet</h1>
        <p className="text-muted-foreground">Monitor transactions and wallet activities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 ₫</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Wallet Deposits</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">0 ₫</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Transaction table will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
