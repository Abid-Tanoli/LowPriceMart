import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, HeadphonesIcon, Send, Check } from "lucide-react"
import { Button } from "../components/ui/button"
import { toast } from "sonner"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
}

const contactMethods = [
  { icon: Mail, label: "Email", value: "support@lowpricemart.com", href: "mailto:support@lowpricemart.com" },
  { icon: Phone, label: "Phone", value: "+92 300 1234567", href: "tel:+923001234567" },
  { icon: MapPin, label: "Address", value: "Karachi, Sindh, Pakistan", href: null },
]

const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    setName("")
    setEmail("")
    setMessage("")
    toast.success("Message sent! We'll get back to you soon.")
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" {...fadeUp}>
            Contact Us
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            Have a question, concern, or feedback? We'd love to hear from you.
            Our team is here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div className="space-y-6" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form and we'll get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px] resize-y"
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? "Sending..." : sent ? (
                    <><Check className="mr-2 h-4 w-4" /> Sent!</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> Send Message</>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold">Contact Information</h2>
              <p className="text-muted-foreground">
                You can also reach us through the following channels.
              </p>
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <div key={method.label} className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                    <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                      <method.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{method.label}</p>
                      {method.href ? (
                        <a href={method.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{method.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border">
                <div className="flex items-center gap-3 mb-3">
                  <HeadphonesIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-semibold">24/7 Support</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our customer support team is available around the clock to assist you
                  with any questions or concerns about your orders.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
