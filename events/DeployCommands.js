const { Events } = require('discord.js');
const { DeployCommands } = require('../utility/CommandHandler');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        await DeployCommands(client);
	},
};