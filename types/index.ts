export type Player = {
  id: string
  username: string
  team: string
  stompsGained: number
  matchId?: string
}

export type Team = {
  id: string
  name: string
  players: Player[]
  penalties: Penalty[]
}

export type Penalty = {
  id: string
  description: string
  amount: number
  teamId: string
}

export type Match = {
  id: string
  date: string
  team1: Team
  team2: Team
  winner: string
}

export type PlayerDatabase = {
  id: string
  username: string
  totalStomps: number
  matchesPlayed: number
  winRate: number
}
