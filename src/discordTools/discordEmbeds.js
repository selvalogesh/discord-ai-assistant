const Discord = require('discord.js');
const { repository: { repo } } = require('../../package.json');

const Constants = require('../util/constants.js');

module.exports = {
    getEmbed: function (options = {}) {
        const embed = new Discord.EmbedBuilder();

        if (options.title) embed.setTitle(options.title);
        if (options.color) embed.setColor(options.color);
        if (options.description) embed.setDescription(options.description);
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        if (options.image) embed.setImage(options.image);
        if (options.url) embed.setURL(options.url);
        if (options.author) embed.setAuthor(options.author);
        if (options.footer) embed.setFooter(options.footer);
        if (options.timestamp) embed.setTimestamp();
        if (options.fields) embed.setFields(...options.fields);

        return embed;
    },

    getActionInfoEmbed: function (color, str, footer = null, ephemeral = true) {
        return {
            embeds: [module.exports.getEmbed({
                color: color === 0 ? Constants.COLOR_DEFAULT : Constants.COLOR_INACTIVE,
                description: `\`\`\`diff\n${(color === 0) ? '+' : '-'} ${str}\n\`\`\``,
                footer: footer !== null ? { text: footer } : null
            })],
            ephemeral: ephemeral
        };
    },

    getCredentialsShowEmbed: function (userCredentials) {
        const { discordUserName, hfTokenKey } = userCredentials;
        return module.exports.getEmbed({
            color: Constants.COLOR_DEFAULT,
            title: 'Huggingface Credentials',
            fields: [
                { name: 'name', value: discordUserName, inline: false },
                { name: 'token_key', value: hfTokenKey.replace(/(?<=\w{5})\w(?=\w{5})/g, '*'), inline: false },
            ]
        });
    },

    getHelpEmbed: function () {
        const credentials = `${repo}/blob/master/docs/credentials.md`;
        const commands = `${repo}/blob/master/docs/commands.md`;

        const description =
            `→ [${"How-to Register Credentials"}](${credentials})\n` +
            `→ [${'Command List'}](${commands})`;

        return module.exports.getEmbed({
            color: Constants.COLOR_DEFAULT,
            timestamp: true,
            title: `Help`,
            description: description
        });
    },

    // getServerEmbed: async function (guildId, serverId) {
    //     const instance = Client.client.getInstance(guildId);
    //     const credentials = InstanceUtils.readCredentialsFile(guildId);
    //     const server = instance.serverList[serverId];
    //     let hoster = Client.client.intlGet(guildId, 'unknown');
    //     if (credentials.hasOwnProperty(server.steamId)) {
    //         hoster = await DiscordTools.getUserById(guildId, credentials[server.steamId].discordUserId);
    //         hoster = hoster.user.username;
    //     }

    //     return module.exports.getEmbed({
    //         title: `${server.title}`,
    //         color: Constants.COLOR_DEFAULT,
    //         description: `${server.description}`,
    //         thumbnail: `${server.img}`,
    //         fields: [{
    //             name: Client.client.intlGet(guildId, 'connect'),
    //             value: `\`${server.connect === null ?
    //                 Client.client.intlGet(guildId, 'unavailable') : server.connect}\``,
    //             inline: true
    //         },
    //         {
    //             name: Client.client.intlGet(guildId, 'hoster'),
    //             value: `\`${hoster} (${server.steamId})\``,
    //             inline: false
    //         }]
    //     });
    // },
}