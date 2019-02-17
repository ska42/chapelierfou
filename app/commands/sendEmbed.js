const Discord = require('discord.js')
const config = require("@config")

/* Commands */
const Command = require('@commands/command')

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
