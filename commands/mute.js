const Discord = require('discord.js')
const Command = require('./command')
const config = require("../config.json")

/* Classes */
const Report = require('../classes/report')
const Permission = require('../classes/permission')
const Success = require('../classes/success')
const Error = require('../classes/error')
const SendMessage = require('../classes/sendMessage')

/**
  * Classe représentant commande de Mute pour affecter le role "Muted" a un membre
  * @extends Command
  */
module.exports = class Mute extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'mute
    * 'prefix'mute id/@mention [reason]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"mute");
  }

  /**
    * Lance "l'action" mute de la commande
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

          /* Raison du mute */
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
                message.guild.members.get(victim).addRole(config.roles.idMuted)
                Report.mute(user, message.author, reason, bot)

                if(reason=="Aucune."){
                  SendMessage.mute(message.guild.members.get(victim))
                    .then(() => Success.mute(user.tag, victim, reason, message), () => Error.memberDM(message.channel))
                } else {
                  SendMessage.mute(message.guild.members.get(victim), reason)
                    .then(() => Success.mute(user.tag, victim, reason, message), () => Error.memberDM(message.channel))
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

            Error.muteError(message.channel)

          }
        } else {

          Error.noPermission(message.channel)

        }

  }

}
