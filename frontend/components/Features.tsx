'use client'

import { motion } from 'framer-motion'

const features = [
    {
        icon: '🤖',
        title: 'AI-Powered Understanding',
        description: 'Natural language processing with Claude AI understands your orders perfectly, even with typos.',
    },
    {
        icon: '📱',
        title: 'Multi-Platform',
        description: 'Order via WhatsApp, Telegram, or SMS. No app downloads required.',
    },
    {
        icon: '⚡',
        title: 'Instant Ordering',
        description: 'Place orders in seconds. Our AI processes requests in under 2 seconds.',
    },
    {
        icon: '📊',
        title: 'Smart Analytics',
        description: 'Store owners get real-time insights on sales, inventory, and customer behavior.',
    },
    {
        icon: '🔔',
        title: 'Auto Stock Alerts',
        description: 'Never run out of popular items. Get low-stock notifications automatically.',
    },
    {
        icon: '💳',
        title: 'Multiple Payments',
        description: 'UPI, Cards, Wallets, or Cash on Delivery. Your choice.',
    },
]

export default function Features() {
    return (
        <section id="features" className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Why Choose SmartCart AI?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to run a modern, automated grocery store
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
