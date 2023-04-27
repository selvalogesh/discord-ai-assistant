/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

const DiscordMessages = require('./discordMessages.js');

module.exports = async (client, rustplus) => {
    let instance = client.getInstance(rustplus.guildId);
    const guildId = rustplus.guildId;
    const serverId = rustplus.serverId;

    for (const entityId in instance.serverList[serverId].alarms) {
        instance = client.getInstance(guildId);
        const entity = instance.serverList[serverId].alarms[entityId];
        const info = await rustplus.getEntityInfoAsync(entityId);

        if (!(await rustplus.isResponseValid(info))) {
            await DiscordMessages.sendSmartAlarmNotFoundMessage(guildId, serverId, entityId);
            entity.reachable = false;
        }
        else {
            entity.reachable = true;
        }

        if (entity.reachable) {
            if (entity.active !== info.entityInfo.payload.value) {
                entity.active = info.entityInfo.payload.value;
            }
        }
        client.setInstance(guildId, instance);

        await DiscordMessages.sendSmartAlarmMessage(guildId, serverId, entityId);
    }
};
