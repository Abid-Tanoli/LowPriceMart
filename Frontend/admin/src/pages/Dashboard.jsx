import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Users, ShoppingCart, Package, PlusCircle, ListOrdered, UserCircle } from "lucide-react"
import { getDashboardStats } from "../services/adminDashboard"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { Button } from "../components/ui/button"

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Total Products", value: stats.products, icon: Package, color: "text-violet-600", bg: "bg-violet-100" },
  ]

  const quickActions = [
    { title: "Add Product", desc: "Create a new product", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50", path: "/create-product" },
    { title: "View Orders", desc: "Manage customer orders", icon: ListOrdered, color: "text-emerald-600", bg: "bg-emerald-50", path: "/orders" },
    { title: "Manage Users", desc: "User management", icon: UserCircle, color: "text-violet-600", bg: "bg-violet-50", path: "/users" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 justify-start"
                onClick={() => navigate(action.path)}
              >
                <div className={`p-2 rounded-full ${action.bg} ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
