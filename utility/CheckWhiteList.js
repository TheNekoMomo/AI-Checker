const fs = require('fs/promises');
const path = require('node:path');

async function isGuildInWhiteList(guildId) {
    const whiteListPath = path.join(__dirname, '..', 'whiteList.json');
    const whitelist = await fs.readFile(whiteListPath, 'utf-8');
    const whiteListJSON = JSON.parse(whitelist);
    return whiteListJSON.includes(guildId);
}

module.exports = isGuildInWhiteList;