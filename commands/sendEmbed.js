const Discord = require('discord.js')
const Command = require('./command')
const config = require("../config.json")

module.exports = class SendEmbed extends Command {

  static match (message) {
    return message.content.startsWith(config.prefix+"sendEmbed");
  }

  static action (message, bot, sql) {
    let args = message.content.split('"')
    var embed = new Discord.RichEmbed()
        .addField(args[1], args[2])
    embed.setColor('AQUA')
    message.channel.send({embed})
  }

}
