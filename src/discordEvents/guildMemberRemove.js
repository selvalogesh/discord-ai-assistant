const InstanceUtils = require('../util/instanceUtils.js');
const { aiRemoveHfUserIfExists } = require('../handlers/aiModelHandler.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {
        const guildId = member.guild.id;
        const userId = member.user.id;

        const credentials = InstanceUtils.readCredentialsFile(guildId);

        if (!credentials[userId]) return;

        aiRemoveHfUserIfExists(guildId, userId);

        const { [userId]: userToDelete, ...newCredentials } = credentials;
        InstanceUtils.writeCredentialsFile(guildId, newCredentials);
    },
}