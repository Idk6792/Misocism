"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Trophy } from "lucide-react"
import type { Match } from "@/types"

interface MatchHistoryProps {
  matches: Match[]
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent 10v10 Matches</h2>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-black/5"
              onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {match.team1.name} vs {match.team2.name}
                  </CardTitle>
                  <div className="text-sm text-gray-600">{new Date(match.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Winner: {match.winner}</div>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expandedMatch === match.id ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {expandedMatch === match.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      {[match.team1, match.team2].map((team) => (
                        <div key={team.id} className="space-y-3">
                          <h3 className="font-semibold">{team.name}</h3>
                          <div className="space-y-2">
                            {team.players.map((player) => (
                              <div key={player.id} className="flex justify-between items-center p-2 bg-black/5 rounded">
                                <span>{player.username}</span>
                                <span className="font-bold">+{player.stompsGained.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          {team.penalties.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium mb-1">Penalties</h4>
                              {team.penalties.map((penalty) => (
                                <div
                                  key={penalty.id}
                                  className="flex justify-between items-center p-2 bg-red-50 rounded text-sm"
                                >
                                  <span>{penalty.description}</span>
                                  <span className="text-red-600 font-medium">-{penalty.amount.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  )
}
