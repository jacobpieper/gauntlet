export class DeckList {
    public commander: string | null
    public cards: string[]

    constructor(commander: string | null, cards: string[]) {
        this.commander = commander
        this.cards = cards
    }
}