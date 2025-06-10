type ParsedDeck = {
    commander: string[]
    deck: string[]
}

export function parsedSimpleManaboxList(input: string): string[] {
    console.log(input)
    return input
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'))
        .map(line => {
            // Match: "1 Card Name (SET) 123"
            const match = line.match(/^\d+\s+(.+?)\s+\([A-Z0-9]+\)\s+\d+$/);
            return match ? match[1].trim() : '';
        })
        .filter(Boolean);
}

export function parsedManaboxList(input: string): ParsedDeck {
    const lines = input.split(/\r?\n/).map(line => line.trim()).filter(Boolean)

    let isCommanderSection = false
    const commander: string[] = []
    const deck: string[] = []

    for (const line of lines) {
        if (line.startsWith('//')) {
            if (line.toUpperCase().includes('COMMANDER')) {
                isCommanderSection = true
            } else {
                isCommanderSection = false
            }
            continue
        }

        // Match: "1 Card Name (SET) 123"
        const match = line.match(/^\d+\s+(.+?)\s+\([A-Z0-9]+\)\s+\d+$/);
    if (match) {
      const cardName = match[1].trim();
      if (isCommanderSection) {
        commander.push(cardName);
      } else {
        deck.push(cardName);
      }
    }
    }
    return { commander, deck }
}