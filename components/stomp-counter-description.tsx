"use client"

import { motion } from "framer-motion"

export function StompCounterDescription() {
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Welcome to the Stomp Counter!</h3>
        <p className="text-lg text-black dark:text-white">
          Track and analyze player performance in your games with this powerful tool.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-black shadow-md">
        <h4 className="text-xl font-bold mb-4 text-black dark:text-white">How It Works:</h4>
        <ol className="list-decimal pl-6 space-y-4 text-black dark:text-white">
          <li>
            <strong>Manage Teams:</strong> Add, rename, or delete teams in the Manage Teams tab.
          </li>
          <li>
            <strong>Select a Team Size:</strong> Choose from preset team sizes (10v10, 5v5, 3v3, 2v2, 1v1) or create a
            custom setup in the Edit Stats tab.
          </li>
          <li>
            <strong>Enter Player Data:</strong> Add player names and their stomp counts (before and after the match).
          </li>
          <li>
            <strong>Add Penalties:</strong> Apply penalties to teams for rule violations or other deductions in the
            Penalties tab.
          </li>
          <li>
            <strong>Save to Counter:</strong> Save your data to view team statistics and top performers.
          </li>
          <li>
            <strong>Analyze Results:</strong> See which team won and who the top performers were in the Overview tab.
          </li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-lg border border-black shadow-md">
        <h4 className="text-xl font-bold mb-4 text-black dark:text-white">Features:</h4>
        <ul className="list-disc pl-6 space-y-2 text-black dark:text-white">
          <li>Track player performance across multiple teams</li>
          <li>Calculate stomp gains automatically</li>
          <li>Apply penalties with descriptions and point deductions</li>
          <li>View team statistics and top performers</li>
          <li>Save match data for future reference</li>
          <li>Easy-to-use interface with preset team configurations</li>
        </ul>
      </div>

      <div className="text-center mt-8">
        <p className="text-lg font-bold text-black dark:text-white">Ready to get started?</p>
        <p className="text-black dark:text-white">
          Head over to the "Manage Teams" tab to customize your teams, then use "Edit Stats" to create your first match!
        </p>
      </div>
    </motion.div>
  )
}
