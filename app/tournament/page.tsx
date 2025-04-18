"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

type Match = {
  id: string
  round: number
  position: number
  team1: string | null
  team2: string | null
  winner: string | null
}

type DragItem = {
  type: "TEAM"
  name: string
}

export default function TournamentPage() {
  const [teams, setTeams] = useState<string[]>([])
  const [newTeam, setNewTeam] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [draggedTeam, setDraggedTeam] = useState<string | null>(null)

  // Initialize tournament bracket
  const initializeBracket = (teamCount: number) => {
    const roundCount = Math.ceil(Math.log2(teamCount))
    const totalMatches = Math.pow(2, roundCount) - 1
    const newMatches: Match[] = []

    for (let round = 0; round < roundCount; round++) {
      const matchesInRound = Math.pow(2, roundCount - round - 1)
      for (let position = 0; position < matchesInRound; position++) {
        newMatches.push({
          id: `${round}-${position}`,
          round,
          position,
          team1: null,
          team2: null,
          winner: null,
        })
      }
    }

    setMatches(newMatches)
  }

  // Add team
  const addTeam = () => {
    if (newTeam && !teams.includes(newTeam)) {
      const updatedTeams = [...teams, newTeam]
      setTeams(updatedTeams)
      setNewTeam("")
      initializeBracket(updatedTeams.length)
    }
  }

  // Handle drag and drop
  const handleDragStart = (team: string) => {
    setDraggedTeam(team)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (matchId: string, slot: "team1" | "team2") => {
    if (!draggedTeam) return

    setMatches(
      matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            [slot]: draggedTeam,
          }
        }
        return match
      }),
    )

    setDraggedTeam(null)
  }

  // Set winner
  const setWinner = (matchId: string, winner: string) => {
    setMatches(
      matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            winner,
          }
        }
        return match
      }),
    )

    // Find next match and update it
    const currentMatch = matches.find((m) => m.id === matchId)
    if (!currentMatch) return

    const nextRound = currentMatch.round + 1
    const nextPosition = Math.floor(currentMatch.position / 2)
    const nextMatch = matches.find((m) => m.round === nextRound && m.position === nextPosition)

    if (nextMatch) {
      const slot = currentMatch.position % 2 === 0 ? "team1" : "team2"
      setMatches(
        matches.map((match) => {
          if (match.id === nextMatch.id) {
            return {
              ...match,
              [slot]: winner,
            }
          }
          return match
        }),
      )
    }
  }

  return (
    <div className="min-h-screen p-8 bg-white/80 dark:bg-black/80">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Tournament Bracket</h1>

        {/* Add Teams */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <Input
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Enter team name"
              className="flex-1"
            />
            <Button onClick={addTeam}>Add Team</Button>
          </div>

          {/* Team List */}
          <div className="mt-4 flex flex-wrap gap-2">
            {teams.map((team) => (
              <div
                key={team}
                draggable
                onDragStart={() => handleDragStart(team)}
                className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded cursor-move"
              >
                {team}
              </div>
            ))}
          </div>
        </Card>

        {/* Tournament Bracket */}
        <div className="flex gap-8 overflow-x-auto pb-8">
          {Array.from(new Set(matches.map((m) => m.round))).map((round) => (
            <div key={round} className="flex flex-col gap-8">
              <h3 className="text-center font-bold">
                {round === 0
                  ? "First Round"
                  : round === matches[matches.length - 1].round
                    ? "Final"
                    : `Round ${round + 1}`}
              </h3>

              {matches
                .filter((m) => m.round === round)
                .map((match) => (
                  <Card key={match.id} className="w-64 p-4">
                    {/* Team 1 */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(match.id, "team1")}
                      className={`p-2 mb-2 border rounded ${
                        match.winner === match.team1 ? "bg-green-100 dark:bg-green-900" : ""
                      }`}
                    >
                      {match.team1 || "Drop team here"}
                      {match.team1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setWinner(match.id, match.team1)}
                          className="ml-2"
                        >
                          <Crown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Team 2 */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(match.id, "team2")}
                      className={`p-2 border rounded ${
                        match.winner === match.team2 ? "bg-green-100 dark:bg-green-900" : ""
                      }`}
                    >
                      {match.team2 || "Drop team here"}
                      {match.team2 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setWinner(match.id, match.team2)}
                          className="ml-2"
                        >
                          <Crown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
