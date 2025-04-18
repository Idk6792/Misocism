"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

type PendingPlayer = {
  id: string
  name: string
  scoreBefore: number
  team: string
}

interface PendingPlayersProps {
  teams: string[]
  pendingPlayers: PendingPlayer[]
  onAddPendingPlayer: (player: PendingPlayer) => void
  onDeletePendingPlayer: (id: string) => void
  onSelectPendingPlayer: (player: PendingPlayer) => void
}

export function PendingPlayers({
  teams,
  pendingPlayers,
  onAddPendingPlayer,
  onDeletePendingPlayer,
  onSelectPendingPlayer,
}: PendingPlayersProps) {
  const [newPlayer, setNewPlayer] = useState<PendingPlayer>({
    id: crypto.randomUUID(),
    name: "",
    scoreBefore: 0,
    team: teams[0] || "Team 1",
  })

  const handleAddPlayer = () => {
    if (!newPlayer.name) return

    onAddPendingPlayer({
      ...newPlayer,
      id: crypto.randomUUID(),
    })

    setNewPlayer({
      id: crypto.randomUUID(),
      name: "",
      scoreBefore: 0,
      team: newPlayer.team,
    })
  }

  return (
    <Card className="border-black/10 dark:border-white/10">
      <CardHeader>
        <CardTitle>Pending Players</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Player Name"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
          />
          <Input
            type="number"
            placeholder="Start Stomps"
            value={newPlayer.scoreBefore || ""}
            onChange={(e) => setNewPlayer({ ...newPlayer, scoreBefore: Number.parseInt(e.target.value) || 0 })}
            className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
          />
          <Select value={newPlayer.team} onValueChange={(value) => setNewPlayer({ ...newPlayer, team: value })}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddPlayer}
            className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Pending
          </Button>
        </div>

        {pendingPlayers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Players Waiting for End Stomps</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left py-2">Name</th>
                    <th className="text-right py-2">Start Stomps</th>
                    <th className="text-left py-2">Team</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPlayers.map((player) => (
                    <tr key={player.id} className="border-b border-black/5 dark:border-white/5">
                      <td className="py-2">{player.name}</td>
                      <td className="text-right py-2">{player.scoreBefore.toLocaleString()}</td>
                      <td className="py-2">{player.team}</td>
                      <td className="py-2 flex justify-end gap-1">
                        <Button
                          onClick={() => onSelectPendingPlayer(player)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => onDeletePendingPlayer(player.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
