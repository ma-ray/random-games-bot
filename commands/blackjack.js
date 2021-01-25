const CardDeck = require('./CardDeck.js');
const Discord = require('discord.js');

// aces is worth 1 or 11
// face is worth 10

// dealer gets one face up and one face down
// player gets 2 cards face up

// dealer must hit until the total is 17

module.exports = {
    name: 'blackjack',
    description: 'Starts the blackjack game.',
    async execute(message) {
        const deck = new CardDeck();
        const reactionList  = ['⬆', '⏹'];

        console.log('Initialized Blackjack');

        deck.shuffleDeck();

        // Draw cards for the dealer
        let dealerHand = [deck.draw(), deck.draw()];
        console.log('Dealer hand');
        console.log(dealerHand[0]);
        console.log(dealerHand[1]);

        //Draw cards for the player
        let playerHand = [deck.draw(), deck.draw()];
        console.log('Player hand');
        console.log(playerHand[0]);
        console.log(playerHand[1]);

        // Variables for the embed
		// let color = GREEN;
		let attempts = 6;
		let title = 'Blackjack';
        let field = 'Attempts: ' + attempts;
        let playerContent = 'The total is ' + sumHand(playerHand);
        let dealerContent = `${dealerHand[0].num} of ${dealerHand[1].suite}\n *One Face Down*`;

		let embed = new Discord.MessageEmbed()
			.setTitle(title)
            .addField("Dealer's Hand:", dealerContent, false)
            .addField(`${message.author.tag}'s Hand:`, displayHand(playerHand), false)
            .setDescription(playerContent)
			.setTimestamp()

        let msg = await message.channel.send(embed);

        // add the reactions
        for (let i = 0; i < reactionList.length; i++) {
            msg.react(reactionList[i]);
        }

        const filter = (reaction, user) => {
            return reactionList.includes(reaction.emoji.name) && user.id === message.author.id;
        };
        
        const collector = msg.createReactionCollector(filter, { time: 300000 });
        
        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

            if (reaction.emoji.name === '⬆') {
                console.log('Hit');
                playerHand.push(deck.draw());
                playerContent = 'The total is ' + sumHand(playerHand);

                // Player win conditions
                if (sumHand(playerHand) > 21) {
                    playerContent = 'You Lose'
                    collector.stop();
                } else if (sumHand(playerHand) === 21) {
                    playerContent = 'You Win!';
                    collector.stop();
                }
            } else if (reaction.emoji.name === '⏹') {
                console.log('Stay');
                // Dealer's turn and end condition
                while (sumHand(dealerHand) < 17) {
                    dealerHand.push(deck.draw());
                    dealerContent = displayHand(dealerHand);
                }

                console.log('Dealers hand is ' +  sumHand(dealerHand));

                // Dealer conditions
                if (sumHand(dealerHand) > 21 || sumHand(playerHand) > sumHand(dealerHand)) {
                    playerContent = 'You Win'
                    collector.stop();
                } else if (sumHand(dealerHand) === 21 || sumHand(playerHand) < sumHand(dealerHand)) {
                    playerContent = 'You Lose';
                    collector.stop();
                } else {
                    playerContent = 'A DRAW!';
                    collector.stop();
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle(title)
                .addField("Dealer's Hand:", dealerContent, false)
                .addField(`${message.author.tag}'s Hand:`, displayHand(playerHand), false)
                .setDescription(playerContent)
                .setTimestamp()

            msg.edit(embed);

            removeReactions(msg, message);
        });
        
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });

    }
}

function removeReactions(msg, original) {
    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(original.author.id));
    try {
        for (const reaction of userReactions.values()) {
            reaction.users.remove(original.author.id);
        }
    } catch (error) {
        console.error('Failed to remove reactions');
    }
}

function displayHand(hand) {
    let output = '';

    for (let i = 0; i < hand.length; i++) {
        output += hand[i].num + ' of ' + hand[i].suite + '\n';
    }
    return output;
}

function sumHand(hand) {
    let total = 0;
    // TODO: for now assume ace is 11
    // let aceCounter = 0;
    for (let i = 0; i < hand.length; i++) {
        if (['Jack', 'Queen', 'King'].includes(hand[i].num)) {
            total  += 10;
        } else if (hand[i].num === 'Ace') {
            total += 11;
        } else {
            total += parseInt(hand[i].num);
        }
    }

    return total;
}