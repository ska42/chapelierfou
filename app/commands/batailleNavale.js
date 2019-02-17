const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Games */
const Battleship = require("@games/battleship/battleship")

/* Classes */
const Error = require('@classes/error')

/**
  * Classe représentant commande de ping
  * @extends Command
  */
module.exports = class BatailleNavale extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'ping
    * 'prefix'ping
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"bataille_navale");
  }

  /**
    * Lance "l'action" ping de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {
    if ( message.channel.id == config.channels.idBattleship ) {
      var bataille = new Battleship(message.channel, new Array(), bot, sql)
    } else {
      Error.wrongChannelBattleship(message.channel)
    }
  }

}
