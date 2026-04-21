const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChannelType, MessageFlags } = require('discord.js');
const GuildConfig = require('#models/GuildConfig');

module.exports = {
	data: new SlashCommandBuilder().setName('command-channel').setDescription('Add or Remove a channel for the allowe commands Channels.').setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) => subcommand.setName('add').setDescription('Set a channel that the checking commands can be used in.')
        .addChannelOption((option) => option.setName('add-command-channel').setDescription('The channel to use for commands').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Remove a channel off the allowed list')
        .addChannelOption((option) => option.setName('remove-command-channel').setDescription('The channel to remove for commands').addChannelTypes(ChannelType.GuildText).setRequired(true))),
	remove: false,
	async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const channel = interaction.options.getChannel('add-command-channel');

            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guildId },
                { $addToSet: { allowedChannels: channel.id } },
                { upsert: true }
            );

            await interaction.editReply({ content: `Added ${channel} to the list of allowed channels.`, flags: MessageFlags.Ephemeral });
        }
        else if (subcommand === 'remove') {
            const channel = interaction.options.getChannel('remove-command-channel');

            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guildId },
                { $pull: { allowedChannels: channel.id } },
                { upsert: true }
            );

            await interaction.editReply({ content: `Removed ${channel} from the list of allowed channels.`, flags: MessageFlags.Ephemeral });
        }
	},
};