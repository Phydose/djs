module.exports = {
    name : 'ping',
    run : async(client, message, args, MessageEmbed) => {
        const ping = new MessageEmbed()
	.setColor('RANDOM')
	.setTimestamp()
        .setTitle('🏓╎Pong!')
	.setDescription('🏠╎Websocket Latency:' + " " + client.ws.ping + "ms" + '\n🤖╎Bot Latency:' + " " + `${Date.now() - message.createdTimestamp}` + "ms");
	message.channel.sendEmbed(ping)
    }
}
