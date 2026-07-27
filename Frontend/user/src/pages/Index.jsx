import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Truck } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { getProducts } from "../services/productApi"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const banners = [
  {
    image: "https://images.unsplash.com/photo-1606813902910-4b9c3ab7bfcf?auto=format&fit=crop&w=1500&q=80",
    title: "Discover New Trends",
    subtitle: "Exclusive Deals Every Day",
  },
  {
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1500&q=80",
    title: "Summer Collection 2026",
    subtitle: "Up to 40% Off on Top Brands",
  },
  {
    image: "https://images.unsplash.com/photo-1561715276-a2d087060f1a?auto=format&fit=crop&w=1500&q=80",
    title: "Free Shipping",
    subtitle: "On orders over Rs. 2,000",
  },
]

const categories = [
  { name: "Electronics", icon: "🖥️" },
  { name: "Clothes", icon: "👕" },
  { name: "Shoes", icon: "👟" },
  { name: "Furniture", icon: "🪑" },
]

const deals = [
  { title: "Weekend Flash Sale", discount: "30% OFF", color: "from-violet-500 to-purple-600" },
  { title: "New User Offer", discount: "Rs. 500 OFF", color: "from-blue-500 to-cyan-600" },
  { title: "Free Delivery", discount: "On First Order", color: "from-emerald-500 to-green-600" },
]

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [category, setCategory] = useState("")
  const [newArrivals, setNewArrivals] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  const fetchProducts = async (page = 1, selectedCategory = "") => {
    setLoading(true)
    try {
      const res = await getProducts(page, 10, selectedCategory)
      setProducts(res.docs || [])
      setTotalPages(res.totalPages || 1)
      setCurrentPage(res.currentPage || 1)
      setNewArrivals((res.docs || []).slice(0, 5))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, category)
  }, [currentPage, category])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <div>
      <section className="relative w-full h-[450px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-12 md:px-24">
              <Badge variant="secondary" className="w-fit mb-4 text-sm">
                {index === 0 ? "New Arrivals" : index === 1 ? "Season Sale" : "Special Offer"}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 max-w-xl">
                {banner.title}
              </h2>
              <p className="text-lg text-white/80 mb-6">{banner.subtitle}</p>
              <Button size="lg" className="w-fit" asChild>
                <Link to="/product">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((deal, i) => (
            <Card key={i} className={`bg-gradient-to-r ${deal.color} text-white border-0`}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="text-3xl">
                  {i === 0 ? <Zap className="h-8 w-8" /> : i === 1 ? <Sparkles className="h-8 w-8" /> : <Truck className="h-8 w-8" />}
                </div>
                <div>
                  <p className="font-semibold">{deal.title}</p>
                  <p className="text-2xl font-bold">{deal.discount}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Browse our latest collection</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={(val) => { setCategory(val); setCurrentPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothes">Clothes</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square rounded-none" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  category={product.category}
                  brand={product.brand}
                  price={product.price}
                  description={product.description}
                  countInStock={product.stock}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found.</p>
            <Button variant="link" onClick={() => { setCategory(""); setCurrentPage(1) }}>
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="text-muted-foreground mt-1">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/product?category=${cat.name}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-2">Just In</Badge>
              <h2 className="text-3xl font-bold text-foreground">New Arrivals</h2>
              <p className="text-muted-foreground mt-1">Freshly stocked — grab yours before they're gone!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {newArrivals.map((item) => (
                <Link key={item._id} to={`/product/${item._id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image || "/placeholder-product.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase mb-1">{item.category}</p>
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description?.slice(0, 60)}...</p>
                      <p className="font-bold text-primary mt-2">Rs. {item.price?.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
