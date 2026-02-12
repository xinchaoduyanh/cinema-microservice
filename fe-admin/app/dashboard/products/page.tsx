import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">Products & F&B</h1>
        <p className="text-muted-foreground">Manage food, beverages, and merchandise.</p>
      </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Product list and stock management.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Product inventory management will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
