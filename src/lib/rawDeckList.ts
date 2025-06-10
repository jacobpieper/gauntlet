import { DeckList } from "./deckList"

export class RawDeckList {
    public data: string
    public format: 'manabox' | 'MTGA'

    constructor(data: string, format: 'manabox' | 'MTGA') {
        this.data = data
        this.format = format
    }

    public parse(): DeckList {
        if (this.format === 'manabox') {
            return this.parseManaboxList();
        } else {
            throw new Error(`Unsupported format: ${this.format}`);
        }
    }

    private parseManaboxList(): DeckList {
        // Simple parsing logic ignoreing comments and empty lines
        //console.log('Attempting to parse Manabox list:', this.data);
        const cards = this.data
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//'))
            .map(line => {
                // Match: "1 Card Name (SET) 123"
                const match = line.match(/^\d+\s+(.+?)\s+\([A-Z0-9]+\)\s+\d+$/);
                return match ? match[1].trim() : '';
            })
            .filter(Boolean); 
        
        return new DeckList(null, cards)
    }
}