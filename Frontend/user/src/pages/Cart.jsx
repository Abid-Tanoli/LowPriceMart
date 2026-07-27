import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useQtyTotals } from "../context/QtyAndTotalsContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"

const Cart = () => {
  const navigate = useNavigate()
  const { cart, fetchCart } = useCart()
  const { increaseQty, decreaseQty, removeItem, subtotal, shipping, tax, total } = useQtyTotals()
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null)

  useEffect(() => {
    const load = async () => {
      await fetchCart()
      setLoading(false)
    }
    load()
  }, [fetchCart])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild>
          <a href="/product">Start Shopping</a>
        </Button>
      </div>
    )
  }

  const handleDecrease = (item) => {
    if (item.qty <= 1) {
      setConfirmRemove(item.product._id)
    } else {
      decreaseQty(item.product._id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
        <span className="text-sm text-muted-foreground">({cart.length} item{cart.length > 1 ? "s" : ""})</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            if (!item?.product) return null
            const p = item.product
            return (
              <Card key={p._id} className="overflow-hidden">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                    <img src={p.image || "/placeholder-product.svg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.category}</p>
                        <p className="font-bold text-primary mt-1">Rs. {p.price?.toLocaleString()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => setConfirmRemove(p._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8"
                          onClick={() => handleDecrease(item)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8"
                          disabled={item.qty >= (p.stock || 99)}
                          onClick={() => increaseQty(p._id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Rs. {(p.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>Rs. {tax?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total?.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/product">Continue Shopping</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!confirmRemove} onOpenChange={(open) => !open && setConfirmRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmRemove(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmRemove) removeItem(confirmRemove)
                setConfirmRemove(null)
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Cart
