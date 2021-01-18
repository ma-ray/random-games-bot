module.exports = {
	name: 'server',
	description: 'List the server info.',
	execute(message) {
		message.channel.send(`**Server name:** ${message.guild.name}\n**Total members:** ${message.guild.memberCount}\n**Owner: **${message.guild.owner}\n**Region: **${message.guild.region}`);
	},
};