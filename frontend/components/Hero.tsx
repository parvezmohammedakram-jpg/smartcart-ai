'use client'

import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            🛒 Smart Grocery Ordering
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
                            Order Groceries
                            <span className="block text-primary-600">
                                Just by Chatting
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            No app downloads. No complex menus. Just chat naturally via WhatsApp, Telegram, or SMS.
                            Our AI understands what you need and gets it delivered.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition transform hover:scale-105">
                                Try Demo Below ↓
                            </button>
                            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition">
                                Watch Video
                            </button>
                        </div>
                        <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Free trial</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                                    💬
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">Fresh Mart</div>
                                    <div className="text-sm text-gray-500">Online now</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                                        I need 2kg tomatoes and 1 liter milk
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                                        Got it! 🛒<br />
                                        • Fresh Tomatoes - 2kg (₹80)<br />
                                        • Full Cream Milk - 1L (₹60)<br /><br />
                                        Total: ₹140<br />
                                        Add to cart?
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                                        Yes, checkout
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                                        ✅ Order confirmed!<br />
                                        Delivery in 30 mins<br />
                                        Order #SC20260130
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Removed decorative blobs for cleaner look */}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
