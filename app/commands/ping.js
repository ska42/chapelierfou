const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/**
  * Classe représentant commande de ping
  * @extends Command
  */
module.exports = class Ping extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'ping
    * 'prefix'ping
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"ping");
  }

  /**
    * Lance "l'action" ping de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {
    message.channel.send('Pong ! **'+Math.round(bot.ping*100)/100+'** ms.')
  }

}
