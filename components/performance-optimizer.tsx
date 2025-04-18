"use client"

import { useEffect, useState } from "react"

export function PerformanceOptimizer() {
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false)

  useEffect(() => {
    // Check if device is low-end
    const checkPerformance = () => {
      // Check available memory if possible
      if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true
      }

      // Check hardware concurrency (CPU cores)
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true
      }

      // Check if mobile device (likely to be lower performance)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      return isMobile
    }

    const isLowEnd = checkPerformance()
    setIsLowPerformanceMode(isLowEnd)

    if (isLowEnd) {
      document.body.classList.add("low-performance-mode")
      document.documentElement.style.setProperty("--animation-duration-factor", "2")

      // Disable blur effects on very low-end devices
      if (
        (navigator.deviceMemory && navigator.deviceMemory < 2) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2)
      ) {
        document.documentElement.style.setProperty("--disable-blur", "none")
      }
    }

    // Optimize scroll and resize events
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      document.body.classList.add("scrolling")
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove("scrolling")
      }, 100)
    }

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      document.body.classList.add("resizing")
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        document.body.classList.remove("resizing")
      }, 100)
    }

    // Pause animations when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.classList.add("page-hidden")
      } else {
        document.body.classList.remove("page-hidden")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearTimeout(scrollTimeout)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
