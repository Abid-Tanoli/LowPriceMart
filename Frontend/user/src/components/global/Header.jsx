import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, User, LogOut, Package, Search, Menu, Heart, X } from "lucide-react"
import { logout } from "../../hooks/auth/authSlice"
import { useCart } from "../../context/CartContext"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { ThemeToggle } from "../ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useState, useEffect, useRef, useCallback } from "react"
import { getSearchSuggestions } from "../../services/productApi"
import { getWishlist } from "../../services/wishlistApi"

const Header = () => {
  const { user } = useSelector((state) => state.auth)
  const { cart } = useCart()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  const cartCount = cart?.length || 0
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const res = await getWishlist()
        setWishlistCount(res.products?.length || 0)
      } catch {}
    }
    if (user) fetchWishlistCount()
    else setWishlistCount(0)
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false)
    setSearchQuery("")
    navigate(`/product/${product._id}`)
  }

  const handleSeeAllResults = () => {
    setShowSuggestions(false)
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0 || searchQuery.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleClickOutside = useCallback((e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = searchQuery.trim()
    if (q.length === 0) {
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(false)
      return
    }
    setSuggestionsLoading(true)
    setShowSuggestions(true)
    debounceRef.current = setTimeout(async () => {
      const results = await getSearchSuggestions(q)
      setSuggestions(results)
      setSuggestionsLoading(false)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const renderSuggestions = () => {
    if (!showSuggestions) return null

    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden">
        {suggestionsLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleSeeAllResults}
              className="w-full px-3 py-2 text-sm text-center text-primary font-medium border-t hover:bg-accent transition-colors"
            >
              See all results
            </button>
          </>
        ) : searchQuery.trim() ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <p>No products found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
          <Package className="h-6 w-6" />
          <span className="hidden sm:inline">LowPriceMart</span>
        </Link>

        <div ref={searchRef} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4 relative">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </form>
          {renderSuggestions()}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/product">Products</Link>
          </Button>

          {user && (
            <Button variant="ghost" asChild className="relative">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>
          )}

          <Button variant="ghost" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {user?.user?.name || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden border-t bg-background"
        >
          <div className="p-4 space-y-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/product" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false) }}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild className="w-full">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
          )}
          <div className="flex justify-center pt-2">
            <ThemeToggle />
          </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header