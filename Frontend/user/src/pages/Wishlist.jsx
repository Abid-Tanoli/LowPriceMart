import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { getWishlist, removeFromWishlist } from "../services/wishlistApi"
import { addToCart } from "../services/cartApi"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { toast } from "sonner"

const Wishlist = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const res = await getWishlist()
      setProducts(res.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId, name) => {
    try {
      await removeFromWishlist(productId)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      toast.success(`Removed ${name || "item"} from wishlist`)
    } catch {
      toast.error("Failed to remove item")
    }
  }

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart")
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Wishlist is Empty</h2>
        <p className="text-muted-foreground mb-6">Save items you love by tapping the heart icon.</p>
        <Button asChild>
          <a href="/product">Browse Products</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">({products.length} item{products.length > 1 ? "s" : ""})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden group">
            <div
              className="aspect-square overflow-hidden bg-muted cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image || "/placeholder-product.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3
                  className="font-semibold line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.name}
                </h3>
                <p className="font-bold text-primary mt-1">
                  Rs. {product.price?.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleMoveToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {product.stock > 0 ? "Move to Cart" : "Out of Stock"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(product._id, product.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
