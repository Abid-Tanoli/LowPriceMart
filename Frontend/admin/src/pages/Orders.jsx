import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import adminApi from "../services/adminApi"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Skeleton } from "../components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await adminApi.get("/admin/orders")
        setOrders(Array.isArray(data) ? data : data.orders || [])
      } catch (err) {
        console.error(err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No orders found.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Txn ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">{order._id.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email || ""}</div>
                    </TableCell>
                    <TableCell className="font-semibold">Rs. {order.totalPrice?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-xs">{order.paymentMethod || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={order.isPaid ? "success" : "warning"}>
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.transactionId || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.isDelivered ? "success" : "secondary"}>
                        {order.isDelivered ? "Delivered" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Orders
