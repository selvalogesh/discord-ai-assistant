const Discord = require('discord.js');

const DiscordEmbeds = require('../discordTools/discordEmbeds');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        const instance = client.getInstance(interaction.guildId);

        /* Check so that the interaction comes from valid channels */
        if (!Object.values(instance.channelId).includes(interaction.channelId) && !interaction.isCommand) {
            client.log('WARNING', 'Interaction from an invalid channel.')
            if (interaction.isButton()) {
                try {
                    interaction.deferUpdate();
                }
                catch (e) {
                    client.log(client.intlGet(null, 'errorCap'),
                        client.intlGet(null, 'couldNotDeferInteraction'), 'error');
                }
            }
        }

        if (interaction.isButton()) {
            require('../handlers/buttonHandler')(client, interaction);
        }
        else if (interaction.isStringSelectMenu()) {
            require('../handlers/selectMenuHandler')(client, interaction);
        }
        else if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);

            /* If the command doesn't exist, return */
            if (!command) return;

            try {
                await command.execute(client, interaction);
            }
            catch (e) {
                const message = `There was an error while executing '${command.name}' command! - ${e.toString()}`;
                const content = DiscordEmbeds.getActionInfoEmbed(1, message);
                client.log('ERROR', message, 'error');
                await interaction.reply(content);
            }
        }
        else if (interaction.type === Discord.InteractionType.ModalSubmit) {
            require('../handlers/modalHandler')(client, interaction);
        }
        else {
            client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unknownInteraction'), 'error');

            if (interaction.isButton()) {
                try {
                    interaction.deferUpdate();
                }
                catch (e) {
                    client.log(client.intlGet(null, 'errorCap'),
                        client.intlGet(null, 'couldNotDeferInteraction'), 'error');
                }
            }
        }
    },
};