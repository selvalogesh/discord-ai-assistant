const Discord = require('discord.js');
const { repository: { repo } } = require('../../package.json');

module.exports = {
    getButton: function (options = {}) {
        const button = new Discord.ButtonBuilder();

        if (options.customId) button.setCustomId(options.customId);
        if (options.label) button.setLabel(options.label);
        if (options.style) button.setStyle(options.style);
        if (options.url) button.setURL(options.url);
        if (options.emoji) button.setEmoji(options.emoji);
        if (options.disabled) button.setDisabled(options.disabled);

        return button;
    },

    getHelpButtons: function () {
        return [
            new Discord.ActionRowBuilder().addComponents(
                module.exports.getButton({
                    style: Discord.ButtonStyle.Link,
                    label: 'HOW TO REGISTER',
                    url: `${repo}/blob/master/docs/credentials.md`,
                }),
                module.exports.getButton({
                    style: Discord.ButtonStyle.Link,
                    label: 'ACCESS TOKEN',
                    url: 'https://huggingface.co/docs/hub/security-tokens'
                }),
                module.exports.getButton({
                    style: Discord.ButtonStyle.Link,
                    label: 'USAGE METRICS',
                    url: 'https://api-inference.huggingface.co/dashboard/usage'
                })
            )];
    },
}