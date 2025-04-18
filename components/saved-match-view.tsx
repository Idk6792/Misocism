"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { FlowerButton } from "@/components/flower-button"

type Player = {
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
}

type Penalty = {
  description: string
  amount: number
  team: string
}

interface SavedMatchViewProps {
  players: Player[]
  penalties: Penalty[]
  teams: string[]
  onEdit: () => void
}

export function SavedMatchView({ players, penalties, teams, onEdit }: SavedMatchViewProps) {
  // Group players by team
  const playersByTeam = teams.reduce(
    (acc, team) => {
      acc[team] = players.filter((player) => player.team === team)
      return acc
    },
    {} as Record<string, Player[]>,
  )

  // Group penalties by team
  const penaltiesByTeam = teams.reduce(
    (acc, team) => {
      acc[team] = penalties.filter((penalty) => penalty.team === team)
      return acc
    },
    {} as Record<string, Penalty[]>,
  )

  // Calculate team totals
  const teamTotals = teams.reduce(
    (acc, team) => {
      const teamPlayers = playersByTeam[team] || []
      const teamPenalties = penaltiesByTeam[team] || []
      const penaltyTotal = teamPenalties.reduce((sum, p) => sum + p.amount, 0)
      const stompsGained = teamPlayers.reduce((sum, p) => sum + (p.scoreAfter - p.scoreBefore), 0)

      acc[team] = {
        scoreBefore: teamPlayers.reduce((sum, p) => sum + p.scoreBefore, 0),
        scoreAfter: teamPlayers.reduce((sum, p) => sum + p.scoreAfter, 0),
        stompsGained: stompsGained,
        penalties: penaltyTotal,
        netGain: stompsGained - penaltyTotal,
      }
      return acc
    },
    {} as Record<
      string,
      {
        scoreBefore: number
        scoreAfter: number
        stompsGained: number
        penalties: number
        netGain: number
      }
    >,
  )

  // Determine the winning team based on net gain
  const getWinningTeam = () => {
    if (teams.length === 0) return null

    const teamStats = teams.map((team) => ({
      team,
      total: teamTotals[team]?.netGain || 0,
    }))

    const sortedTeams = [...teamStats].sort((a, b) => b.total - a.total)

    if (sortedTeams.length === 0) return null
    if (sortedTeams.length === 1) return sortedTeams[0]
    if (sortedTeams.length > 1 && sortedTeams[0].total === sortedTeams[1].total) {
      return { team: "Tie", total: sortedTeams[0].total }
    }

    return sortedTeams[0]
  }

  const winner = getWinningTeam()

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Winner Banner */}
      {winner && (
        <Card className="bg-white border border-yellow-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {winner.team === "Tie" ? "It's a Tie!" : `${winner.team} Wins!`}
              </h2>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Button */}
      <div className="flex justify-end">
        <FlowerButton onClick={onEdit}>Edit Match</FlowerButton>
      </div>

      {/* Team Sections */}
      <div className="space-y-8">
        {teams.map((team) => {
          const teamPlayers = playersByTeam[team] || []
          const teamPenalties = penaltiesByTeam[team] || []
          const teamTotal = teamTotals[team] || {
            scoreBefore: 0,
            scoreAfter: 0,
            stompsGained: 0,
            penalties: 0,
            netGain: 0,
          }

          return (
            <Card key={team} className="border border-black shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-black dark:text-white">{team}</CardTitle>
                  <div className="text-sm text-black dark:text-white">{teamPlayers.length} players</div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-black dark:text-white">Player Name</th>
                        <th className="p-2 text-right text-black dark:text-white">Start Stomps</th>
                        <th className="p-2 text-right text-black dark:text-white">End Stomps</th>
                        <th className="p-2 text-right text-black dark:text-white">Gained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPlayers.map((player, index) => (
                        <tr key={`${player.name}-${index}`} className="border-b border-black/5">
                          <td className="p-2 font-bold text-black dark:text-white">{player.name}</td>
                          <td className="p-2 text-right text-black dark:text-white">
                            {player.scoreBefore.toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-black dark:text-white">
                            {player.scoreAfter.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-bold text-black dark:text-white">
                            +{(player.scoreAfter - player.scoreBefore).toLocaleString()}
                          </td>
                        </tr>
                      ))}

                      {/* Team Totals row */}
                      <tr className="bg-gray-100 font-bold">
                        <td className="p-2 text-black dark:text-white">TEAM TOTALS</td>
                        <td className="p-2 text-right text-black dark:text-white">
                          {teamTotal.scoreBefore.toLocaleString()}
                        </td>
                        <td className="p-2 text-right text-black dark:text-white">
                          {teamTotal.scoreAfter.toLocaleString()}
                        </td>
                        <td className="p-2 text-right text-black dark:text-white">
                          {teamTotal.stompsGained.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Penalties Section */}
                {teamPenalties.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2 text-black dark:text-white">Penalties</h3>
                    <div className="space-y-2">
                      {teamPenalties.map((penalty, index) => (
                        <div
                          key={`${penalty.description}-${index}`}
                          className="flex justify-between items-center p-2 bg-red-50 rounded"
                        >
                          <span className="text-black dark:text-white">{penalty.description}</span>
                          <span className="font-bold text-red-600">-{penalty.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-2 bg-red-100 rounded font-bold">
                        <span className="text-black dark:text-white">Total Penalties</span>
                        <span className="text-red-600">-{teamTotal.penalties.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Summary */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-black">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-black dark:text-white">Stomps Gained</p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        +{teamTotal.stompsGained.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">Penalties</p>
                      <p className="text-lg font-bold text-red-600">-{teamTotal.penalties.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Net Gain</p>
                      <p className="text-lg font-bold text-green-600">+{teamTotal.netGain.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Overall Totals */}
      <Card className="border border-black shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black dark:text-white">Overall Totals</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-100 rounded-lg border border-black">
              <p className="text-sm text-black dark:text-white">Total Stomps Gained</p>
              <p className="text-lg font-bold text-black dark:text-white">
                +
                {Object.values(teamTotals)
                  .reduce((sum, t) => sum + t.stompsGained, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Total Penalties</p>
              <p className="text-lg font-bold text-red-600">
                -
                {Object.values(teamTotals)
                  .reduce((sum, t) => sum + t.penalties, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">Net Gain</p>
              <p className="text-lg font-bold text-green-600">
                +
                {Object.values(teamTotals)
                  .reduce((sum, t) => sum + t.netGain, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
