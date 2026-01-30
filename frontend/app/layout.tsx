import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SmartCart AI - AI-Powered Grocery Ordering',
    description: 'Order groceries via WhatsApp, Telegram, or SMS using natural language. Powered by AI.',
    keywords: 'grocery, AI, ordering, WhatsApp, Telegram, supermarket',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
