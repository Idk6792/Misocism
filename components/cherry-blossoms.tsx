"use client"

import { useEffect, useRef, useState } from "react"

export function CherryBlossoms() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const animationRef = useRef<number>()
  const petalsRef = useRef<Petal[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Throttle resize events
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        resizeCanvas()
      }, 200)
    }
    window.addEventListener("resize", handleResize)

    // Petal class
    class Petal {
      x: number
      y: number
      size: number
      rotation: number
      xSpeed: number
      ySpeed: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = -20
        this.size = Math.random() * 4 + 2
        this.rotation = Math.random() * 360
        this.xSpeed = Math.random() * 2 - 1
        this.ySpeed = Math.random() * 1 + 1
        this.rotationSpeed = (Math.random() - 0.5) * 2
      }

      update() {
        this.x += this.xSpeed
        this.y += this.ySpeed
        this.rotation += this.rotationSpeed

        if (this.y > canvas.height) {
          this.y = -20
          this.x = Math.random() * canvas.width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)

        // Draw petal
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fill()

        ctx.restore()
      }
    }

    // Create petals - reduce the number for better performance
    const isMobile = window.innerWidth < 768
    const petalCount = isMobile ? 10 : 15 // Reduced from 20/30
    const petals: Petal[] = []
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal())
    }
    petalsRef.current = petals

    // Animation loop with frame limiting for better performance
    let lastTime = 0
    const fps = 20 // Reduced from 30 FPS for better performance
    const interval = 1000 / fps

    const animate = (currentTime: number) => {
      if (!isVisible) return

      const deltaTime = currentTime - lastTime

      if (deltaTime > interval) {
        lastTime = currentTime - (deltaTime % interval)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        petals.forEach((petal) => {
          petal.update()
          petal.draw(ctx)
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Use Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(canvas)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      observer.disconnect()
    }
  }, [])

  // Pause animation when component is not visible
  useEffect(() => {
    if (!isVisible && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    } else if (isVisible && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        let lastTime = 0
        const fps = 20
        const interval = 1000 / fps

        const animate = (currentTime: number) => {
          const deltaTime = currentTime - lastTime

          if (deltaTime > interval) {
            lastTime = currentTime - (deltaTime % interval)

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            petalsRef.current.forEach((petal) => {
              petal.update()
              petal.draw(ctx)
            })
          }

          animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
      }
    }
  }, [isVisible])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
