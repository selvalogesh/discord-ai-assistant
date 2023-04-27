const Fs = require('fs');
const Path = require('path');

module.exports = {
    readInstanceFile: function (guildId) {
        const path = Path.join(__dirname, '..', '..', 'instances', `${guildId}.json`);
        if (!Fs.existsSync(path)) return;
        return JSON.parse(Fs.readFileSync(path, 'utf8'));
    },

    writeInstanceFile: function (guildId, instance) {
        const path = Path.join(__dirname, '..', '..', 'instances', `${guildId}.json`);
        Fs.writeFileSync(path, JSON.stringify(instance, null, 2));
    },

    deleteInstanceFile: function (guildId) {
        const path = Path.join(__dirname, '..', '..', 'instances', `${guildId}.json`);
        Fs.unlinkSync(path);
    },

    readCredentialsFile: function (guildId) {
        const path = Path.join(__dirname, '..', '..', 'credentials', `${guildId}.json`);
        if (!Fs.existsSync(path)) return;
        return JSON.parse(Fs.readFileSync(path, 'utf8'));
    },

    getUserCredentials: function (guildId, userId) {
        const credentials = this.readCredentialsFile(guildId);
        if (!credentials) return;
        return credentials[userId];
    },

    writeCredentialsFile: function (guildId, credentials) {
        const path = Path.join(__dirname, '..', '..', 'credentials', `${guildId}.json`);
        Fs.writeFileSync(path, JSON.stringify(credentials, null, 2));
    },

    deleteCredentialsFile: function (guildId) {
        const path = Path.join(__dirname, '..', '..', 'credentials', `${guildId}.json`);
        Fs.unlinkSync(path);
    },
}
