// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
// Load discord token from .env file
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
// Get utility to log the IP
const getPublicIP = require('#utility/GetIP');
const ConnectToDatabase = require('#db/DatabaseConnect');
// Load fs and path modules for file handling
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Tie a new Collection called cooldowns to the client - used for command cooldowns
client.cooldowns = new Collection();

// load events from events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
(async () => {
    // Log IP for use in other tasks
    console.log('Public IP:', await getPublicIP());

    // Connects to the Mongoose database
    await ConnectToDatabase();

    // Login to the discord bot
    await client.login(token);
})();