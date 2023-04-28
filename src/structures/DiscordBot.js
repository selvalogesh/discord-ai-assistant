
const Discord = require('discord.js');
const Fs = require('fs');
const Path = require('path');

const Config = require('../../config');
const DiscordEmbeds = require('../discordTools/discordEmbeds.js');
const DiscordTools = require('../discordTools/discordTools');
const InstanceUtils = require('../util/instanceUtils');

const Logger = require('./Logger.js');
const PermissionHandler = require('../handlers/permissionHandler.js');

class DiscordBot extends Discord.Client {
    constructor(props) {
        super(props);

        this.instances = {};

        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/discordBot.log'), 'default');

        this.commands = new Discord.Collection();

        this.loadDiscordCommands();
        this.loadDiscordEvents();
    }

    loadDiscordCommands() {
        const commandFiles = Fs.readdirSync(Path.join(__dirname, '..', 'commands'))
            .filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    loadDiscordEvents() {
        const eventFiles = Fs.readdirSync(Path.join(__dirname, '..', 'discordEvents'))
            .filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`../discordEvents/${file}`);

            if (event.name === 'rateLimited') {
                this.rest.on(event.name, (...args) => event.execute(this, ...args));
            }
            else if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            }
            else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
        }
    }

    build() {
        this.login(Config.discord.token).catch(error => {
            switch (error.code) {
                case 502: {
                    this.log('Error', `badGateway ${ JSON.stringify(error) }`, 'error')
                } break;

                case 503: {
                    this.log('Error', `serviceUnavailable ${ JSON.stringify(error) }`, 'error')
                } break;

                default: {
                    this.log('Error', `${JSON.stringify(error)}`, 'error');
                } break;
            }
        });
    }

    getInstance(guildId) {
        return this.instances[guildId];
    }

    setInstance(guildId, instance) {
        InstanceUtils.writeInstanceFile(guildId, instance);
        this.instances[guildId] = instance;
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

    async setupGuild(guild) {
        const instance = this.getInstance(guild.id);
        const firstTime = instance.firstTime;

        await require('../discordTools/RegisterSlashCommands')(this, guild);

        let category = await require('../discordTools/SetupGuildCategory')(this, guild);
        await require('../discordTools/SetupGuildChannels')(this, guild, category);

        // await require('../discordTools/SetupSettingsMenu')(this, guild);
        
        if (firstTime) {
            await PermissionHandler.resetPermissions(this, guild);
            instance.firstTime = false;
        }
        this.setInstance(guild.id, instance);
    }

    async validatePermissions(interaction) {
        const instance = this.getInstance(interaction.guildId);

        /* If role isn't setup yet, validate as true */
        if (instance.role === null) return true;

        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has(instance.role)) {
            let role = DiscordTools.getRole(interaction.guildId, instance.role);
            const response = `You are not part of the ${role.name} role, therefore you can't run bot commands.`;
            await interaction.reply(DiscordEmbeds.getActionInfoEmbed(1, response));
            this.log("WARNING", response);
            return false;
        }
        return true;
    }

    isAdministrator(interaction) {
        return interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator);
    }
}

module.exports = DiscordBot;
