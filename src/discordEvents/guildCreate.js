module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        require('../util/CreateInstanceFile')(client, guild);
        require('../util/CreateCredentialsFile')(client, guild);


        await client.setupGuild(guild);
        client.log('INFO', `Bot added to guild name: ${guild.name} guild id: ${guild.id}`);
    },
}