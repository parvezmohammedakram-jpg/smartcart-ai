'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface Message {
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function ChatDemo() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "👋 Hi! I'm your AI shopping assistant. Try asking me for groceries like 'I need 2kg tomatoes and 1L milk'",
            sender: 'bot',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages([...messages, userMessage])
        setInput('')
        setIsTyping(true)

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const botResponse = generateResponse(input)
            const botMessage: Message = {
                id: messages.length + 2,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
        }, 1500)
    }

    const generateResponse = (userInput: string): string => {
        const input = userInput.toLowerCase()

        // Simple pattern matching for demo
        if (input.includes('tomato') || input.includes('milk') || input.includes('rice')) {
            const items = []
            if (input.includes('tomato')) items.push('• Fresh Tomatoes - 2kg (₹80)')
            if (input.includes('milk')) items.push('• Full Cream Milk - 1L (₹60)')
            if (input.includes('rice')) items.push('• Basmati Rice - 5kg (₹900)')

            const total = items.length * 70 // Simple calculation
            return `Got it! 🛒\n\n${items.join('\n')}\n\nTotal: ₹${total}\n\nWould you like to checkout?`
        } else if (input.includes('yes') || input.includes('checkout')) {
            return `✅ Order confirmed!\n\nOrder #SC${Date.now().toString().slice(-8)}\nDelivery: 30-45 mins\nPayment: Cash on Delivery\n\nTrack your order anytime by typing "track"`
        } else if (input.includes('track')) {
            return `📦 Your order is being prepared!\n\nStatus: Packing\nEstimated delivery: 25 mins\nDelivery person: Rahul (⭐ 4.8)`
        } else if (input.includes('help')) {
            return `I can help you:\n\n• Order groceries (just tell me what you need)\n• Track orders\n• View cart\n• Check delivery status\n\nTry: "I need 2kg tomatoes and 1L milk"`
        } else {
            return `I can help you order groceries! Try:\n\n"I need 2kg tomatoes"\n"Add 1 liter milk"\n"Show my cart"\n\nWhat would you like to order?`
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
            {/* Chat Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                    🛒
                </div>
                <div>
                    <div className="font-semibold text-lg">SmartCart AI Assistant</div>
                    <div className="text-sm text-primary-100">Always online • Instant responses</div>
                </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${message.sender === 'user'
                                    ? 'bg-primary-600 text-white rounded-tr-sm'
                                    : 'bg-white text-gray-800 rounded-tl-sm shadow-md'
                                    }`}
                            >
                                <div className="whitespace-pre-line">{message.text}</div>
                                <div
                                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                                        }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-md">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message... (try: I need 2kg tomatoes)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                    💡 Try: "I need milk and bread" or "Track my order"
                </div>
            </div>
        </motion.div>
    )
}
