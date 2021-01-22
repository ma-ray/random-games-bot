const Discord = require('discord.js');
const words = require('./words.json');
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
		const displayWord = Array(secretWord.length).fill('█');
		let attempts = 6;
		let guess = false;

		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 26, time: 300000 });

		let embed = new Discord.MessageEmbed()
			.setColor('#2ECC71')
			.setTitle('Hangman')
			.addField('Attempts: ' + attempts, outputWord(displayWord), true)
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

					embed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addField('Attempts: ' + attempts, outputWord(displayWord), true)
						.setTimestamp()
						.setImage(imageArray[attempts]);
					msg.edit(embed);
				} else {
					attempts--;
					embed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addField('Attempts: ' + attempts, outputWord(displayWord), true)
						.setTimestamp()
						.setImage(imageArray[attempts]);
					msg.edit(embed);
				}
				
				
			}

			if (attempts < 1) {
				embed = new Discord.MessageEmbed()
					.setColor('#FF0000')
					.addField('You lose!', secretWord, true)
					.setTimestamp()
					.setImage(imageArray[attempts]);

				msg.edit(embed)
				collector.stop();
				return;
			}

			if (!displayWord.includes('█')) {
				embed = new Discord.MessageEmbed()
					.setColor()
					.addField('You win!', secretWord, true)
					.setTimestamp();
				msg.edit(embed);
				message.channel.send('You win!');
				console.log('Game over');
				collector.stop();
			}
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