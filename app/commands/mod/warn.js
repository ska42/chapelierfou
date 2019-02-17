const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Classes */
const Report = require('@classes/report')
const Permission = require('@classes/permission')
const Success = require('@classes/success')
const Error = require('@classes/error')

/**
  * Classe représentant commande de Warn qui averti par mp un membre
  * @extends Command
  */
module.exports = class Warn extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'warn
    * 'prefix'warn id/@mention [message]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"warn");
  }

  /**
    * Lance "l'action" Warn de la commande
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

          let reason_args = args.slice(0);
          reason_args.splice(0, 2)

          /* Raison du warn */
          let reason
          if(reason_args.length > 0) {
            reason = reason_args.join(' ')
          } else {
            reason = "Aucune."
          }

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
                Report.warn(user, message.author, reason, bot)
                message.guild.members.get(victim).send('⚠️ Vous avez reçu un avertissement sur '+message.guild.name+': `'+reason+'`')
                  .then(() => Success.warn(user.tag, victim, reason, message), () => Error.memberDM(message.channel))

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

            Error.warnError(message.channel)

          }
        } else {

          Error.noPermission(message.channel)

        }

  }

}
