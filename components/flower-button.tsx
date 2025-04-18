"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface FlowerButtonProps {
  children: ReactNode
  onClick?: () => void
}

export function FlowerButton({ children, onClick }: FlowerButtonProps) {
  return (
    <motion.div className="relative inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        className="px-8 py-6 text-xl font-bold text-white border-2 border-black bg-black hover:bg-gray-900 rounded-full shadow-lg"
        onClick={onClick}
      >
        <span className="mr-2">{children}</span>
        <span className="inline-block">
          <motion.span
            className="inline-block"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            🌸
          </motion.span>
        </span>
      </Button>
    </motion.div>
  )
}
