const Discord = require('discord.js');
const words = require('./words.json');

const RED = '#FF0000';
const BLUE = '#0093FF';
const GREEN = '#2ECC71';

const imageArray = ['https://i.imgur.com/4fUw8pk.png',
					'https://i.imgur.com/JSItDs4.png',
					'https://i.imgur.com/yIH3jOU.png',
					'https://i.imgur.com/TdBJrbe.png',
					'https://i.imgur.com/xnow7rE.png',
					'https://i.imgur.com/bJVNGVQ.png',
					'https://i.imgur.com/35Yr3GE.png'];

module.exports = {
	name: 'hangman',
	description: 'Play Hangman',
	async execute(message) {
		const secretWord = words.list[Math.floor(Math.random() * words.list.length)];
		let displayWord = Array(secretWord.length).fill('█');

		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 26, time: 300000 });

		// Variables for the embed
		let color = GREEN;
		let attempts = 6;
		let title = 'Hangman';
		let field = 'Attempts: ' + attempts;

		let embed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.addField(field, outputWord(displayWord), true)
			.setTimestamp()
			.setImage(imageArray[attempts]);

		console.log('Initialized Hangman');
		let msg = await message.channel.send(embed);

		collector.on('collect', m => {
			console.log(`User recorded ${m.content}`);

			// Delete the user's input message
			m.delete();

			// Single char mode
			if (m.content.length === 1) {
				if (secretWord.includes(m.content)) {
					for (let i = 0; i < secretWord.length; i++) {
						if (m.content === secretWord[i]) {
							displayWord[i] = m.content;
						}
					} 
					color = BLUE;
					field = 'Attempts: ' + attempts;

					// Win condition
					if (!displayWord.includes('█')) {
						color = GREEN;
						displayWord = secretWord.split('');
						field = 'You win!';
						collector.stop();
					}
				} else {
					attempts--;
					field = 'Attempts: ' + attempts;
				}
			} else {
				// Win condition
				if (m.content === secretWord) {
					color = GREEN;
					displayWord = secretWord.split('');
					field = 'You win!';
					collector.stop();
				} else {
					attempts--;
					field = 'Attempts: ' + attempts;
				}
			}

			// Loss condition
			if (attempts < 1) {
				color = RED;
				displayWord = secretWord.split('');
				field = 'You lose!';
				collector.stop();
			}

			embed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.addField(field, outputWord(displayWord), true)
				.setTimestamp()
				.setImage(imageArray[attempts]);

			msg.edit(embed);
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
			message.channel.send('Game over!');
		});
	},
};

function outputWord(word) {
	let output = '';

	for (let i = 0; i < word.length; i++) {
		output += word[i] + ' ';
	}

	return output;
}