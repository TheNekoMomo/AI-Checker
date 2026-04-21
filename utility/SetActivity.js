const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user?.setActivity({
            name: 'Looking for Clankers',
            type: ActivityType.Streaming,
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        });
    },
};