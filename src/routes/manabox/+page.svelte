<script lang="ts">
	import type { DeckList } from "$lib/deckList";
	import { RawDeckList } from "$lib/rawDeckList";
	import { validator } from "$lib/validator";

    let rawDeckLists: string[] = Array(6).fill('');
    let deckLists: DeckList[] = []
    let duplicates: any
    //string[][] | null = null;

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

    function validateDecks(): void {
        console.log('Validating decks:', rawDeckLists);
        rawDeckLists.forEach((deck, index) => {
            const rawDeckList = new RawDeckList(deck, 'manabox')
            //console.log(`Deck ${index + 1} raw list:`, rawDeckList);

            const deckList = rawDeckList.parse()
            //console.log(`Deck ${index + 1} parsed list:`, deckList);
            deckLists.push(deckList);
        })
        console.log(deckLists)

        duplicates = findDuplicates();
        console.log('Duplicates found:', duplicates);


    }

    function findDuplicates(): Record<string, number[]> {
        const cardMap = new Map<string, number[]>()

        deckLists.forEach((deck, index) => {
            const seenInDeck = new Set<string>()
                deck.cards.forEach(cardRaw => {
                    const card = cardRaw.toLowerCase();
                    if (isBasicLand(card)) return; // Skip basic lands

                    if (seenInDeck.has(card)) return; // only count once per deck
                        seenInDeck.add(card);

                        if (!cardMap.has(card)) {
                            cardMap.set(card, []);
                     }
                    cardMap.get(card)!.push(index);
                })
        })

        console.log('Card map:', cardMap);

        const duplicates: Record<string, number[]> = {};

        for (const [card, indices] of cardMap.entries()) {
            if (indices.length > 1) { // Only keep cards that appear in multiple decks
                duplicates[card] = indices;
            }
        }
        return duplicates;
    }

    function isBasicLand(card: string): boolean {
        return basicLands.includes(card.toLowerCase());
    }
</script>


<h1>Commander Gauntlet Legality Checker (Manabox)</h1>
<div class="page">

    {#each rawDeckLists as deck, index}
    <div class="deck-section">
        <h2>Deck {index + 1}</h2>
        <textarea 
        name="deck input" 
        id={(index + 1).toString()}
        bind:value={rawDeckLists[index]}
        rows="10"
        placeholder="Paste deck list here, in MTGA format."
        ></textarea>
    </div>
    {/each}
    
</div>
<button on:click={validateDecks}>Check Duplicates</button>

{#if duplicates && Object.keys(duplicates).length}
    <h2>Duplicate Cards Detected</h2>
    {#each Object.entries(duplicates) as [card, decks], index}
            <div>
                <p><strong>'{card}'</strong> found in decks: {decks.map(i => i + 1).join(', ')}</p>
            </div>
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