<script lang="ts">
    import { onMount } from 'svelte';

    let decks: string[] = Array(6).fill('')
    let duplicates: string[][] | null = null;

    const basicLands = [
        'plains',
        'island',
        'swamp',
        'mountain',
        'forest',
        'wastes',
        'snow-covered plains',
        'snow-covered island',
        'snow-covered swamp',
        'snow-covered mountain',
        'snow-covered forest',
        'snow-covered wastes',
    ];

    function isBasicLand(card: string): boolean {
        return basicLands.includes(card.toLowerCase());
    }

    function validateDecks(): void {
        const cardMap: Map<string, { count:number; decks: number[] }> = new Map();
        const duplicatesFound: string[][] = Array(6).fill(null).map(() => []);

        decks.forEach((deck, index) => {
            const lines = deck.split('\n')
            let inCardSection = false

            lines.forEach((lineRaw) => {
                const line = lineRaw.trim()
                
                // Skip empty lines
                if (!line) return;

                // Skip metadata
                if (!inCardSection) {
                    if (line === 'Deck') {
                        inCardSection = true;
                    }
                    return;
                }

                const match = line.match(/^\d+\s+(.+)$/i)
                if (!match) return;

                const count = parseInt(match[1]) || 1;
                const card = match ? match[1].trim().toLowerCase() : line.toLowerCase();
            
                if (isBasicLand(card)) return;

                const currentCard = cardMap.get(card) ?? { count: 0, decks: [] }
                currentCard.count += count;
                currentCard.decks.push(index);
                cardMap.set(card, currentCard);
            })
        });

        cardMap.forEach((info, card) => {
            if (info.count > 1) {
                info.decks.forEach(i => {
                    if (!duplicatesFound[i].includes(card)) {
                        duplicatesFound[i].push(card);
                    }
                })
            }
        })

        duplicates = duplicatesFound
}
</script>

<h1>Commander Gauntlet Legality Checker</h1>
<div class="page">

    {#each decks as deck, index}
    <div class="deck-section">
        <h2>Deck {index + 1}</h2>
        <textarea 
        name="deck input" 
        id={(index + 1).toString()}
        bind:value={decks[index]}
        rows="10"
        placeholder="Paste deck list here, in MTGA format."
        ></textarea>
    </div>
    {/each}
    
</div>
<button on:click={validateDecks}>Check Duplicates</button>

{#if duplicates}
    <h2>Duplicate Cards Detected</h2>
    {#each duplicates as cards, index}
        {#if cards.length}
            <h3>Deck {index + 1}</h3>
            <ul>
                {#each cards as card}
                    <li>{card}</li>
                {/each}
            </ul>
        {:else}
            <p>Deck {index + 1} has no duplicates</p>
        {/if}
    {/each}
{/if}

<style>
    .page {
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;
        overflow-x: auto;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }

</style>