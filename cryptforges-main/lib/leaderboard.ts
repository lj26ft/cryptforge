import type { Player } from "./types"

export interface LeaderboardEntry {
  playerId: string
  username: string
  wins: number
  losses: number
  rank: number
}

export function calculateLeaderboard(players: Player[]): LeaderboardEntry[] {
  const leaderboard = players.map((player) => ({
    playerId: player.id,
    username: player.username,
    wins: player.stats.wins,
    losses: player.stats.losses,
    rank: 0,
  }))

  leaderboard.sort((a, b) => {
    const aWinRate = a.wins / (a.wins + a.losses)
    const bWinRate = b.wins / (b.wins + b.losses)
    return bWinRate - aWinRate
  })

  return leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))
}

export function updateLeaderboard(
  leaderboard: LeaderboardEntry[],
  player: Player,
  gameResult: "win" | "loss",
): LeaderboardEntry[] {
  const playerEntry = leaderboard.find((entry) => entry.playerId === player.id)

  if (playerEntry) {
    playerEntry[gameResult === "win" ? "wins" : "losses"]++
  } else {
    leaderboard.push({
      playerId: player.id,
      username: player.username,
      wins: gameResult === "win" ? 1 : 0,
      losses: gameResult === "loss" ? 1 : 0,
      rank: leaderboard.length + 1,
    })
  }

  return calculateLeaderboard(
    leaderboard.map((entry) => ({
      ...entry,
      stats: { wins: entry.wins, losses: entry.losses },
    })) as Player[],
  )
}

