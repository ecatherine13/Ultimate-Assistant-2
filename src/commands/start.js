// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'start', 
	aliases: [], 
	description: 'Assigns the start channel role to all players with characters', 
	usage: ' ', 
	category: 'Map', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// get characters
		let player_ids = utils.fn.get_guild_chars(message.guild).map((char_entry) => char_entry.OwnerID);

		// get the starting channel role ID (check not null)
		let starting_channel_role_id = utils.fn.get_guild_entry(message.guild.id).EntryChannelRoleID;

		if (!starting_channel_role_id)
		{
			throw `No starting channel set for ${message.guild}! Add one with \`!ssp #channel-tag\``;
		}

		// Get role obj
		// var role_obj = message.guild.roles.find((role) => role.id == starting_channel_role_id);

		// if (!role_obj)
		// {
		// 	throw `Something went wrong! Did you delete the role associated with your starting channel?`;
		// }

		// Assign to all players if possible
		let player_names = [];
		for (player_id of player_ids)
		{
			player_obj = message.guild.members.find((member) => member.id == player_id);

			try
			{
				await player_obj.addRole(starting_channel_role_id);
			}
			catch
			{
				await message.channel.send(`Could not assign role to ${player_id}! Check bot permissions and membership of that user`);
				continue;
			}

			// Add name for printing
			player_names.push(player_obj.user.username);
		}

		return await message.channel.send(`Assigned starting role to ${player_names.join(", ")}`);

	}
}