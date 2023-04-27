
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

        await category.permissionOverwrites.edit(
            instance.role === null ? guild.roles.everyone.id : instance.role, {
            ViewChannel: true
        });

        for (const [name, id] of Object.entries(instance.channelId)) {
            if (name !== 'commands' && name !== 'teamchat') continue;

            const channel = DiscordTools.getTextChannelById(guild.id, id);
            await channel.permissionOverwrites.edit(
                instance.role === null ? guild.roles.everyone.id : instance.role, {
                SendMessages: true
            });
        }
    },
}