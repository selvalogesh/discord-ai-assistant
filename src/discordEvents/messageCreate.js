const discordMessages = require('../discordTools/discordMessages');
const { aiResponseHandler } = require('../handlers/aiModelHandler');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        const instance = client.getInstance(message.guild.id);
        if (message.author.bot
            || message.channelId !== instance.channelId.teamchat 
            || message.cleanContent.startsWith('/'))  return;
        
        // const response = `You said: ${message.cleanContent}`;
        const response = await aiResponseHandler(message);

        if(response === '<|USER_NOT_REGISTERED|>') {
            const content = discordMessages.getCredentialsNotFoundMessage(message.author.username, false);
            return message.channel.send(content);
        }
        // await client.messageReply(message, content);
        return message.channel.send(response);
    },
}