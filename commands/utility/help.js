const { SlashCommandBuilder, InteractionContextType, EmbedBuilder, MessageFlags } = require('discord.js');
const { getAverageColor } = require("fast-average-color-node");

const GuildConfig = require('#models/GuildConfig');

const { UploadFile } = require('#utility/CloudflareStorage');
const { DownloadYoutubeAudio, ValidateYoutubeURL, GetYoutubeVideoInfo } = require('#utility/YoutubeHelper');
const { ValidateSpotifyTrackURL, GetSpotifyTrackInfo } = require('#utility/SpotifyHelper');
const SubmitHubAPI = require('#utility/SubmitHubAPI');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Displays help information.').setContexts(InteractionContextType.Guild),
    cooldown: 5,
    remove: false,
    async execute(interaction) {
        for (const command of interaction.client.commands.values()) {
            if (command.remove || command.data.name === 'help') continue; // skip commands marked for removal or the help command itself
            console.log(command.data.name);
            console.log(command.data.description);
            for (const option of command.data.options) {
                console.log(`  - ${option.name}: ${option.description}`);
            }
        }
    },
};