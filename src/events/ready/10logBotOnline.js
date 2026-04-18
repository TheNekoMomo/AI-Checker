// @ts-check

/** @typedef {import('../../types').EventFileHandler} EventFileHandler */

/** @type {EventFileHandler} */
module.exports = (client) => {
    console.log(`${client.user?.tag} is online.`);

    client.guilds.cache.forEach(guild => {
        console.log(`Server Name: ${guild.name}, ${guild.memberCount} members`);
    });
};