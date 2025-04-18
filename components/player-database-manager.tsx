"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Trash2 } from "lucide-react"

type PreviousPlayer = {
  id: string
  name: string
  totalStomps: number
  matchesPlayed: number
  winRate: number
}

interface PlayerDatabaseManagerProps {
  players: PreviousPlayer[]
  onAddPlayer: (player: Omit<PreviousPlayer, "id">) => void
  onDeletePlayer: (id: string) => void
  onResetDatabase: () => void
}

export function PlayerDatabaseManager({
  players,
  onAddPlayer,
  onDeletePlayer,
  onResetDatabase,
}: PlayerDatabaseManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newPlayer, setNewPlayer] = useState<Omit<PreviousPlayer, "id">>({
    name: "",
    totalStomps: 0,
    matchesPlayed: 0,
    winRate: 0,
  })

  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddPlayer = () => {
    if (!newPlayer.name) return
    onAddPlayer(newPlayer)
    setNewPlayer({
      name: "",
      totalStomps: 0,
      matchesPlayed: 0,
      winRate: 0,
    })
  }

  return (
    <Card className="border-black/10 dark:border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Player Database Manager</span>
          <Button variant="outline" size="sm" onClick={onResetDatabase} className="text-red-500 hover:text-red-700">
            Reset to Defaults
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add New Player Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Add New Player</h3>
            <div className="space-y-3">
              <Input
                placeholder="Player Name"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs mb-1 block">Total Stomps</label>
                  <Input
                    type="number"
                    value={newPlayer.totalStomps || ""}
                    onChange={(e) =>
                      setNewPlayer({
                        ...newPlayer,
                        totalStomps: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block">Matches</label>
                  <Input
                    type="number"
                    value={newPlayer.matchesPlayed || ""}
                    onChange={(e) =>
                      setNewPlayer({
                        ...newPlayer,
                        matchesPlayed: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block">Win Rate %</label>
                  <Input
                    type="number"
                    value={newPlayer.winRate || ""}
                    onChange={(e) =>
                      setNewPlayer({
                        ...newPlayer,
                        winRate: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddPlayer}
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add to Database
              </Button>
            </div>
          </div>

          {/* Current Database */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Current Database</h3>
              <div className="text-sm text-gray-500">{players.length} players</div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              />
            </div>
            <div className="border rounded-lg p-4 bg-white/50 dark:bg-black/50 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-white dark:bg-black/70 border rounded-md shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Total Stomps: {player.totalStomps.toLocaleString()} | Matches: {player.matchesPlayed} | Win
                        Rate: {player.winRate}%
                      </div>
                    </div>
                    <Button
                      onClick={() => onDeletePlayer(player.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {filteredPlayers.length === 0 && <div className="text-center py-4 text-gray-400">No players found</div>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
