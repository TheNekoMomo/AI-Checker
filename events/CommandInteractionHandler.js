const { Events, MessageFlags, Collection } = require('discord.js');
// Whitelist
const isGuildInWhiteList = require('../utility/CheckWhiteList');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		// Whitelist
		const onWhiteList = await isGuildInWhiteList(interaction.guildId);
		if (!onWhiteList) {
			
			return await interaction.reply({ content: `This guild is not on the Whitelist, if this is a mistake contact momo.`, flags: MessageFlags.Ephemeral });
		}

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		// Check the command Cooldowns
		const { cooldowns } = interaction.client;
		// check if the command has a Collection made for it
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 2;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
		// check if the user is in the timestamps Collection for this command
		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			// check if the users still has a cooldown for this command
			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral
				})
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral
				});
			}
		}
	},
};