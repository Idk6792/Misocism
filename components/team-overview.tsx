"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"

interface Player {
  id: string
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
  achievements?: string[]
}

interface Penalty {
  id: string
  description: string
  amount: number
  team: string
}

interface TeamOverviewProps {
  team: string
  players: Player[]
  penalties: Penalty[]
  total: {
    scoreBefore: number
    scoreAfter: number
    penalties: number
    stompsGained: number
  }
  onPlayerClick?: (player: Player) => void
}

export function TeamOverview({ team, players, penalties, total, onPlayerClick }: TeamOverviewProps) {
  // Sort players by stomps gained
  const sortedPlayers = [...players].sort((a, b) => b.scoreAfter - b.scoreBefore - (a.scoreAfter - a.scoreBefore))

  // Get top 3 players
  const top3Players = sortedPlayers.slice(0, 3)

  // Prepare chart data
  const chartData = sortedPlayers.map((player) => ({
    name: player.name,
    stomps: player.scoreAfter - player.scoreBefore,
    before: player.scoreBefore,
    after: player.scoreAfter,
  }))

  // Prepare comparison data for the two teams
  const comparisonData = [
    {
      name: "Stomps",
      gained: total.stompsGained,
      penalties: total.penalties,
    },
  ]

  return (
    <Card className="overflow-hidden border-black/10">
      <CardHeader className="relative bg-gradient-to-b from-black/5 to-transparent">
        <CardTitle className="text-xl font-bold">{team}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Top 3 Players */}
        <div className="space-y-4">
          <h3 className="font-semibold">Top Performers</h3>
          <div className="grid gap-3">
            {top3Players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 bg-black/5 rounded-lg ${onPlayerClick ? "cursor-pointer hover:bg-black/10 dark:hover:bg-white/10" : ""}`}
                onClick={() => onPlayerClick && onPlayerClick(player)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                          ? "bg-gray-400 text-white"
                          : "bg-amber-700 text-white"
                    }
                  `}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="font-bold">+{(player.scoreAfter - player.scoreBefore).toLocaleString()}</span>
              </motion.div>
            ))}
            {top3Players.length === 0 && <div className="text-center py-4 text-gray-500">No players added yet</div>}
          </div>
        </div>

        {/* Team Stats */}
        <div className="space-y-2">
          <h3 className="font-semibold">Team Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-black/5 rounded-lg">
              <div className="text-sm text-gray-600">Total Stomps Gained</div>
              <div className="text-lg font-bold">+{(total.scoreAfter - total.scoreBefore).toLocaleString()}</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600">Penalties</div>
              <div className="text-lg font-bold text-red-600">-{total.penalties.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Final Score</div>
              <div className="text-lg font-bold text-green-600">+{total.stompsGained.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        {chartData.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Player Performance</h3>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stomps" name="Stomps Gained" fill="#000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Stomps vs Penalties */}
        {(total.stompsGained > 0 || total.penalties > 0) && (
          <div className="space-y-2">
            <h3 className="font-semibold">Stomps vs Penalties</h3>
            <div className="h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gained" name="Stomps Gained" fill="#4ade80" />
                  <Bar dataKey="penalties" name="Penalties" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Penalties */}
        {penalties.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Penalties</h3>
            <div className="space-y-2">
              {penalties.map((penalty) => (
                <div key={penalty.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm">{penalty.description}</span>
                  <span className="text-sm font-bold text-red-600">-{penalty.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
