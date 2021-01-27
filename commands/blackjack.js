const CardDeck = require('./CardDeck.js');
const Discord = require('discord.js');

const GREEN = '#2ECC71';
const RED = '#FF0000';
const YELLOW = '#ffff00';
const BLACK = '#000000';

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
		let title = 'Blackjack';
        let playerContent = 'The total is ' + sumHand(playerHand);
        let color = BLACK;

		let embed = new Discord.MessageEmbed()
			.setTitle(title)
            .addField("Dealer's Hand:", `${dealerHand[0].num} of ${dealerHand[1].suite}\n *One Face Down*`, false)
            .addField(`${message.author.tag}'s Hand:`, displayHand(playerHand), false)
            .setDescription(playerContent)
            .setFooter('⬆ to hit and ⏹ to stay.')
			.setTimestamp();

        let msg = await message.channel.send(embed);

        // add the reactions
        for (let i = 0; i < reactionList.length; i++) {
            msg.react(reactionList[i]);
        }

        // only the user who initiated the gane can react to play
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

                // Player win/lose conditions
                if (sumHand(playerHand) > 21) {
                    playerContent = 'You Lose'
                    color = RED;
                    collector.stop();
                } else if (sumHand(playerHand) === 21) {
                    playerContent = 'You Win!';
                    color = GREEN;
                    collector.stop();
                }
            } else if (reaction.emoji.name === '⏹') {
                console.log('Stay');
                // Dealer's turn and end condition
                while (sumHand(dealerHand) < 17) {
                    dealerHand.push(deck.draw());
                }

                console.log('Dealers hand is ' +  sumHand(dealerHand));
                console.log(dealerHand);

                // Dealer win/lose conditions
                if (sumHand(dealerHand) > 21 || sumHand(playerHand) > sumHand(dealerHand)) {
                    playerContent = 'You Win'
                    color = GREEN;
                    collector.stop();
                } else if (sumHand(dealerHand) === 21 || sumHand(playerHand) < sumHand(dealerHand)) {
                    playerContent = 'You Lose';
                    color = RED;
                    collector.stop();
                } else {
                    playerContent = 'A DRAW!';
                    color =  YELLOW;
                    collector.stop();
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle(title)
                .addField("Dealer's Hand:", displayHand(dealerHand), false)
                .addField(`${message.author.tag}'s Hand:`, displayHand(playerHand), false)
                .setDescription(playerContent)
                .setColor(color)
                .setTimestamp()
                .setFooter('⬆ to hit and ⏹ to stay.');

            msg.edit(embed);

            removeReactions(msg, message);
        });
        
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });

    }
}

// Removes the user's reactions from the embed
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

// Displays the contents of a hand for the embed
function displayHand(hand) {
    let output = '';

    for (let i = 0; i < hand.length; i++) {
        output += hand[i].num + ' of ' + hand[i].suite + '\n';
    }
    return output;
}

// Returns the value of a hand
function sumHand(hand) {
    let total = 0;
    let aceCounter = 0;

    for (let i = 0; i < hand.length; i++) {
        if (['Jack', 'Queen', 'King'].includes(hand[i].num)) {
            total  += 10;
        } else if (hand[i].num === 'Ace') {
            aceCounter++;
        } else {
            total += parseInt(hand[i].num);
        }
    }

    if (total > 10) {
        return total + aceCounter;
    } else {
        if ((total + 11 + (aceCounter-1))  <= 21) {
            return (total + 11 + (aceCounter-1));
        } else {
            return total + aceCounter;
        }
    }
}