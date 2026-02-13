"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pizza, Trash2, Edit2, Popcorn, Coffee, IceCream, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { productService, Product } from "@/services/product.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <Pizza className="h-4 w-4" />;
      case 'drink': return <Coffee className="h-4 w-4" />;
      case 'snack': return <Popcorn className="h-4 w-4" />;
      case 'dessert': return <IceCream className="h-4 w-4" />;
      default: return <Pizza className="h-4 w-4" />;
    }
  }

  const deleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      try {
        await productService.delete(id)
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em] mb-2">
            <Popcorn className="h-3 w-3" />
            Concessions / F&B
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Products <span className="opacity-40 italic">Menu</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm font-medium leading-relaxed opacity-70">
            Manage your cinema's culinary offerings. From gourmet popcorn to artisanal beverages.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-80 bg-background/40 backdrop-blur-md border-border/50 rounded-full h-12 focus:w-96 transition-all duration-500 font-medium"
            />
          </div>
          <Button className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-2xl" />
              <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden glass-card border-white/5 hover:border-primary/20 transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <Popcorn className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                        {getCategoryIcon(product.category)}
                        {product.category}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1 rounded-xl font-bold bg-white text-black hover:bg-primary">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => deleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 text-center">
                      <h3 className="text-xl font-serif font-medium mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-black text-foreground">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1 opacity-60">
                        {product.description || "No description available."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 glass-card">
          <Popcorn className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-xl font-bold text-muted-foreground">No products found</h3>
          <p className="text-muted-foreground text-sm">Try adding some food or beverages to your menu.</p>
        </div>
      )}
    </div>
  )
}
