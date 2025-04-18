"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { PlayerDatabase } from "@/types"

interface PlayerDatabaseProps {
  players: PlayerDatabase[]
}

export function PlayerDatabase({ players }: PlayerDatabaseProps) {
  const [search, setSearch] = useState("")

  const filteredPlayers = players.filter((player) => player.username.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Database</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Username</th>
                <th className="text-right py-2">Total Stomps</th>
                <th className="text-right py-2">Matches</th>
                <th className="text-right py-2">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="border-b border-black/5">
                  <td className="py-2">{player.username}</td>
                  <td className="text-right py-2">+{player.totalStomps.toLocaleString()}</td>
                  <td className="text-right py-2">{player.matchesPlayed}</td>
                  <td className="text-right py-2">{player.winRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
