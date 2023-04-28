
const DiscordTools = require('../discordTools/discordTools.js');

module.exports = {
    removeViewPermission: async function (client, guild) {
        const instance = client.getInstance(guild.id);

        if (instance.channelId.category === null) return;

        const category = await DiscordTools.getCategoryById(guild.id, instance.channelId.category);

        if (instance.role !== null) {
            await category.permissionOverwrites.edit(
                instance.role, {
                ViewChannel: false
            });
        }

        await category.permissionOverwrites.edit(
            guild.roles.everyone.id, {
            ViewChannel: false
        });
    },

    resetPermissions: async function (client, guild) {
        const instance = client.getInstance(guild.id);

        if (instance.channelId.category === null) return;

        const category = await DiscordTools.getCategoryById(guild.id, instance.channelId.category);

        await category.permissionOverwrites.edit(guild.roles.everyone.id, { ViewChannel: true });

        for (const [name, id] of Object.entries(instance.channelId)) {
            if(name === 'category') continue;
            let channel = DiscordTools.getTextChannelById(guild.id, id);
            if(!channel) channel = DiscordTools.getTextChannelByName(guild.id, name);
            
            // client.log('INFO', JSON.stringify({ instanceChannelId: id, fetchedId: channel?.id }));
            if(channel) await channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: true });
        }
    },
}