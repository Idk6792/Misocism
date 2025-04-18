"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trophy, Star, Award } from "lucide-react"

interface PlayerCardProps {
  name: string
  scoreBefore: number
  scoreAfter: number
  team: string
  achievements?: string[]
}

export function PlayerCard({ name, scoreBefore, scoreAfter, team, achievements = [] }: PlayerCardProps) {
  const improvement = scoreAfter - scoreBefore
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-black/10">
        <CardHeader className="relative p-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
          <div className="relative p-4 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-gray-600">{team}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Before</p>
              <p className="text-lg font-bold">{scoreBefore.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">After</p>
              <p className="text-lg font-bold">{scoreAfter.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gained</p>
              <p className="text-lg font-bold">{improvement.toLocaleString()}</p>
            </div>
          </div>
          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-black/5 rounded-full text-xs"
                >
                  {i % 3 === 0 && <Trophy className="w-3 h-3" />}
                  {i % 3 === 1 && <Star className="w-3 h-3" />}
                  {i % 3 === 2 && <Award className="w-3 h-3" />}
                  {achievement}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
