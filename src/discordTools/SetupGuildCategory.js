const Discord = require('discord.js');

const DiscordTools = require('../discordTools/discordTools.js');

module.exports = async (client, guild) => {
    const instance = client.getInstance(guild.id);

    let category = undefined;
    if (instance.channelId.category !== null) {
        category = DiscordTools.getCategoryById(guild.id, instance.channelId.category);
    }
    if (category === undefined) {
        category = await DiscordTools.addCategory(guild.id, 'openAIAssistant');
        instance.channelId.category = category.id;
        client.setInstance(guild.id, instance);
    }

    client.log('INFO', `Category created for guild id: ${guild.id}`);
    return category;
};