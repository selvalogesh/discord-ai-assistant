const InstanceUtils = require('../util/instanceUtils.js');
const { aiRemoveGuildIfExists } = require('../handlers/aiModelHandler.js');

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        const guildId = guild.id;
        
        try {
            InstanceUtils.deleteCredentialsFile(guildId);
            InstanceUtils.deleteInstanceFile(guildId);
            aiRemoveGuildIfExists(guildId);
        } catch(err) {
            client.log('ERROR', err, 'error');
        }
        client.log('INFO', `Bot removed from guild name: ${guild.name} guild id: ${guildId}`);
    },
}