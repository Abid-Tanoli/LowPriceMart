import { motion } from "framer-motion"
import { Package, Truck, Shield, HeadphonesIcon, Award, Users } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
}

const stats = [
  { icon: Package, label: "Products Delivered", value: "50,000+" },
  { icon: Users, label: "Happy Customers", value: "10,000+" },
  { icon: Award, label: "Years in Business", value: "5+" },
  { icon: Truck, label: "Cities Covered", value: "100+" },
]

const values = [
  {
    icon: Shield,
    title: "Trust & Security",
    desc: "Your safety is our priority. Every transaction is encrypted and your data is protected.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "We partner with reliable couriers across Pakistan to ensure your order reaches you on time.",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer First",
    desc: "Our support team is available 24/7 to help with any questions or concerns.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    desc: "We handpick every product to ensure it meets our quality standards before listing.",
  },
]

const About = () => {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" {...fadeUp}>
            About <span className="text-primary">LowPriceMart</span>
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto" {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            Your trusted destination for quality products at unbeatable prices.
            We're on a mission to make online shopping accessible, affordable, and
            enjoyable for everyone in Pakistan.
          </motion.p>
        </div>
      </section>

      <section className="py-16 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-card border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-heading font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl font-heading font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              What drives us every day to serve you better.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="p-6 rounded-xl bg-card border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
