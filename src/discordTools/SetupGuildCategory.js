const DiscordTools = require('../discordTools/discordTools.js');

module.exports = async (client, guild) => {
    const instance = client.getInstance(guild.id);

    let category = DiscordTools.getCategoryByName(guild.id, 'openAIAssistant');
    if (category === undefined) {
        category = await DiscordTools.addCategory(guild.id, 'openAIAssistant');
        client.log('INFO', `Category created for guild id: ${guild.id}`);
    }
    instance.channelId.category = category.id;
    client.setInstance(guild.id, instance);
    return category;
};