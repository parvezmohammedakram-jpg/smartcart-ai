/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    },
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
}

module.exports = nextConfig
