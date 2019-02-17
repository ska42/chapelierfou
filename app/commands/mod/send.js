const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Classes */
const Permission = require('@classes/permission')
const Success = require('@classes/success')
const Error = require('@classes/error')

/**
  * Classe représentant commande de send qui envoi un message dans un ceratin channel
  * @extends Command
  */
module.exports = class Send extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'send
    * 'prefix'send id/#mention message
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"send");
  }

  /**
    * Lance "l'action" send de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

    if(Permission.isOwner(message.member) ||
       Permission.isAdministrator(message.member)) {

      let args = message.content.split(' ')
      /* Si le message contient la mention du channel, récupère la mention et la transforme en id */
      if(message.mentions.channels.array().length > 0 & args[1].charAt(1)=='#'){
        args[1] = message.mentions.channels.first().id
      }
      let id_channel = args[1]

      if(Number.isInteger(parseInt(args[1]))) {

        let id_channel = args[1]
        /* Isole et récupère le message */
        let content_args = args.slice(0)
        content_args.splice(0, 2)
        let content
        if(content_args.length > 0) {
          content = content_args.join(' ')
          /* Envoi le message */
          let channel = message.guild.channels.get(id_channel)
          channel.send(''+content)
          Success.send(channel, content, message)

        } else {

          Error.sendError(message.channel)

        }

      } else {

        Error.sendError(message.channel)

      }

    } else {

      Error.noPermission(message.channel)

    }

  }

}
