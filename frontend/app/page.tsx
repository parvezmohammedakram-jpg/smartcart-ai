'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatDemo from '@/components/ChatDemo'
import Features from '@/components/Features'
import Hero from '@/components/Hero'

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🛒</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                SmartCart AI
                            </span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
                            <a href="#demo" className="text-gray-700 hover:text-blue-600 transition">Demo</a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
                        </div>
                        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <Features />

            {/* Chat Demo Section */}
            <section id="demo" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            Try It Now
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience AI-powered grocery ordering. Just chat naturally!
                        </p>
                    </motion.div>
                    <ChatDemo />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-primary-600">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                            <div className="text-primary-100">Stores</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
                            <div className="text-primary-100">Users</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">99.5%</div>
                            <div className="text-primary-100">Uptime</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                            <div className="text-primary-100">Available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-2xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Transform Your Store?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of stores using AI-powered ordering
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition">
                                Start Free Trial
                            </button>
                            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition">
                                Schedule Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">🛒</span>
                            </div>
                            <span className="text-xl font-bold">SmartCart AI</span>
                        </div>
                        <p className="text-gray-400">
                            AI-powered grocery ordering for the modern age
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Features</a></li>
                            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">About</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition">Status</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; 2026 SmartCart AI. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
