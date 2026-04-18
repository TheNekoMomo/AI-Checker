// @ts-check

const { guildWhitelistIDs } = require('../../../config.json');

/** @typedef {import('../../types').EventFileHandler} EventFileHandler */

/** @type {EventFileHandler} */
module.exports = (client) => {
    client.guilds.cache.forEach(guild => {
        if (!guildWhitelistIDs.includes(guild.id)) {
            console.log(`Leaving ${guild.name}`);
            guild.leave();
        }
    });
};