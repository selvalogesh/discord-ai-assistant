const _ = require('lodash');
const { whoAmI } = require('@huggingface/hub');
const Builder = require('@discordjs/builders');

const DiscordEmbeds = require('../discordTools/discordEmbeds.js');

const InstanceUtils = require('../util/instanceUtils.js');
const discordMessages = require('../discordTools/discordMessages.js');
const { aiRemoveHfUserIfExists } = require('../handlers/aiModelHandler.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
    name: 'credentials',

    getData(client, guildId) {
        return new Builder.SlashCommandBuilder()
            .setName('credentials')
            .setDescription('Set/Clear the Huggingface credentials for the user account.')
            .addSubcommand(subcommand => subcommand
                .setName('add')
                .setDescription('Add Huggingface Credentials.')
                .addStringOption(option => option
                    .setName('hf_token_key')
                    .setDescription('Keys Private Key.')
                    .setRequired(true)))
            .addSubcommand(subcommand => subcommand
                .setName('remove')
                .setDescription('Remove my Huggingface Credentials.'))
            .addSubcommand(subcommand => subcommand
                .setName('show')
                .setDescription('Show the current Huggingface Credentials.'))
    },

    async execute(client, interaction) {
        if (!await client.validatePermissions(interaction)) return;
        await interaction.deferReply({ ephemeral: true });
        switch (interaction.options.getSubcommand()) {
            case 'add': {
                addCredentials(client, interaction);
                break;
            }
            case 'remove': {
                removeCredentials(client, interaction);
                break;
            }
            case 'show': {
                showCredentials(client, interaction);
                break;
            }
            default: {
                break;
            }
        }
    },
};

async function addCredentials(client, interaction) {
    const { guildId, credentials, userId, userName } = await getUserAndCredentialsInfo(interaction);
    if(!guildId || !userId || !userName || !credentials) return;

    if (credentials[userId]) {
        const message = `Huggingface Credentials for user: ${userName} is already registered!`;
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(1, message));
        return;
    }

    const hfTokenKey = interaction.options.getString('hf_token_key').trim();

    try {
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(0, 'Checking credentials please wait...'));
        await sleep(700);
        const { name: hfUserName } = await whoAmI({credentials: { accessToken: hfTokenKey }});
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(0, `Found an account with name: ${hfUserName}`));
        await sleep(2000);
    } catch(err) {
        const message = "ERROR: Couldn't find account for the give access token!";
        const footer = 'Retry `/credentials add` or `/help`';
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(1, message, footer));
        return;
    }

    credentials[userId] = new Object();
    credentials[userId].discordUserName = userName;
    credentials[userId].hfTokenKey = hfTokenKey;

    InstanceUtils.writeCredentialsFile(guildId, credentials);

    const message = `Huggingface Credentials added for user: ${userName}!`;
    await interaction.followUp(DiscordEmbeds.getActionInfoEmbed(0, message, null, false));
    client.log('INFO', `Huggingface Credentials added for guildId: ${guildId} userId: ${userId}!`);
}

async function removeCredentials(client, interaction) {
    
    const { guildId, credentials, userId, userName } = await getUserAndCredentialsInfo(interaction);
    if(!guildId || !userId || !userName || !credentials) return;
    
    await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(0, 'Removing credentials please wait...'));
    await sleep(700);
    if (!credentials[userId]) {
        const content = discordMessages.getCredentialsNotFoundMessage(userName);
        await interaction.editReply(content);
        return;
    }

    const { [userId]: userToDelete, ...newCredentials } = credentials;
    InstanceUtils.writeCredentialsFile(guildId, newCredentials);

    aiRemoveHfUserIfExists(guildId, userId);

    const message = `Huggingface Credentials for user: ${userName} was removed successfully!`;
    await interaction.followUp(DiscordEmbeds.getActionInfoEmbed(0, message, null, false));
    client.log('INFO', `Huggingface Credentials removed for guildId: ${guildId} userId: ${userId}.`);
}

async function showCredentials(client, interaction) {
    const { credentials, userId, userName } = await getUserAndCredentialsInfo(interaction);
    if(!userId || !userName || !credentials) return;

    if (!credentials[userId]) {
        const content = discordMessages.getCredentialsNotFoundMessage(userName);
        await interaction.editReply(content);
        return;
    }
    
    const content = discordMessages.getCredentialsShowMessage(credentials[userId]);
    await interaction.editReply(content);
}

async function getUserAndCredentialsInfo(interaction) {
    const guildId = interaction.guildId;
    const respObj = { guildId, credentials: undefined, userId: undefined, userName: undefined };
    
    if(!respObj.guildId) {
        const message = "ERROR: Coundn't find your serverId.";
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(1, message));
        return respObj;
    }

    respObj.credentials = InstanceUtils.readCredentialsFile(guildId);

    respObj.userId = interaction.member?.user?.id;
    respObj.userName = interaction.member?.user?.username;

    if(!respObj.userId || !respObj.userName || !respObj.credentials) {
        const message = "ERROR: Coundn't find your discordId.";
        await interaction.editReply(DiscordEmbeds.getActionInfoEmbed(1, message));
        return respObj;
    }

    return respObj;
}
