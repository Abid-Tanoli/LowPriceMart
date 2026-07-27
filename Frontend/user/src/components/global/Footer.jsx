import { Package } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          <span>© {new Date().getFullYear()} LowPriceMart. All rights reserved.</span>
        </div>
        <ul className="flex items-center gap-6 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground transition">About</a></li>
          <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
          <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
