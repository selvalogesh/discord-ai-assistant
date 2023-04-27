const DiscordTools = require('../discordTools/discordTools.js');

module.exports = async (client, guild, category) => {
    await addTextChannel('commands', 'commands', client, guild, category);
    await addTextChannel('teamchat', 'teamchat', client, guild, category);
    await addTextChannel('settings', 'settings', client, guild, category);
    client.log('INFO', `Channels created for guild id: ${guild.id}`);
};

async function addTextChannel(name, idName, client, guild, parent) {
    const instance = client.getInstance(guild.id);

    let channel = undefined;
    if (instance.channelId[idName] !== null) {
        channel = DiscordTools.getTextChannelById(guild.id, instance.channelId[idName]);
    }
    if (channel === undefined) {
        channel = await DiscordTools.addTextChannel(guild.id, name);
        instance.channelId[idName] = channel.id;
        client.setInstance(guild.id, instance);

        try {
            channel.setParent(parent.id);
        }
        catch (e) {
            client.log('ERROR',`Could not set parent for channel: ${channel.id}`, 'error');
        }
    }

    if (instance.firstTime) {
        try {
            channel.setParent(parent.id);
        }
        catch (e) {
            client.log('ERROR',`Could not set parent for channel: ${channel.id}`, 'error');
        }
    }
}