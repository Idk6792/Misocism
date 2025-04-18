"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function OpeningAnimation() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Reduce animation time to improve perceived performance
    const timer = setTimeout(() => {
      setShow(false)
    }, 2500) // Reduced from 4000ms
    return () => clearTimeout(timer)
  }, [])

  // Skip animation if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    if (hasVisited) {
      setShow(false)
    } else {
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 1,
            }}
            className="relative"
          >
            {/* Simplified cat animation for better performance */}
            <motion.div
              className="w-64 h-64 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Cat body */}
              <motion.div
                className="absolute w-48 h-40 bg-gray-300 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: 1, duration: 1.5 }}
              />

              {/* Cat head */}
              <motion.div className="absolute w-32 h-28 bg-gray-300 rounded-full left-1/4 top-1/4 transform -translate-x-1/4 -translate-y-1/4">
                {/* Cat ears */}
                <motion.div className="absolute w-0 h-0 border-l-[15px] border-l-transparent border-b-[30px] border-b-gray-300 border-r-[15px] border-r-transparent -top-6 left-6 transform rotate-[-20deg]" />
                <motion.div className="absolute w-0 h-0 border-l-[15px] border-l-transparent border-b-[30px] border-b-gray-300 border-r-[15px] border-r-transparent -top-6 right-6 transform rotate-[20deg]" />

                {/* Cat eyes */}
                <motion.div
                  className="absolute w-4 h-8 bg-black rounded-full left-8 top-10"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: 1, duration: 2 }}
                />
                <motion.div
                  className="absolute w-4 h-8 bg-black rounded-full right-8 top-10"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: 1, duration: 2 }}
                />

                {/* Cat nose */}
                <motion.div className="absolute w-4 h-3 bg-pink-300 rounded-full left-1/2 top-16 transform -translate-x-1/2" />

                {/* Cat mouth */}
                <motion.div className="absolute w-6 h-3 border-b-2 border-black left-1/2 top-[4.5rem] transform -translate-x-1/2" />
              </motion.div>

              {/* Reduced decorative elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: Math.cos((i * Math.PI) / 3) * 120,
                    y: Math.sin((i * Math.PI) / 3) * 120,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.1,
                  }}
                >
                  {["✨", "⭐", "❤️"][i]}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
