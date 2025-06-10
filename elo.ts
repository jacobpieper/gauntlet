const K_FACTOR = 50
const DIVISOR = 300

class Player {
    name: string
    rating: number

    constructor(name: string, rating: number) {
        this.name = name
        this.rating = rating
    }

    calculateExpectedScore(opponent: Player): number {
        return 1 / (1 + Math.pow(10, (opponent.rating - this.rating) / DIVISOR))
    }

    calculateWin(opponents: Player[]): number {
        const expectedScores = opponents.map(opponent => opponent.calculateExpectedScore(this));
        const expected = 1 - (expectedScores.reduce((sum, score) => sum + score, 0) / opponents.length);
        return Math.round(K_FACTOR * (1 - expected));
    }

    calculateLoss(winner: Player, totalLosers: number): number {
        const expectedScore = this.calculateExpectedScore(winner);
        return Math.round((-K_FACTOR * expectedScore) / totalLosers);
    }
}

function updateFourPlayerElo(players: Player[], winnerName: string): Player[] {
  if (players.length !== 4) throw new Error("Exactly four players required.");

  const winner = players.find(p => p.name === winnerName);
  if (!winner) throw new Error("Winner must be one of the players.");

  const losers = players.filter(p => p !== winner);

  const winnerChange = winner.calculateWin(losers);
  const loserChanges = losers.map(loser => loser.calculateLoss(winner, losers.length));

  return players.map(player => {
    if (player === winner) {
      return new Player(player.name, player.rating + winnerChange);
    } else {
      const idx = losers.indexOf(player);
      return new Player(player.name, player.rating + loserChanges[idx]);
    }
  });
}




const players = [
    new Player("Alex", 220),
    new Player("Bob", 200),
    new Player("Charlie", 200),
    new Player("Diana", 200)
]

const updated = updateFourPlayerElo(players, "Bob")
console.log(updated);
