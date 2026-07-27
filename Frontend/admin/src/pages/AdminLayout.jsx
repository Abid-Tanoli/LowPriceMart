import { useDispatch } from "react-redux"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, ShoppingCart, Package, PlusCircle, LogOut, Menu, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { useState } from "react"
import { logout as reduxLogout } from "../hooks/authSlice"

const navItems = [
  { to: "", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "users", icon: Users, label: "Users" },
  { to: "orders", icon: ShoppingCart, label: "Orders" },
  { to: "products", icon: Package, label: "Products" },
  { to: "create-product", icon: PlusCircle, label: "Add Product" },
]

const AdminLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const logoutHandler = () => {
    dispatch(reduxLogout())
    navigate("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 lg:relative lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Package className="h-6 w-6" />
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="destructive" className="w-full" onClick={logoutHandler}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 bg-background border-b px-4 h-14 flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Admin Panel</span>
        </div>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
