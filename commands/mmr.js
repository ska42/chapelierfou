const Command = require('./command');
const config = require("../config.json")

/* SQL */
const SQLite = require("better-sqlite3")

/* Classes */
const Error = require('../classes/error')

/**
  * Classe représentant commande de mmr pour voir le mmr dans la base de donnée d'un membre
  * @extends Command
  */
module.exports = class Mmr extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'mmr
    * 'prefix'mmr [id/@mention]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"mmr");
  }

  /**
    * Lance "l'action" mmr de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

    let args = message.content.split(' ')
    /* Si l'args[1] est une mention, la transforme en id, si il n'y a pas de mention, l'id est celle de l'auteur */
    if (message.mentions.members.array().length > 0){
      if(args[1].charAt(1)=='@'){
        args[1] = message.mentions.members.first().id
      }
    } else {
      if(args[1] == null) {
        args[1] = message.author.id
      }
    }
    /* id de la personne a qui regarder le mmr */
    let id = args[1]

    if(Number.isInteger(parseInt(id))) {

      if(bot.guilds.get(config.idGuild).members.get(id) != null) {

        /* Récupère les points mmr de l'utilisateur id */
        let request = sql.prepare("SELECT * FROM mmr WHERE id='"+id+"';").get()

        /* Envoi le tag de l'utilisateur dans le channel */
        let tag = bot.guilds.get(config.idGuild).members.get(id).user.tag
        message.channel.send(tag+" : **"+Math.round(request.points*100)/100+"** mmr")

      } else {

        Error.memberIdNotFound(message.channel, id)

      }

    } else {

      Error.mmrError(message.channel)

    }

  }

}
