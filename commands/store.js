let store = '';

module.exports = {
	name: 'store',
	description: 'This is a test command to store stuff',
	execute(message, args) {
		console.log('execute store');
		if (!args.length) {
			message.channel.send(`The current message stored is: ${store}`);
		} else {
			store = args[0];
			message.channel.send('Updated.');
		}
	},
};