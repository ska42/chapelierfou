const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Classes */
const Report = require('@classes/report')
const Permission = require('@classes/permission')
const Success = require('@classes/success')
const Error = require('@classes/error')
const SendMessage = require('@classes/sendMessage')

/**
  * Classe représentant commande de Unmute qui retire le role "Muted"
  * @extends Command
  */
module.exports = class Unmute extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'tictactoe
    * 'prefix'unmute id/@mention
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"unmute");
  }

  /**
    * Lance "l'action" Unmute de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

        /* Si l'utilisateur de la commande est Owner, ou qu'il est Admin ou Modérateur ou Helper */
        if(Permission.isOwner(message.member) ||
           Permission.isHelper(message.member) ||
           Permission.isAdministrator(message.member) ||
           Permission.isModerator(message.member)) {

          let args = message.content.split(' ')
          /* id ou mention de la victime */
          let victim = args[1]

          if(victim != null){
            /* Récupérer la première mention et la transformer en id */
            if(message.mentions.users.array().length > 0 & victim.charAt(1)=='@'){
              victim = message.mentions.users.first().id
            }
          }

          /* Si "victim" est bien un nombre entier */
          if(Number.isInteger(parseInt(victim))){

            /* Si un utilisateur "victim" existe bel et bien */
            if(message.guild.members.get(victim) != null){

              /* Si l'utilisateur a un rôle plus élevé que sa victime */
              if(Permission.hasHigherRole(message.member, victim) || Permission.isOwner(message.member)){

                let user = message.guild.members.get(victim).user
                if(message.guild.members.get(victim).roles.get(config.roles.idMuted)){

                  message.guild.members.get(victim).removeRole(config.roles.idMuted)

                  Report.unmute(user, message.author, bot)

                  SendMessage.unmute(message.guild.members.get(victim))
                    .then(() => Success.unmute(user.tag, victim, message), () => Error.memberDM(message.channel))

                } else {

                  Error.notMuted(message.channel)

                }

              } else {

                if(Permission.hasLowerRole(message.member, victim)) {

                  Error.rankTooHigh(message.channel)

                } else {

                  if(Permission.isSamePerson(message.member, victim)) {

                    Error.notOnYou(message.channel)

                  } else {

                    Error.sameRank(message.channel)

                  }

                }

              }

            } else {

              Error.memberIdNotFound(message.channel, victim)

            }
          } else {

            Error.unmuteError(message.channel)

          }
        } else {

          Error.noPermission(message.channel)

        }

  }

}
