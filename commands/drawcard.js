const CardDeck = require('./CardDeck.js');
const localdeck = new CardDeck();

module.exports = {
	name: 'drawcard',
	description: 'Test if the card deck is working',
	execute(message) {
        let card = localdeck.draw();

        message.channel.send(`${card.num} of ${card.suite} was drawn. The color is ${card.color}. The deck has ${localdeck.numCards()}`);
	},
};