module.exports = {
    general: {
        enableLogStack: process.env.LOG_CALL_STACK || false
    },
    discord: {
        username: process.env.DISCORD_BOT_USERNAME || 'LPTT AI Bot',
        clientId: process.env.DISCORD_BOT_CLIENT_ID || '',
        token: process.env.DISCORD_BOT_TOKEN || '',
        needAdminPrivileges: process.env.NEED_ADMIN_PRIVILEGES || true, /* If true, only admins can delete (server, switch..), manage credentials and reset a channel */
    }
};
