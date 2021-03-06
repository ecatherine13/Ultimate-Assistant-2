const utils = require('../utils.js');

module.exports = 
{
	name: 'go', 
	aliases: [], 
	description: 'Go to a connected channel. Use the name or the tag', 
	usage: '<channel-name / tag>', 
	examples: ["!go lobby", "!go #lobby"], 
	category: 'Map', 
	args: 1, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		const message_member = await utils.fn.get_message_member(message);
		
		// console.log(message_member);

		// Check for regex
		try
		{
			let outgoing_channel_id = args[0].match(/<#([0-9]*)>/)[1];
			var outgoing_channel = message.guild.channels.cache.find((channel) => channel.id == outgoing_channel_id);
		}
		catch 
		{
			var outgoing_channel = utils.fn.get_closest_channel_match(message.guild, args.join(" "));
		}

		
		// get guild map
		let guild_map = utils.fn.get_guild_map(message.guild.id);
		let guild_map_role_ids = guild_map.map((entry) => entry.RoleID);

		// check user role to see if one is in the map
		let member_map_role = message_member.roles.cache.find((role) => guild_map_role_ids.includes(role.id));

		// console.log(member_map_role);

		if (!member_map_role)
		{
			throw `You do not have any map roles assigned to you!`;
		}

		let connecting_channel_ids = guild_map.find((entry) => entry.RoleID == member_map_role.id).OutgoingConnections;

		console.log(connecting_channel_ids);

		if (!connecting_channel_ids.includes(outgoing_channel.id))
		{
			throw `Your current location does not connect to ${outgoing_channel}!`;
		}

		// Swap the roles
		let new_role_id = guild_map.find((entry) => entry.ChannelID == outgoing_channel.id).RoleID;

		try
		{
			message_member.roles.add(new_role_id).then().catch(console.error);
		}
		catch
		{
			throw `Could not assign role to ${player_obj.username}! Check bot permissions and membership of that user`;
		}
		
		try
		{
			message_member.roles.remove(member_map_role.id).then().catch(console.error);
		}
		catch
		{
			throw `Could not remove role from ${player_obj.username}! Check bot permissions and membership of that user`;
		}
	}
}