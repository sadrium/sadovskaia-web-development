class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        this.deck = [];
        const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ value, suit });
            }
        }
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard() {
        return this.deck.pop();
    }
}

class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    getPoints() {
        let points = 0;
        let aces = 0;
        for (let card of this.cards) {
            if (card.value === 'A') {
                aces += 1;
                points += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                points += 10;
            } else {
                points += parseInt(card.value);
            }
        }
        while (points > 21 && aces > 0) {
            points -= 10;
            aces -= 1;
        }
        return points;
    }

    isBlackjack() {
        return this.cards.length === 2 && this.getPoints() === 21;
    }

    isBusted() {
        return this.getPoints() > 21;
    }
}

class BlackjackGame {
    constructor() {
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
    }

    startGame() {
        this.deck.reset();
        this.deck.shuffle();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();

        this.playerHand.addCard(this.deck.drawCard());
        this.playerHand.addCard(this.deck.drawCard());
        this.dealerHand.addCard(this.deck.drawCard());
        this.dealerHand.addCard(this.deck.drawCard());

        this.showHands();
        if (this.playerHand.isBlackjack()) {
            console.log("Player has Blackjack! Player wins!");
            return;
        }
        if (this.dealerHand.isBlackjack()) {
            console.log("Dealer has Blackjack! Dealer wins!");
            return;
        }

        this.playerTurn();
    }

    showHands() {
        console.log("Player's hand:", this.playerHand.cards, "Points:", this.playerHand.getPoints());
        console.log("Dealer's hand:", this.dealerHand.cards[0]);
    }

    playerTurn() {
        let playerDone = false;
        while (!playerDone) {
            const choice = prompt("Hit (h) or Stand (s)?").toLowerCase();
            if (choice === 'h') {
                this.playerHand.addCard(this.deck.drawCard());
                console.log("Player's hand:", this.playerHand.cards, "Points:", this.playerHand.getPoints());
                if (this.playerHand.isBusted()) {
                    console.log("Player busts! Dealer wins!");
                    return;
                }
            } else if (choice === 's') {
                playerDone = true;
            } else {
                console.log("Invalid choice. Please enter 'h' for Hit or 's' for Stand.");
            }
        }
        this.dealerTurn();
    }

    dealerTurn() {
        console.log("Dealer's full hand:", this.dealerHand.cards, "Points:", this.dealerHand.getPoints());
        while (this.dealerHand.getPoints() < 17) {
            this.dealerHand.addCard(this.deck.drawCard());
            console.log("Dealer's hand:", this.dealerHand.cards, "Points:", this.dealerHand.getPoints());
            if (this.dealerHand.isBusted()) {
                console.log("Dealer busts! Player wins!");
                return;
            }
        }
        this.determineWinner();
    }

    determineWinner()
