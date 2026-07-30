import { Package, Heart, Truck, Shield, HeadphonesIcon } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl">LowPriceMart</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted destination for quality products at unbeatable prices.
              Shop with confidence across Pakistan.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/product" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Payment Methods</h4>
            <p className="text-sm text-muted-foreground mb-3">We accept:</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-card border rounded-md text-xs font-medium">
                <Heart className="h-3.5 w-3.5 text-red-500" /> JazzCash
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-card border rounded-md text-xs font-medium">
                <Heart className="h-3.5 w-3.5 text-green-500" /> EasyPaisa
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-card border rounded-md text-xs font-medium">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LowPriceMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
