const Discord = require('discord.js');
const Path = require('path');

const Constants = require('../util/constants.js');
const Client = require('../../index.ts');
const DiscordButtons = require('./discordButtons.js');
const DiscordEmbeds = require('./discordEmbeds.js');
const DiscordSelectMenus = require('./discordSelectMenus.js');
const DiscordTools = require('./discordTools.js');

module.exports = {
    getCredentialsShowMessage: function (userCredentials) {
        const content = {
            embeds: [DiscordEmbeds.getCredentialsShowEmbed(userCredentials)],
            ephemeral: true
        }
        return content;
    },

    getCredentialsNotFoundMessage: function (userName, ephemeral = true) {
        const message = `Credential not registered for user: ${userName}`;
        const footer = 'Use `/credentials add` or `/help`';
        const content = DiscordEmbeds.getActionInfoEmbed(1, message, footer, ephemeral);
        return content;
    },

    getHelpMessage: function (interaction) {
        const content = {
            embeds: [DiscordEmbeds.getHelpEmbed(interaction.guildId)],
            components: DiscordButtons.getHelpButtons(),
            ephemeral: true
        }
        return content;
    },

    // sendMessage: async function (guildId, content, messageId, channelId, interaction = null) {
    //     if (interaction) {
    //         await Client.client.interactionUpdate(interaction, content);
    //         return;
    //     }

    //     let message = messageId !== null ?
    //         await DiscordTools.getMessageById(guildId, channelId, messageId) : undefined;

    //     if (message !== undefined) {
    //         return await Client.client.messageEdit(message, content);
    //     }
    //     else {
    //         const channel = DiscordTools.getTextChannelById(guildId, channelId);

    //         if (!channel) {
    //             Client.client.log(Client.client.intlGet(null, 'errorCap'),
    //                 Client.client.intlGet(null, 'couldNotGetChannelWithId', { id: channelId }), 'error');
    //             return;
    //         }

    //         return await Client.client.messageSend(channel, content);
    //     }
    // },

    // sendServerMessage: async function (guildId, serverId, state = null, interaction = null) {
    //     const instance = Client.client.getInstance(guildId);
    //     const server = instance.serverList[serverId];

    //     const content = {
    //         embeds: [await DiscordEmbeds.getServerEmbed(guildId, serverId)],
    //         components: DiscordButtons.getServerButtons(guildId, serverId, state)
    //     }

    //     const message = await module.exports.sendMessage(guildId, content, server.messageId,
    //         instance.channelId.servers, interaction);

    //     if (!interaction) {
    //         instance.serverList[serverId].messageId = message.id;
    //         Client.client.setInstance(guildId, instance);
    //     }
    // },

    // sendDiscordEventMessage: async function (guildId, serverId, text, image, color) {
    //     const instance = Client.client.getInstance(guildId);

    //     const content = {
    //         embeds: [DiscordEmbeds.getEventEmbed(guildId, serverId, text, image, color)],
    //         files: [new Discord.AttachmentBuilder(
    //             Path.join(__dirname, '..', `resources/images/events/${image}`))]
    //     }

    //     await module.exports.sendMessage(guildId, content, null, instance.channelId.events);
    // },
}