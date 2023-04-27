const Discord = require('discord.js');
const Path = require('path');

const Config = require('../../config');
const { error } = require('console');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.log('INFO', `LOGGED IN AS: ${client.user.tag}`);

        // Common bot activity across all discord servers
        try {
            await client.user.setUsername(Config.discord.username);
        }
        catch (_) {
            client.log('WARNING',  'Ignored setUsername', 'error');
        }

        try {
            await client.user.setAvatar(Path.join(__dirname, '..', 'resources/images/bot.png'));
        }
        catch (_) {
            client.log('WARNING', 'Ignored setAvatar', 'error');
        }

        client.user.setPresence({
            activities: [{ name: '/help', type: Discord.ActivityType.Listening }],
            status: 'online'
        });

        // Each discord server synced activity.
        for (const guild of client.guilds.cache) {
            require('../util/CreateInstanceFile.js')(client, guild[1]);
            require('../util/CreateCredentialsFile.js')(client, guild[1]);
        }

        // Each discord server asynced activity.
        client.guilds.cache.forEach(async (guild) => {
            try {
                await guild.members.me.setNickname(Config.discord.username);
            }
            catch (e) {
                client.log('WARNING', 'Ignored setNickname');
            }
            await client.setupGuild(guild);
        });
    },
};