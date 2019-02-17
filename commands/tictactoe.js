const Command = require('./command')
const config = require("../config.json")

/* Classes */
const Error = require('../classes/error')

/* Game */
const GameTicTacToe = require('../games/GameTicTacToe')

/**
  * Classe représentant commande de TicTacToe qui créer une partie de TicTacToe
  * @extends Command
  */
module.exports = class Tictactoe extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'tictactoe
    * 'prefix'tictactoe id/@mention
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"tictactoe");
  }

  /**
    * Lance "l'action" TicTacToe de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {
    if(message.channel.id == '541724065375715328'){
      let player1 = message.member

      let args = message.content.split(' ')
      /* id ou mention du joueur 2 */
      let idplayer2 = args[1]

      if(idplayer2 != null) {
        /* Récupérer la première mention et la transformer en id */
        if(message.mentions.users.array().length > 0 & idplayer2.charAt(1)=='@'){
          idplayer2 = message.mentions.users.first().id
        }
      }

      /* Si "victim" est bien un nombre entier */
      if(Number.isInteger(parseInt(idplayer2))) {

        if(bot.guilds.get(config.idGuild).members.get(idplayer2) != null) {

          let player2 = bot.guilds.get(config.idGuild).members.get(idplayer2)
          let tictactoe = new GameTicTacToe(message.channel, [player1, player2], bot, sql)

        } else {

          Error.memberIdNotFound(message.channel, idplayer2)

        }

      } else {

        Error.tictactoeError(message.channel)

      }

    } else {

      Error.wrongChannelTicTacToe(message.channel)

    }

  }

}
