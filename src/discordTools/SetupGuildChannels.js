const DiscordTools = require('../discordTools/discordTools.js');

module.exports = async (client, guild, category) => {
    await addTextChannel('commands', 'commands', client, guild, category);
    await addTextChannel('teamchat', 'teamchat', client, guild, category);
    await addTextChannel('settings', 'settings', client, guild, category);
};

async function addTextChannel(name, idName, client, guild, parent) {
    const instance = client.getInstance(guild.id);
    let channel = DiscordTools.getTextChannelByName(guild.id, idName);
    if (channel === undefined) {
        channel = await DiscordTools.addTextChannel(guild.id, name);
        try {
            channel.setParent(parent.id);
        }
        catch (e) {
            client.log('ERROR',`Could not set parent for channel: ${channel.id}`, 'error');
        }
        client.log('INFO', `Created channel '${idName}' for guild id: ${guild.id}`);
    }
    instance.channelId[idName] = channel.id;
    client.setInstance(guild.id, instance);
}