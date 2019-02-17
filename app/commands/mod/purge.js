const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Classes */
const Report = require('@classes/report')
const Permission = require('@classes/permission')
const Success = require('@classes/success')
const Error = require('@classes/error')

/**
  * Classe représentant commande de kick pour expulser un membre du serveur
  * @extends Command
  */
module.exports = class Purge extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'kick
    * 'prefix'kick id/@mention [reason]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"purge")
  }

  /**
    * Lance "l'action" kick de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

    /* Si l'utilisateur de la commande est Owner, ou qu'il est Admin ou Modérateur */
    if(Permission.isOwner(message.member) ||
       Permission.isAdministrator(message.member) ||
       Permission.isModerator(message.member)) {

         var i = 0

         bot.guilds.get(config.idGuild).members.forEach( function (member) {
           if ( member.highestRole.id == config.roles.idEveryone ) {
             member.kick("Purge")
             Report.kick(user, bot.user, "Purge", bot)
             i++
           }
         })

         Success.purge(i, message)

    } else {

      Error.noPermission(message.channel)

    }

  }

}
