"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

type Player = {
  id: string
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
  achievements?: string[]
}

interface EditableTeamTableProps {
  team: string
  players: Player[]
  onUpdatePlayer: (player: Player) => void
  onDeletePlayer: (id: string) => void
  onAddPlayer: (player: Omit<Player, "id" | "achievements">) => void
}

export function EditableTeamTable({
  team,
  players,
  onUpdatePlayer,
  onDeletePlayer,
  onAddPlayer,
}: EditableTeamTableProps) {
  const [editingCell, setEditingCell] = useState<{
    playerId: string
    field: "name" | "scoreBefore" | "scoreAfter" | null
  }>({ playerId: "", field: null })

  const [newPlayer, setNewPlayer] = useState<{
    name: string
    scoreBefore: number
    scoreAfter: number
  }>({
    name: "",
    scoreBefore: 0,
    scoreAfter: 0,
  })

  // Calculate totals
  const totals = {
    scoreBefore: players.reduce((sum, player) => sum + player.scoreBefore, 0),
    scoreAfter: players.reduce((sum, player) => sum + player.scoreAfter, 0),
    stompsGained: players.reduce((sum, player) => sum + (player.scoreAfter - player.scoreBefore), 0),
  }

  const handleCellClick = (playerId: string, field: "name" | "scoreBefore" | "scoreAfter") => {
    setEditingCell({ playerId, field })
  }

  const handleCellChange = (playerId: string, field: "name" | "scoreBefore" | "scoreAfter", value: string | number) => {
    const player = players.find((p) => p.id === playerId)
    if (!player) return

    const updatedPlayer = { ...player }

    if (field === "name") {
      updatedPlayer.name = value as string
    } else if (field === "scoreBefore") {
      updatedPlayer.scoreBefore = Number(value) || 0
    } else if (field === "scoreAfter") {
      updatedPlayer.scoreAfter = Number(value) || 0
    }

    onUpdatePlayer(updatedPlayer)
  }

  const handleCellBlur = () => {
    setEditingCell({ playerId: "", field: null })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellBlur()
    }
  }

  const handleAddPlayer = () => {
    if (!newPlayer.name) return

    onAddPlayer({
      name: newPlayer.name,
      scoreBefore: newPlayer.scoreBefore,
      scoreAfter: newPlayer.scoreAfter,
      team,
    })

    // Reset the form
    setNewPlayer({
      name: "",
      scoreBefore: 0,
      scoreAfter: 0,
    })
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="text-left py-2">Name</th>
              <th className="text-right py-2">Start Stomps</th>
              <th className="text-right py-2">End Stomps</th>
              <th className="text-right py-2">Stomps Gained</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">
                  {editingCell.playerId === player.id && editingCell.field === "name" ? (
                    <Input
                      value={player.name}
                      onChange={(e) => handleCellChange(player.id, "name", e.target.value)}
                      onBlur={handleCellBlur}
                      onKeyDown={handleKeyDown}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="px-2 py-1 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => handleCellClick(player.id, "name")}
                    >
                      {player.name}
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {editingCell.playerId === player.id && editingCell.field === "scoreBefore" ? (
                    <Input
                      type="number"
                      value={player.scoreBefore}
                      onChange={(e) => handleCellChange(player.id, "scoreBefore", e.target.value)}
                      onBlur={handleCellBlur}
                      onKeyDown={handleKeyDown}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="px-2 py-1 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-right"
                      onClick={() => handleCellClick(player.id, "scoreBefore")}
                    >
                      {player.scoreBefore.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {editingCell.playerId === player.id && editingCell.field === "scoreAfter" ? (
                    <Input
                      type="number"
                      value={player.scoreAfter}
                      onChange={(e) => handleCellChange(player.id, "scoreAfter", e.target.value)}
                      onBlur={handleCellBlur}
                      onKeyDown={handleKeyDown}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="px-2 py-1 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-right"
                      onClick={() => handleCellClick(player.id, "scoreAfter")}
                    >
                      {player.scoreAfter.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="text-right py-2 font-bold">
                  +{(player.scoreAfter - player.scoreBefore).toLocaleString()}
                </td>
                <td>
                  <Button onClick={() => onDeletePlayer(player.id)} variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {/* Add new player row */}
            <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
              <td className="py-2">
                <Input
                  placeholder="New player name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  placeholder="Start stomps"
                  value={newPlayer.scoreBefore || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, scoreBefore: Number(e.target.value) || 0 })}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  placeholder="End stomps"
                  value={newPlayer.scoreAfter || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, scoreAfter: Number(e.target.value) || 0 })}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                />
              </td>
              <td className="text-right py-2 font-bold">
                +{(newPlayer.scoreAfter - newPlayer.scoreBefore).toLocaleString()}
              </td>
              <td>
                <Button onClick={handleAddPlayer} variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </td>
            </tr>

            {/* Totals row */}
            <tr className="border-b border-black/10 dark:border-white/10 font-bold">
              <td className="py-2">TOTAL</td>
              <td className="text-right py-2">{totals.scoreBefore.toLocaleString()}</td>
              <td className="text-right py-2">{totals.scoreAfter.toLocaleString()}</td>
              <td className="text-right py-2">+{totals.stompsGained.toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Click on any cell to edit directly. Press Enter or click outside to save.</p>
      </div>
    </div>
  )
}
