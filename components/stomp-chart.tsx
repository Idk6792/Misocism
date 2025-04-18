"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { FlowerButton } from "@/components/flower-button"

type ChartPlayer = {
  id: string
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
}

type Penalty = {
  id: string
  description: string
  amount: number
  team: string
}

interface StompChartProps {
  teams: string[]
  penalties: Penalty[]
  onSaveAllPlayers: (players: Array<Omit<ChartPlayer, "id">>, penalties: Array<Omit<Penalty, "id">>) => void
}

// Configuration for preset player counts
const PRESET_CONFIGS = {
  "10v10": 10,
  "5v5": 5,
  "3v3": 3,
  "2v2": 2,
  "1v1": 1,
}

export function StompChart({ teams, penalties, onSaveAllPlayers }: StompChartProps) {
  // State for team players
  const [teamPlayers, setTeamPlayers] = useState<Record<string, ChartPlayer[]>>(() =>
    teams.reduce(
      (acc, team) => {
        // Start with custom mode (1 player per team)
        acc[team] = Array.from({ length: 1 }, (_, index) => ({
          id: crypto.randomUUID(),
          name: `Player ${index + 1}`,
          scoreBefore: 0,
          scoreAfter: 0,
          team,
        }))
        return acc
      },
      {} as Record<string, ChartPlayer[]>,
    ),
  )

  // Initialize team players with the selected preset configuration
  const setPlayerCount = useCallback(
    (playerCount: number) => {
      const newTeamPlayers = teams.reduce(
        (acc, team) => {
          // Create the specified number of empty player slots
          acc[team] = Array.from({ length: playerCount }, (_, index) => ({
            id: crypto.randomUUID(),
            name: `Player ${index + 1}`,
            scoreBefore: 0,
            scoreAfter: 0,
            team,
          }))
          return acc
        },
        {} as Record<string, ChartPlayer[]>,
      )
      setTeamPlayers(newTeamPlayers)
    },
    [teams],
  )

  // Calculate team totals
  const calculateTeamTotals = useCallback(
    (team: string) => {
      const players = teamPlayers[team] || []
      const teamPenalties = penalties.filter((p) => p.team === team)
      const penaltyTotal = teamPenalties.reduce((sum, p) => sum + p.amount, 0)

      return {
        scoreBefore: players.reduce((sum, player) => sum + player.scoreBefore, 0),
        scoreAfter: players.reduce((sum, player) => sum + player.scoreAfter, 0),
        stompsGained: players.reduce((sum, player) => sum + (player.scoreAfter - player.scoreBefore), 0),
        penalties: penaltyTotal,
        netGain: players.reduce((sum, player) => sum + (player.scoreAfter - player.scoreBefore), 0) - penaltyTotal,
      }
    },
    [teamPlayers, penalties],
  )

  // Calculate overall totals
  const overallTotals = useMemo(() => {
    const overall = {
      scoreBefore: 0,
      scoreAfter: 0,
      stompsGained: 0,
      penalties: 0,
      netGain: 0,
    }

    teams.forEach((team) => {
      const teamTotal = calculateTeamTotals(team)
      overall.scoreBefore += teamTotal.scoreBefore
      overall.scoreAfter += teamTotal.scoreAfter
      overall.stompsGained += teamTotal.stompsGained
      overall.penalties += teamTotal.penalties
      overall.netGain += teamTotal.netGain
    })

    return overall
  }, [teams, calculateTeamTotals])

  // Add a row to a team
  const handleAddRow = (team: string) => {
    setTeamPlayers((prev) => ({
      ...prev,
      [team]: [
        ...prev[team],
        {
          id: crypto.randomUUID(),
          name: `Player ${prev[team].length + 1}`,
          scoreBefore: 0,
          scoreAfter: 0,
          team,
        },
      ],
    }))
  }

  // Delete a row from a team
  const handleDeleteRow = (team: string, id: string) => {
    setTeamPlayers((prev) => ({
      ...prev,
      [team]: prev[team].filter((player) => player.id !== id),
    }))
  }

  // Handle input changes
  const handleInputChange = (team: string, id: string, field: keyof ChartPlayer, value: string | number) => {
    setTeamPlayers((prev) => ({
      ...prev,
      [team]: prev[team].map((player) => {
        if (player.id === id) {
          return {
            ...player,
            [field]: field === "name" ? value : Number(value) || 0,
          }
        }
        return player
      }),
    }))
  }

  // Save all players and penalties to the main counter
  const handleSaveAllPlayers = () => {
    // Collect all players from all teams
    const allPlayers: Omit<ChartPlayer, "id">[] = []

    teams.forEach((team) => {
      // Include all players with names (even if they have 0 values)
      const validPlayers = teamPlayers[team].filter((player) => player.name.trim())

      validPlayers.forEach((player) => {
        allPlayers.push({
          name: player.name,
          scoreBefore: player.scoreBefore,
          scoreAfter: player.scoreAfter,
          team: player.team,
        })
      })
    })

    if (allPlayers.length === 0) {
      alert("No players to save. Please make sure players have names.")
      return
    }

    // Prepare penalties without IDs
    const allPenalties: Omit<Penalty, "id">[] = penalties.map((p) => ({
      description: p.description,
      amount: p.amount,
      team: p.team,
    }))

    // Send all players and penalties to the parent component at once
    onSaveAllPlayers(allPlayers, allPenalties)
  }

  return (
    <div className="space-y-8">
      {/* Preset Team Buttons */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center text-black dark:text-white">Preset Teams</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(PRESET_CONFIGS).map(([label, count]) => (
            <Button
              key={label}
              variant="outline"
              onClick={() => setPlayerCount(count)}
              className="border-2 border-black py-6 font-bold hover:bg-gray-200 dark:hover:bg-gray-800 bg-white dark:bg-black text-black dark:text-white"
            >
              <span className="mr-2">{label}</span>
              <motion.span
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
            </Button>
          ))}
        </div>
      </div>

      {/* Team Sections */}
      <div className="space-y-8">
        {teams.map((team) => {
          const teamTotal = calculateTeamTotals(team)

          return (
            <Card key={team} className="border-2 border-black shadow-md bg-white dark:bg-black">
              <CardHeader className="bg-black text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">{team}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddRow(team)}
                    className="border-2 border-white text-white hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-800">
                        <th className="p-2 text-left text-black dark:text-white">Player Name</th>
                        <th className="p-2 text-right text-black dark:text-white">Start Stomps</th>
                        <th className="p-2 text-right text-black dark:text-white">End Stomps</th>
                        <th className="p-2 text-right text-black dark:text-white">Gained</th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPlayers[team].map((player) => (
                        <tr key={player.id} className="border-b border-black/5 dark:border-white/5">
                          <td className="p-2">
                            <Input
                              value={player.name}
                              onChange={(e) => handleInputChange(team, player.id, "name", e.target.value)}
                              className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white"
                              placeholder="Player name"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={player.scoreBefore || ""}
                              onChange={(e) => handleInputChange(team, player.id, "scoreBefore", e.target.value)}
                              className="bg-white dark:bg-black text-right border border-black dark:border-white text-black dark:text-white"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={player.scoreAfter || ""}
                              onChange={(e) => handleInputChange(team, player.id, "scoreAfter", e.target.value)}
                              className="bg-white dark:bg-black text-right border border-black dark:border-white text-black dark:text-white"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2 text-right font-bold text-black dark:text-white">
                            {(player.scoreAfter - player.scoreBefore).toLocaleString()}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRow(team, player.id)}
                              className="h-8 w-8 text-red-500"
                              disabled={teamPlayers[team].length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {/* Team Totals row */}
                      <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
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
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Team Summary with Penalties */}
                {teamTotal.penalties > 0 && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg border-2 border-black">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm text-black">Stomps Gained</p>
                        <p className="text-lg font-bold text-black">+{teamTotal.stompsGained.toLocaleString()}</p>
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
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Overall Totals */}
      <Card className="border-2 border-black shadow-md bg-white dark:bg-black">
        <CardHeader className="bg-black text-white">
          <CardTitle className="text-xl font-bold">Overall Totals</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-black">
              <p className="text-sm text-black dark:text-white">Total Stomps Gained</p>
              <p className="text-lg font-bold text-black dark:text-white">
                +{overallTotals.stompsGained.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Total Penalties</p>
              <p className="text-lg font-bold text-red-600">-{overallTotals.penalties.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">Net Gain</p>
              <p className="text-lg font-bold text-green-600">+{overallTotals.netGain.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <FlowerButton onClick={handleSaveAllPlayers}>Save to Counter</FlowerButton>
      </div>

      <div className="mt-4 text-sm text-black dark:text-white">
        <p>Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click a preset button (10v10, 5v5, etc.) to quickly set up teams</li>
          <li>Enter player names and stomp values directly in each team's table</li>
          <li>Add penalties in the Penalties tab</li>
          <li>Gained stomps and net gains are calculated automatically</li>
          <li>Click "Save to Counter" to save all players and penalties to the main counter</li>
        </ul>
      </div>
    </div>
  )
}
