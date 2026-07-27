import { ShoppingCart, Eye, Heart, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { addToCart } from "../services/cartApi"
import { addToWishlist, removeFromWishlist } from "../services/wishlistApi"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
} from "./ui/card"
import { toast } from "sonner"

const ProductCard = ({ _id, image, name, category, brand, price, description, countInStock, rating, numReviews, wishlisted, onWishlistChange }) => {
  const handleCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart(_id, 1)
      toast.success(`${name} added to cart!`)
    } catch (error) {
      console.error("Add to cart error:", error)
      toast.error(error.response?.data?.message || "Failed to add item")
    }
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (wishlisted) {
        await removeFromWishlist(_id)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(_id)
        toast.success("Added to wishlist")
      }
      if (onWishlistChange) onWishlistChange()
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist action failed")
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg w-72">
      <Link to={`/product/${_id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image || "/placeholder-product.svg"}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {countInStock > 0 ? (
            <Badge variant="success" className="absolute top-2 left-2">In Stock</Badge>
          ) : (
            <Badge variant="destructive" className="absolute top-2 left-2">Out of Stock</Badge>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${_id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{category}</p>
          <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{Number(rating).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({numReviews})</span>
            </div>
          )}
          {brand && brand !== "N/A" && (
            <p className="text-xs text-muted-foreground mt-1">{brand}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <span className="text-lg font-bold text-primary">Rs. {price?.toLocaleString()}</span>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" asChild>
            <Link to={`/product/${_id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant={countInStock > 0 ? "default" : "secondary"}
            disabled={countInStock === 0}
            onClick={handleCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
