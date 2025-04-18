"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function Animated3DTitle({ children }: { children: React.ReactNode }) {
  const titleRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const requestRef = useRef<number>()

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    const handleMouseEnter = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      // Reset position smoothly
      title.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isHovering) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      }
    }

    // Only apply 3D effect on hover to improve performance
    title.addEventListener("mouseenter", handleMouseEnter)
    title.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      title.removeEventListener("mouseenter", handleMouseEnter)
      title.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousemove", handleMouseMove)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovering])

  // Use requestAnimationFrame for smoother animation
  useEffect(() => {
    if (!isHovering) return

    const title = titleRef.current
    if (!title) return

    const animate = () => {
      const rect = title.getBoundingClientRect()
      const x = mousePosition.x - rect.left
      const y = mousePosition.y - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovering, mousePosition])

  return (
    <motion.div
      ref={titleRef}
      className="inline-block text-white font-bold text-shadow-3d transition-transform duration-200 ease-out"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
