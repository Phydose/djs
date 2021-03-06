module.exports = {
	name: 'messageCreate',
	execute(message) {
		(async () => {
			const CooldownDB = require('simple-json-db');
const cooldb = new CooldownDB(rootPATH + "/Access Files/Storage/Database/cooldown.json", {
asyncWrite: true,
syncOnWrite: true,
jsonSpace: 2
    })
			const { Collection, MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js')
			const { client } = require(rootPATH + "/bot")
			const prefix = client.config.prefix
if (!message.content.toString().startsWith(prefix)) return;
const cmd = message.content.toString().slice(prefix.length).trim().split(" ")[0]
if (!cmd) return;
let command = client.commands.get(cmd)
if (!command) command = client.commands.get(client.aliases.get(cmd));
if (command) {
    let args = message.content.slice(prefix.length).trim()
    if (args.startsWith(command.name)) args = args.slice(command.name.toString().length).trim().split(" ")
    else args = args.slice(command.aliases.toString().length).trim().split(" ")

    // Cooldown Handler
    if (command.cooldown) {
        let time = command.cooldown
        let id = message.author.id
        let date = Date.now()
        let data = cooldb.get(`${id}.${command.name}.cooldown`)
        if (isNaN(time)) throw new Error ("Invalid number in cooldown provided at " + command.name)
        if(Math.floor(date - data) >= time || !data) {
cooldb.set(`${id}.${command.name}.cooldown`, date)
command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
} else {
	const embed = new MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true }))
.setTimestamp()
.setColor("RANDOM")
.setDescription(`You are currently at cooldown for this command until <t:${Math.floor(Math.floor(data + time) / 1000)}:F>`)
	message.channel.sendEmbed(embed)
	}
    }

    // OwnerOnly Handler
    else if (command.ownerOnly) {
        if (message.author.id === client.config.dev) command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
        else {
            const ownerOnlyHandler = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("?????????This command is to be used by the developers / owners of the bot only!");
            message.channel.sendEmbed(ownerOnlyHandler)
        }
    }

    // User Permission Handler
    else if (command.permissions && Array.isArray(command.permissions)) {
        let user = message.member
        let perms = command.permissions
        let check = 0
        let missingPerm = []
        perms.forEach(i => {
            if (user.permissions.has(i)) check++
            else missingPerm.push(`\n??? ${i}`)
        })
        if (check === perms.length) command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
        else {
            const permHandler = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("?????????You are currently missing these permissions which are required for this command.")
                .setDescription(`${missingPerm}`)
            message.channel.sendEmbed(permHandler)
        }
    }
    
    // Client Permission Handler
    else if (command.clientPermissions && Array.isArray(command.clientPermissions)) {
        let user = message.guild.me
        let perms = command.clientPermissions
        let check = 0
        let missingPerm = []
        perms.forEach(i => {
            if (user.permissions.has(i)) check++
            else missingPerm.push(`\n??? ${i}`)
        })
        if (check === perms.length) command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
        else {
        	if (user.permissions.has("SEND_MESSAGES")) {
            const permHandler = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("?????????I am currently missing these permissions which are required for this command.")
                .setDescription(`${missingPerm}`)
            message.channel.sendEmbed(permHandler)
            } else console.log("?????????I am currently missing these permissions which are required for this command." + missingPerm)
        }
    }

    // GuildOnly Handler
    else if (command.guildOnly === false) {
        command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
    } 
      
      // allowBots Handler
    else if (command.allowBots) {
        command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
    } else {
        // If none of the handlers are there.
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.member) message.member = await message.guild.fetchMember(message);
        command.run(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton)
    }
}
})()
   }
}