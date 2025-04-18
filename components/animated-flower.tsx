"use client"

import { motion } from "framer-motion"

export function AnimatedFlower() {
  return (
    <div className="relative w-16 h-16">
      {/* Flower petals */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 bg-white rounded-full border border-black"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "0 0",
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            x: Math.cos((i * Math.PI) / 4) * 20,
            y: Math.sin((i * Math.PI) / 4) * 20,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            delay: 0.1 * i,
            repeat: 0,
            repeatType: "reverse",
            ease: "easeOut",
          }}
        />
      ))}

      {/* Flower center */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-8 h-8 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.8,
          duration: 0.5,
          ease: "easeOut",
        }}
      />
    </div>
  )
}
