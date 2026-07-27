import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

const PaymentResult = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("processing")

  useEffect(() => {
    // Gateways return different params; check common ones
    const ppResponse = searchParams.get("pp_ResponseCode")
    const epResponse = searchParams.get("responseCode")
    const txnStatus = searchParams.get("txn_status")

    if (ppResponse === "000" || epResponse === "0" || epResponse === "000" || txnStatus === "success") {
      setStatus("success")
    } else if (ppResponse || epResponse || txnStatus) {
      setStatus("failure")
    } else {
      // No gateway params - check URL path or just show processing
      setTimeout(() => setStatus("unknown"), 3000)
    }
  }, [searchParams])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <Card>
        <CardContent className="p-8 space-y-6">
          {status === "processing" && (
            <>
              <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
              <h2 className="text-2xl font-bold">Processing Payment</h2>
              <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
              <p className="text-muted-foreground">Your order has been placed and payment confirmed.</p>
              <Button onClick={() => navigate("/orders")} className="w-full">
                View My Orders
              </Button>
            </>
          )}

          {status === "failure" && (
            <>
              <XCircle className="h-16 w-16 mx-auto text-destructive" />
              <h2 className="text-2xl font-bold text-destructive">Payment Failed</h2>
              <p className="text-muted-foreground">The payment was not completed. Please try again.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/checkout")} className="flex-1">
                  Retry Checkout
                </Button>
                <Button onClick={() => navigate("/orders")} className="flex-1">
                  My Orders
                </Button>
              </div>
            </>
          )}

          {status === "unknown" && (
            <>
              <h2 className="text-2xl font-bold">Payment Result</h2>
              <p className="text-muted-foreground">We could not determine the payment result. Check your orders for updates.</p>
              <Button onClick={() => navigate("/orders")} className="w-full">
                View My Orders
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentResult
