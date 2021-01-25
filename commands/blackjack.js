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

        let msg = await message.channel.send('Test');
        for (let i = 0; i < reactionList.length; i++) {
            msg.react(reactionList[i]);
        }

        const filter = (reaction, user) => {
            return reactionList.includes(reaction.emoji.name) && user.id === message.author.id;
        };
        
        const collector = msg.createReactionCollector(filter, { time: 15000 });
        
        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

            if (reaction.emoji.name === '⬆') {
                msg.edit('Hit');
            } else if (reaction.emoji.name === '⏹') {
                msg.edit('Stay');
            }

            // clear the user's reactions
            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
            try {
                for (const reaction of userReactions.values()) {
                    reaction.users.remove(message.author.id);
                }
            } catch (error) {
                console.error('Failed to remove reactions');
            }
        });
        
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });

    }
}

function removeReactions(msg, original, reaction) {
    

}