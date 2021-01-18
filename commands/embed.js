/* eslint-disable no-mixed-spaces-and-tabs */
const Discord = require('discord.js');

module.exports = {
	name: 'embed',
	description: 'Embed stuff',
	execute(message) {
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Hangman')
			.setImage('https://www.utsc.utoronto.ca/cms/sites/utsc.utoronto.ca.cms/files/styles/person-thumbnail/public/Nick_Cheng.jpg?itok=p_yqXXPh')
			.addField('Inline field title', 'a █ █ p l e', true)
			.setTimestamp();

		message.channel.send(exampleEmbed);
	},
};