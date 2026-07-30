import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
}

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: "We collect information you provide when creating an account, placing an order, or contacting our support team. This includes your name, email address, shipping address, phone number, and payment details. We also automatically collect certain data like IP address, browser type, and device information to improve your shopping experience.",
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: "Your information is used to process orders, provide customer support, send order updates, and personalize your shopping experience. With your consent, we may also send promotional emails about new products, exclusive deals, and special offers.",
  },
  {
    icon: Shield,
    title: "Data Protection",
    content: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information. Payment transactions are processed through secure gateways and we never store full credit card details.",
  },
  {
    icon: FileText,
    title: "Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time. You can manage your preferences through your account settings or contact us directly. You may also opt-out of marketing communications by unsubscribing from our emails.",
  },
]

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" {...fadeUp}>
            Privacy Policy
          </motion.h1>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto" {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            Last updated: July 2026
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              className="p-6 rounded-xl bg-card border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg mb-2">{s.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Privacy
