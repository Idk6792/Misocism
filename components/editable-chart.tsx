"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

type ChartPlayer = {
  id: string
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
}

interface EditableChartProps {
  teams: string[]
  onAddPlayer: (player: Omit<ChartPlayer, "id">) => void
  onSaveAllPlayers: (players: Array<Omit<ChartPlayer, "id">>) => void
}

// Configuration for preset player counts
const PRESET_CONFIGS = {
  "10v10": 10,
  "5v5": 5,
  "3v3": 3,
  "2v2": 2,
}

export function EditableChart({ teams, onAddPlayer, onSaveAllPlayers }: EditableChartProps) {
  // State for team players
  const [teamPlayers, setTeamPlayers] = useState<Record<string, ChartPlayer[]>>(() =>
    teams.reduce(
      (acc, team) => {
        // Start with 5 empty player slots by default
        acc[team] = Array.from({ length: 5 }, (_, index) => ({
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
      return {
        scoreBefore: players.reduce((sum, player) => sum + player.scoreBefore, 0),
        scoreAfter: players.reduce((sum, player) => sum + player.scoreAfter, 0),
        stompsGained: players.reduce((sum, player) => sum + (player.scoreAfter - player.scoreBefore), 0),
      }
    },
    [teamPlayers],
  )

  // Calculate overall totals
  const overallTotals = useMemo(() => {
    const overall = {
      scoreBefore: 0,
      scoreAfter: 0,
      stompsGained: 0,
    }

    teams.forEach((team) => {
      const teamTotal = calculateTeamTotals(team)
      overall.scoreBefore += teamTotal.scoreBefore
      overall.scoreAfter += teamTotal.scoreAfter
      overall.stompsGained += teamTotal.stompsGained
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

  // Save all players to the main counter
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

    // Send all players to the parent component at once
    onSaveAllPlayers(allPlayers)
  }

  return (
    <Card className="border-black/10 dark:border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stomp Chart</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveAllPlayers}
          className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border-green-200 dark:border-green-800"
        >
          <Save className="h-4 w-4 mr-1" /> Save to Counter
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration Buttons */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <p>Click a button to set the number of players per team:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESET_CONFIGS).map(([label, count]) => (
              <Button key={label} variant="outline" onClick={() => setPlayerCount(count)} className="flex-1">
                {label}
              </Button>
            ))}
            <Button variant="outline" onClick={() => setPlayerCount(1)} className="flex-1">
              Custom
            </Button>
          </div>
        </div>

        {/* Team Sections */}
        <div className="space-y-8">
          {teams.map((team) => {
            const teamTotal = calculateTeamTotals(team)

            return (
              <div key={team} className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-xl font-bold">{team}</h3>
                  <Button variant="outline" size="sm" onClick={() => handleAddRow(team)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Player
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-black/5 dark:bg-white/5">
                        <th className="p-2 text-left">Player Name</th>
                        <th className="p-2 text-right">Start Stomps</th>
                        <th className="p-2 text-right">End Stomps</th>
                        <th className="p-2 text-right">Gained</th>
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
                              className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                              placeholder="Player name"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={player.scoreBefore || ""}
                              onChange={(e) => handleInputChange(team, player.id, "scoreBefore", e.target.value)}
                              className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={player.scoreAfter || ""}
                              onChange={(e) => handleInputChange(team, player.id, "scoreAfter", e.target.value)}
                              className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2 text-right font-bold">
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
                      <tr className="bg-black/5 dark:bg-white/5 font-bold">
                        <td className="p-2">TEAM TOTALS</td>
                        <td className="p-2 text-right">{teamTotal.scoreBefore.toLocaleString()}</td>
                        <td className="p-2 text-right">{teamTotal.scoreAfter.toLocaleString()}</td>
                        <td className="p-2 text-right">{teamTotal.stompsGained.toLocaleString()}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>

        {/* Overall Totals */}
        <div className="mt-6 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Overall Totals</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Start Stomps</p>
              <p className="text-lg font-bold">{overallTotals.scoreBefore.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total End Stomps</p>
              <p className="text-lg font-bold">{overallTotals.scoreAfter.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Stomps Gained</p>
              <p className="text-lg font-bold">{overallTotals.stompsGained.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click a preset button (10v10, 5v5, etc.) to quickly set up teams</li>
            <li>Enter player names and stomp values directly in each team's table</li>
            <li>Gained stomps are calculated automatically</li>
            <li>Click "Save to Counter" to save all players to the main counter</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
