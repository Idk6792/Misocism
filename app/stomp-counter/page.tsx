"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StompCounterDescription } from "@/components/stomp-counter-description"
import { StompChart } from "@/components/stomp-chart"
import { SavedMatchView } from "@/components/saved-match-view"
import { FlowerButton } from "@/components/flower-button"
import { AnimatedFlower } from "@/components/animated-flower"
import { PenaltiesManager } from "@/components/penalties-manager"
import { TeamManager } from "@/components/team-manager"

type Player = {
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
}

type Penalty = {
  description: string
  amount: number
  team: string
}

export default function StompCounterPage() {
  const [activeTab, setActiveTab] = useState("description")
  const [savedPlayers, setSavedPlayers] = useState<Player[]>([])
  const [savedPenalties, setSavedPenalties] = useState<Penalty[]>([])
  const [isEditingMatch, setIsEditingMatch] = useState(false)
  const [teams, setTeams] = useState(["Team 1", "Team 2"])
  const [penalties, setPenalties] = useState<Array<Penalty & { id: string }>>([])

  // Function to handle saving all players and penalties from the chart
  const handleSaveAllPlayers = (chartPlayers: Player[], chartPenalties: Penalty[]) => {
    setSavedPlayers(chartPlayers)
    setSavedPenalties(chartPenalties)
    setActiveTab("overview")
    setIsEditingMatch(false)
  }

  // Function to start editing the saved match
  const handleEditMatch = () => {
    setIsEditingMatch(true)
    setActiveTab("chart")
  }

  // Team management functions
  const handleAddTeam = (team: string) => {
    if (teams.includes(team)) return
    setTeams([...teams, team])
  }

  const handleDeleteTeam = (team: string) => {
    if (teams.length <= 2) return // Maintain at least 2 teams
    setTeams(teams.filter((t) => t !== team))

    // Remove players and penalties for deleted team
    setSavedPlayers(savedPlayers.filter((p) => p.team !== team))
    setSavedPenalties(savedPenalties.filter((p) => p.team !== team))
    setPenalties(penalties.filter((p) => p.team !== team))
  }

  const handleRenameTeam = (oldName: string, newName: string) => {
    if (teams.includes(newName) && oldName !== newName) return
    setTeams(teams.map((t) => (t === oldName ? newName : t)))

    // Update team name for players and penalties
    setSavedPlayers(savedPlayers.map((p) => (p.team === oldName ? { ...p, team: newName } : p)))
    setSavedPenalties(savedPenalties.map((p) => (p.team === oldName ? { ...p, team: newName } : p)))
    setPenalties(penalties.map((p) => (p.team === oldName ? { ...p, team: newName } : p)))
  }

  // Penalties management functions
  const handleAddPenalty = (penalty: Penalty & { id: string }) => {
    setPenalties([...penalties, penalty])
  }

  const handleDeletePenalty = (id: string) => {
    setPenalties(penalties.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <h1 className="text-5xl font-bold text-white text-stroke-black mb-2 inline-block">MISOCISM</h1>
          </Link>
          <div className="flex justify-center mb-4">
            <AnimatedFlower />
          </div>
          <h2 className="text-3xl font-bold text-white text-stroke-black">Stomp Counter</h2>
        </motion.div>

        {/* Main Content */}
        <Card className="border border-black shadow-lg bg-white dark:bg-black">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-black dark:text-white">Stomp Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-5 mb-8 bg-gray-200 dark:bg-gray-800">
                <TabsTrigger
                  value="description"
                  className="text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="teams"
                  className="text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                >
                  Manage Teams
                </TabsTrigger>
                <TabsTrigger
                  value="penalties"
                  className="text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                >
                  Penalties
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                >
                  Edit Stats
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <StompCounterDescription />
              </TabsContent>

              <TabsContent value="teams">
                <TeamManager
                  teams={teams}
                  onAddTeam={handleAddTeam}
                  onDeleteTeam={handleDeleteTeam}
                  onRenameTeam={handleRenameTeam}
                />
              </TabsContent>

              <TabsContent value="penalties">
                <PenaltiesManager
                  teams={teams}
                  penalties={penalties}
                  onAddPenalty={handleAddPenalty}
                  onDeletePenalty={handleDeletePenalty}
                />
              </TabsContent>

              <TabsContent value="chart">
                <StompChart teams={teams} penalties={penalties} onSaveAllPlayers={handleSaveAllPlayers} />
              </TabsContent>

              <TabsContent value="overview">
                {savedPlayers.length > 0 && !isEditingMatch ? (
                  <SavedMatchView
                    players={savedPlayers}
                    penalties={savedPenalties}
                    teams={teams}
                    onEdit={handleEditMatch}
                  />
                ) : (
                  <div className="text-center py-12 text-black dark:text-white">
                    <p className="mb-4">No saved match data yet. Create a match in the Edit Stats tab!</p>
                    <FlowerButton onClick={() => setActiveTab("chart")}>Create Match</FlowerButton>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 py-4 text-white">
          <a
            href="https://discord.gg/misocist"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            Discord: misocist
          </a>
        </div>
      </div>
    </div>
  )
}
