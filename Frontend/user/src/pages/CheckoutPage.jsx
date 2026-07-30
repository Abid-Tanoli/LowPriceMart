import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingBag, CreditCard, MapPin, CheckCircle, ArrowLeft } from "lucide-react"
import { createOrder } from "../services/orderApi"
import { useCart } from "../context/CartContext"
import { useQtyTotals } from "../context/QtyAndTotalsContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import axiosInstance from "../services/api"
import { toast } from "sonner"

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery", desc: "Pay when you receive" },
  { value: "JazzCash", label: "JazzCash", desc: "Pay via JazzCash mobile wallet" },
  { value: "EasyPaisa", label: "EasyPaisa", desc: "Pay via EasyPaisa account" },
]

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, fetchCart, clearCart } = useCart()
  const { subtotal, shipping, tax, total } = useQtyTotals()

  const [step, setStep] = useState("shipping")
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const validateShipping = () => {
    const errs = {}
    if (!shippingAddress.address.trim()) errs.address = "Address is required"
    if (!shippingAddress.city.trim()) errs.city = "City is required"
    if (!shippingAddress.postalCode.trim()) errs.postalCode = "Postal code is required"
    if (!shippingAddress.country.trim()) errs.country = "Country is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return

    const validItems = cart.filter(item => item?.product)
    if (!validItems.length) {
      toast.error("Cart is empty!")
      return
    }

    setLoading(true)
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        orderItems: validItems.map(item => ({
          product: item.product._id,
          qty: item.qty
        }))
      }

      const order = await createOrder(orderData)
      clearCart()

      if (paymentMethod === "COD") {
        navigate("/order-success", { state: { order } })
      } else {
        // Redirect to payment gateway
        const gateway = paymentMethod === "JazzCash" ? "jazzcash" : "easypaisa"
        const { data } = await axiosInstance.post(`/payments/${gateway}/initiate`, { orderId: order._id })
        // Auto-submit form to gateway
        const form = document.createElement("form")
        form.method = "POST"
        form.action = data.redirectUrl
        form.style.display = "none"
        Object.entries(data.fields).forEach(([key, value]) => {
          const input = document.createElement("input")
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Order failed"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: CheckCircle },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
      </div>

      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                if (step === "payment" && s.id === "shipping") setStep("shipping")
                if (step === "review" && (s.id === "shipping" || s.id === "payment")) setStep(s.id)
              }}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : steps.indexOf({ id: step }) > i
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.label === "Shipping" ? "Ship" : s.label === "Payment" ? "Pay" : "Review"}</span>
            </button>
            {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {step === "shipping" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  {["address", "city", "postalCode", "country"].map((field) => (
                    <div key={field}>
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={shippingAddress[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field}`}
                        className={errors[field] ? "border-destructive" : ""}
                      />
                      {errors[field] && (
                        <p className="text-xs text-destructive mt-1">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                  <Button className="w-full mt-4" onClick={() => { if (validateShipping()) setStep("payment") }}>
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          paymentMethod === method.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.value ? "border-primary" : "border-muted-foreground"
                          }`}>
                            {paymentMethod === method.value && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep("shipping")}>Back</Button>
                    <Button className="flex-1" onClick={() => setStep("review")}>Review Order</Button>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Review Your Order</h2>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Shipping To</h3>
                    <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Payment Method</h3>
                    <p>{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label || paymentMethod}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Items ({cart.length})</h3>
                    {cart.filter(i => i?.product).map((item) => (
                      <div key={item.product._id} className="flex items-center gap-3 text-sm">
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                          <img src={item.product.image || "/placeholder-product.svg"} alt="" onError={(e) => e.target.src = "/placeholder-product.svg"} className="w-full h-full object-cover" />
                        </div>
                        <span className="flex-1 line-clamp-1">{item.product.name}</span>
                        <span>x{item.qty}</span>
                        <span className="font-medium">Rs. {(item.product.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("payment")}>Back</Button>
                    <Button className="flex-1" size="lg" disabled={loading} onClick={handlePlaceOrder}>
                      {loading ? "Processing..." : `Place Order — Rs. ${total?.toLocaleString()}`}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {cart.filter(i => i?.product).map((item) => (
                  <div key={item.product._id} className="flex justify-between gap-2">
                    <span className="line-clamp-1 text-muted-foreground">{item.product.name} <span className="text-xs">x{item.qty}</span></span>
                    <span className="shrink-0">Rs. {(item.product.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Rs. {tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>Rs. {total?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
