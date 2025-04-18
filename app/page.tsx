"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedFlower } from "@/components/animated-flower"
import { FlowerButton } from "@/components/flower-button"

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden">
      {/* Main Title with Animated Flower */}
      <div className="relative mb-16 mt-16">
        <motion.h1
          className="text-7xl font-bold text-white text-stroke-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          MISOCISM
        </motion.h1>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <AnimatedFlower />
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl font-bold mb-8 text-white text-stroke-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Features
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/stomp-counter">
            <FlowerButton>Stomp Counter</FlowerButton>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="w-full text-center py-4 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <p>
          <a
            href="https://discord.gg/misocist"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            Discord: misocist
          </a>
        </p>
      </motion.footer>
    </div>
  )
}
