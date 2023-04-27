const Fs = require('fs');
const Path = require('path');

const InstanceUtils = require('./instanceUtils.js');

module.exports = (client, guild) => {
    let instance = null;
    if (!Fs.existsSync(Path.join(__dirname, '..', '..', 'instances', `${guild.id}.json`))) {
        instance = {
            firstTime: true,
            channelId: {
                category: null,
                commands: null,
                teamchat: null,
                settings: null,
            },
        };
    }
    else {
        instance = InstanceUtils.readInstanceFile(guild.id);

        if (!instance.hasOwnProperty('firstTime')) {
            instance.firstTime = true;
        }

        if (!instance.hasOwnProperty('channelId')) {
            instance.channelId = {
                category: null,
                commands: null,
                teamchat: null,
                settings: null,
            }
        } else {
            if (!instance.channelId.hasOwnProperty('category')) instance.channelId.category = null;
            if (!instance.channelId.hasOwnProperty('commands')) instance.channelId.commands = null;
            if (!instance.channelId.hasOwnProperty('teamchat')) instance.channelId.teamchat = null;
            if (!instance.channelId.hasOwnProperty('settings')) instance.channelId.settings = null;
        }
    }
    
    client.setInstance(guild.id, instance);
};
