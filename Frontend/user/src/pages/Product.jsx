import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { SlidersHorizontal, X } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { getProducts } from "../services/productApi"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const categories = ["Electronics", "Clothes", "Shoes", "Furniture"]

const sortOptions = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
]

const PRICE_RANGES = [
  { label: "Under Rs. 1,000", min: 0, max: 1000 },
  { label: "Rs. 1,000 - Rs. 5,000", min: 1000, max: 5000 },
  { label: "Rs. 5,000 - Rs. 10,000", min: 5000, max: 10000 },
  { label: "Over Rs. 10,000", min: 10000, max: Infinity },
]

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const searchQuery = searchParams.get("search") || ""
  const categoryFilter = searchParams.get("category") || ""
  const sortBy = searchParams.get("sort") || ""
  const priceMin = searchParams.get("priceMin") || ""
  const priceMax = searchParams.get("priceMax") || ""

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value)
      else newParams.delete(key)
    })
    setSearchParams(newParams)
    setCurrentPage(1)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts(currentPage, 10, categoryFilter, searchQuery, sortBy)
      let filtered = res.docs || []

      if (priceMin) {
        filtered = filtered.filter((p) => p.price >= Number(priceMin))
      }
      if (priceMax) {
        filtered = filtered.filter((p) => p.price <= Number(priceMax))
      }

      setProducts(filtered)
      setTotalPages(res.totalPages || 1)
      setTotalDocs(res.totalDocs || filtered.length)
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, categoryFilter, searchQuery, sortBy, priceMin, priceMax])

  const clearFilters = () => {
    setSearchParams({})
    setCurrentPage(1)
  }

  const hasActiveFilters = categoryFilter || sortBy || priceMin || priceMax

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className={`md:w-64 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
          <Card>
            <CardContent className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => updateParams({ category: "" })}
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition ${
                      !categoryFilter ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParams({ category: cat })}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition ${
                        categoryFilter === cat ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range) => {
                    const isActive = String(range.min) === priceMin && String(range.max) === priceMax
                    return (
                      <button
                        key={range.label}
                        onClick={() =>
                          isActive
                            ? updateParams({ priceMin: "", priceMax: "" })
                            : updateParams({ priceMin: String(range.min), priceMax: range.max === Infinity ? "" : String(range.max) })
                        }
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition ${
                          isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Filters
              </Button>
              <div>
                {searchQuery && (
                  <Badge variant="secondary" className="mr-2">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {totalDocs} product{totalDocs !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={(val) => updateParams({ sort: val })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                    .map((page, idx, arr) => (
                      <span key={page} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-1 text-muted-foreground">...</span>}
                        <Button variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                          {page}
                        </Button>
                      </span>
                    ))}
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found.</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Product
