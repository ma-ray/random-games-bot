// This is a class for a deck of cards

class CardDeck {
    constructor() {
        // generate a deck of cards
        // array of cards
        let deck = [];
        let card;
        const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        const numbers = ['Ace', '2', '3', '4', '5', '6',  '7', '8', '9', '10', 'Jack', 'Queen','King'];

        for (let s = 0; s < suits.length; s++) {
            for(let n = 0; n < numbers.length; n++) {
                let color = 'Black';
                if (['Diamonds', 'Hearts'].includes(suits[s])) {
                    color = 'Red';
                }

                card = {num:    numbers[n],
                        suite:  suits[s],
                        color:  color};
                deck.push(card);
            }
        }
        this.deck = deck;
    }

    // Shuffle the deck of cards
    shuffleDeck() {
        for (let i = 0; i < 1000; i++) {
            let card1 = Math.floor(Math.random() * this.deck.length);
            let card2 = Math.floor(Math.random() * this.deck.length);
            let temp = this.deck[card1];

            this.deck[card1] = this.deck[card2];
            this.deck[card2] = temp;
        }
    }

    // Draw a card from the top of the deck
    // TODO: maybe do nullish coalscing when the deck is empty
    draw() {
        if (!this.isEmpty()) {
            return this.deck.shift();
        }
        return null;
    }

    // Place a card on top of the deck
    placeOnTop(newCard) {
        this.deck.unshift(newCard);
    }

    // Place a card at the bottom of the deck
    placeAtEnd() {
        this.deck.push(newCard);
    }

    // Place a card in a random order
    placeRandom(newCard) {
        let length = this.deck.length;
        let randomIndex = Math.floor(Math.random() *  length);
        
        this.deck.splice(randomIndex, 0, newCard);
    }

    // Returns true if the deck is empty
    isEmpty() {
        return  this.deck.length ===  0;
    }

    numCards() {
        return this.deck.length;
    }
}

module.exports = CardDeck;