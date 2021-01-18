const Discord = require('discord.js');
const words = require('./words.json');

module.exports = {
	name: 'hangman',
	description: 'Play Hangman',
	execute(message) {

		const secretWord = words.list[Math.floor(Math.random() * words.list.length)];
		const displayWord = Array(secretWord.length).fill('█');
		let attempts = 6;

		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 26, time: 300000 });

		let embed = new Discord.MessageEmbed()
			.setColor('#2ECC71')
			.setTitle('Hangman')
			.addField('Attempts: ' + attempts, outputWord(displayWord), true)
			.setTimestamp();

		console.log('Initialized Hangman');
		message.channel.send(embed);

		collector.on('collect', m => {
			console.log(`User recorded ${m.content}`);
			m.delete();
			// Single char mode
			if (m.content.length === 1) {

				if (secretWord.includes(m.content)) {
					for (let i = 0; i < secretWord.length; i++) {
						if (m.content === secretWord[i]) {
							displayWord[i] = m.content;
						}
					}
				} else {
					attempts--;
					if (attempts < 1) {
						embed = new Discord.MessageEmbed()
							.setColor('#FF0000')
							.setTitle('Hangman')
							.addField('You lose', secretWord.join(''), true)
							.setTimestamp();

						message.channel.send(embed);
						collector.stop();
						return;
					}
				}

				embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Hangman')
					.addField('Attempts: ' + attempts, outputWord(displayWord), true)
					.setTimestamp();
				message.channel.send(embed);

				if (!displayWord.includes('█')) {
					message.channel.send('You win!');
					console.log('Game over');
					collector.stop();
				}
			}
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
			message.channel.send('Game over');
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