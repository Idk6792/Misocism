"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

type Penalty = {
  id: string
  description: string
  amount: number
  team: string
}

interface PenaltiesManagerProps {
  teams: string[]
  penalties: Penalty[]
  onAddPenalty: (penalty: Penalty) => void
  onDeletePenalty: (id: string) => void
}

export function PenaltiesManager({ teams, penalties, onAddPenalty, onDeletePenalty }: PenaltiesManagerProps) {
  const [newPenalty, setNewPenalty] = useState<Penalty>({
    id: crypto.randomUUID(),
    description: "",
    amount: 0,
    team: teams[0] || "Team 1",
  })

  const handleAddPenalty = () => {
    if (!newPenalty.description || newPenalty.amount <= 0) {
      alert("Please enter a description and a positive amount for the penalty")
      return
    }

    onAddPenalty({
      ...newPenalty,
      id: crypto.randomUUID(),
    })

    setNewPenalty({
      id: crypto.randomUUID(),
      description: "",
      amount: 0,
      team: newPenalty.team,
    })
  }

  // Group penalties by team
  const penaltiesByTeam = teams.reduce(
    (acc, team) => {
      acc[team] = penalties.filter((penalty) => penalty.team === team)
      return acc
    },
    {} as Record<string, Penalty[]>,
  )

  // Calculate total penalties per team
  const teamTotals = teams.reduce(
    (acc, team) => {
      const teamPenalties = penaltiesByTeam[team] || []
      acc[team] = teamPenalties.reduce((sum, p) => sum + p.amount, 0)
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <Card className="border border-black">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Add New Penalty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Penalty Description"
              value={newPenalty.description}
              onChange={(e) => setNewPenalty({ ...newPenalty, description: e.target.value })}
              className="border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newPenalty.amount || ""}
              onChange={(e) => setNewPenalty({ ...newPenalty, amount: Number.parseInt(e.target.value) || 0 })}
              className="border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
            <Select value={newPenalty.team} onValueChange={(value) => setNewPenalty({ ...newPenalty, team: value })}>
              <SelectTrigger className="border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
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
            <Button onClick={handleAddPenalty} className="border border-black">
              <Plus className="mr-2 h-4 w-4" /> Add Penalty
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Current Penalties</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Penalties List */}
          {teams.map((team) => {
            const teamPenalties = penaltiesByTeam[team] || []
            if (teamPenalties.length === 0) return null

            return (
              <div key={team} className="mt-4">
                <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                  {team} Penalties (Total: -{teamTotals[team].toLocaleString()})
                </h3>
                <div className="space-y-2">
                  {teamPenalties.map((penalty) => (
                    <div
                      key={penalty.id}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-black dark:text-white">{penalty.description}</div>
                        <div className="text-sm text-red-600 dark:text-red-400">-{penalty.amount.toLocaleString()}</div>
                      </div>
                      <Button
                        onClick={() => onDeletePenalty(penalty.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {penalties.length === 0 && (
            <div className="text-center py-4 text-black dark:text-white">No penalties added yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
