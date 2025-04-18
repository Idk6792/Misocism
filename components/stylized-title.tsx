"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function StylizedTitle() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Track mouse position for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calculate parallax effect
  const calcParallax = (depth = 10) => {
    const x = (mousePosition.x - windowSize.width / 2) / depth
    const y = (mousePosition.y - windowSize.height / 2) / depth
    return { x, y }
  }

  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="relative w-full max-w-3xl mx-auto h-32 md:h-40 overflow-hidden rounded-lg">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-800 dark:to-red-900">
        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white dark:bg-white/70 opacity-70"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=')]"></div>

      {/* Main title with parallax effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: calcParallax(20).x,
          y: calcParallax(20).y,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Andrew and Shadow
        </h1>
      </motion.div>

      {/* Subtitle with different parallax depth */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20"
        style={{
          x: calcParallax(10).x,
          y: calcParallax(10).y,
        }}
      >
        <h2 className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Stomp Counter
        </h2>
      </motion.div>

      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-red-500/0 animate-pulse"></div>

      {/* Border */}
      <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
    </div>
  )
}
