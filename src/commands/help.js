const Builder = require('@discordjs/builders');

const DiscordMessages = require('../discordTools/discordMessages.js');

module.exports = {
	name: 'help',
	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('help')
			.setDescription('Display help message.');
	},
	async execute(client, interaction) {
		const content = DiscordMessages.getHelpMessage(interaction);
		return interaction.reply(content);
	},
};
