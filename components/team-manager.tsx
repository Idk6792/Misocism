"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit, Check, X } from "lucide-react"

interface TeamManagerProps {
  teams: string[]
  onAddTeam: (team: string) => void
  onDeleteTeam: (team: string) => void
  onRenameTeam: (oldName: string, newName: string) => void
}

export function TeamManager({ teams, onAddTeam, onDeleteTeam, onRenameTeam }: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState("")
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return

    // Check if team name already exists
    if (teams.includes(newTeamName)) {
      alert("A team with this name already exists")
      return
    }

    onAddTeam(newTeamName)
    setNewTeamName("")
  }

  const startEditing = (teamName: string) => {
    setEditingTeam(teamName)
    setEditedName(teamName)
  }

  const cancelEditing = () => {
    setEditingTeam(null)
    setEditedName("")
  }

  const saveTeamName = (oldName: string) => {
    if (!editedName.trim()) {
      cancelEditing()
      return
    }

    // Check if new name already exists and it's not the same as the old name
    if (teams.includes(editedName) && editedName !== oldName) {
      alert("A team with this name already exists")
      return
    }

    onRenameTeam(oldName, editedName)
    setEditingTeam(null)
  }

  return (
    <div className="space-y-6">
      <Card className="border border-black">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Add New Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white"
            />
            <Button onClick={handleAddTeam} className="whitespace-nowrap border border-black">
              <Plus className="h-4 w-4 mr-2" /> Add Team
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Current Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-4">
            {teams.length === 0 ? (
              <div className="text-center py-4 text-black dark:text-white">No teams added yet</div>
            ) : (
              <div className="grid gap-2">
                {teams.map((team) => (
                  <div
                    key={team}
                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/50 rounded-md border border-black dark:border-white"
                  >
                    {editingTeam === team ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveTeamName(team)}
                          className="h-8 w-8 text-green-500"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditing} className="h-8 w-8 text-red-500">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-black dark:text-white">{team}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditing(team)}
                            className="h-8 w-8 text-blue-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeleteTeam(team)}
                            className="h-8 w-8 text-red-500"
                            disabled={teams.length <= 2} // Prevent deleting if only 2 teams remain
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-black dark:text-white">
            <p>Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Add teams to customize your match setup</li>
              <li>You must have at least 2 teams at all times</li>
              <li>Team names must be unique</li>
              <li>Changes to team names will update all related players and penalties</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
