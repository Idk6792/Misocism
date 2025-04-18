"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function GothicTitle() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative w-full h-64 mb-12 overflow-hidden">
      {/* Gothic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brokenbard.gif-PjttlEAaAAXuZT2JwYwAP7MKjLx1EE.jpeg")',
          filter: "contrast(1.2) brightness(0.8)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Animated Elements */}
      <div className="absolute inset-0">
        {/* Floating Cats */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`cat-${i}`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.1, 1],
              x: mousePosition.x * (i + 1) * 0.5,
              y: mousePosition.y * (i + 1) * 0.5,
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 10}%`,
            }}
          >
            <span className="text-white text-2xl">🐱</span>
          </motion.div>
        ))}

        {/* Stars */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Title Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white mb-4"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          Andrew and Shadow
        </motion.h1>
        <motion.h2
          className="text-2xl md:text-3xl text-white/90"
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
          }}
        >
          Stomp Counter
        </motion.h2>
      </div>
    </div>
  )
}
