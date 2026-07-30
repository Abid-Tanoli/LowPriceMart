import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ShoppingCart, ChevronLeft, Minus, Plus, Shield, Truck, RotateCcw, Heart, Star, MessageSquare } from "lucide-react"
import { getProductById, getRelatedProducts, createReview } from "../services/productApi"
import { addToCart } from "../services/cartApi"
import { addToWishlist, removeFromWishlist, getWishlist } from "../services/wishlistApi"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"
import { toast } from "sonner"

const StarSelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="p-0.5">
          <Star className={`h-6 w-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  )
}

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [relatedImgErrors, setRelatedImgErrors] = useState({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await getProductById(id)
        setProduct(res)
        const relatedRes = await getRelatedProducts(id)
        setRelated(relatedRes)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    setQuantity(1)
  }, [id])

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return
      try {
        const res = await getWishlist()
        setWishlisted(res.products?.some((p) => p._id === id) || false)
      } catch {}
    }
    checkWishlist()
  }, [id, user])

  const handleAddToCart = async () => {
    if (isAdding || !product || product.stock === 0) return
    setIsAdding(true)
    try {
      await addToCart(product._id, quantity)
      setAddedFeedback(true)
      setTimeout(() => setAddedFeedback(false), 2000)
      setQuantity(1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error("Add to cart error:", error)
      if (error.response?.status === 401) {
        navigate("/login")
      } else {
        toast.error(error.response?.data?.message || "Failed to add item")
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return }
    setWishlistLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(id)
        setWishlisted(false)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(id)
        setWishlisted(true)
        toast.success("Added to wishlist")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist action failed")
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewRating || reviewComment.trim().length < 10) return
    setSubmittingReview(true)
    try {
      await createReview(id, { rating: reviewRating, comment: reviewComment.trim() })
      toast.success("Review submitted!")
      setReviewOpen(false)
      setReviewRating(0)
      setReviewComment("")
      const updated = await getProductById(id)
      setProduct(updated)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const hasReviewed = product?.reviews?.some((r) => r.user === user?._id || r.user?._id === user?._id)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-24 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">Product not found.</p>
        <Button onClick={() => navigate("/product")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden border bg-muted relative">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={imgError ? "/placeholder-product.svg" : (product.image || "/placeholder-product.svg")}
              alt=""
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true) }}
              className={`w-full h-full object-cover ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
                <Badge variant="secondary" className="text-xs">{product.numReviews} review{product.numReviews !== 1 ? "s" : ""}</Badge>
              </div>
            )}
            {product.brand && (
              <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {product.stock > 0 ? (
              <>
                <Badge variant="success" className="text-sm px-3 py-1">In Stock</Badge>
                <span className="text-sm text-muted-foreground">
                  {product.stock} unit{product.stock > 1 ? "s" : ""} available
                </span>
              </>
            ) : (
              <Badge variant="destructive" className="text-sm px-3 py-1">Out of Stock</Badge>
            )}
          </div>

          <div className="border-t border-b py-4">
            <p className="text-4xl font-bold text-primary">Rs. {product.price?.toLocaleString()}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              <span>7-Day Returns</span>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-10 w-10"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium tabular-nums">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-10 w-10"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 md:flex-none md:min-w-[200px]"
              disabled={product.stock === 0 || isAdding}
              onClick={handleAddToCart}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                  Adding...
                </>
              ) : addedFeedback ? (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Added to Cart!
                </>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart — Rs. {(product.price * quantity).toLocaleString()}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              disabled={wishlistLoading}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews ({product.numReviews || 0})
          </h2>
          {user && (
            hasReviewed ? (
              <Badge variant="secondary" className="text-sm px-3 py-1.5">You already reviewed this product</Badge>
            ) : (
              <Button onClick={() => setReviewOpen(true)}>
                <Star className="mr-1 h-4 w-4" />
                Write a Review
              </Button>
            )
          )}
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.slice(0, 5).map((review, idx) => (
              <Card key={review._id || idx}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt || review._id)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
            {product.reviews.length > 5 && (
              <p className="text-sm text-center text-muted-foreground">
                + {product.reviews.length - 5} more review{product.reviews.length - 5 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your thoughts about {product.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <StarSelector value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Comment</p>
              <Textarea
                placeholder="Tell others about your experience (min 10 characters)..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewComment.length}/500{reviewComment.length > 0 && reviewComment.length < 10 && " — min 10 characters"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewRating || reviewComment.trim().length < 10 || submittingReview}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {related.map((item) => (
              <Card
                key={item._id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={relatedImgErrors[item._id] ? "/placeholder-product.svg" : (item.image || "/placeholder-product.svg")}
                    alt=""
                    onError={() => setRelatedImgErrors(prev => ({ ...prev, [item._id]: true }))}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground uppercase mb-1">{item.category}</p>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">{item.name}</h3>
                  <p className="font-bold text-primary text-sm mt-1">Rs. {item.price?.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetails
