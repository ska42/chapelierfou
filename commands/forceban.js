const Discord = require('discord.js')
const Command = require('./command')
const config = require("../config.json")

/* Classes */
const Report = require('../classes/report')
const Permission = require('../classes/permission')
const Success = require('../classes/success')
const Error = require('../classes/error')

/**
  * Classe représentant commande de forceban (ban par id d'une personne n'étant pas forcément sur le serveur)
  * @extends Command
  */
module.exports = class Forceban extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'forceban
    * 'prefix'forceban id/@mention [reason]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"forceban")
  }

  /**
    * Lance "l'action" forceban de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

    /* Si l'utilisateur de la commande est Owner, ou qu'il est Admin ou Modérateur */
    if(Permission.isOwner(message.member) ||
       Permission.isAdministrator(message.member) ||
       Permission.isModerator(message.member)) {

      let args = message.content.split(' ')
      /* id de la victime */
      let victim = args[1];

      let reason_args = args.slice(0)
      reason_args.splice(0, 2)

      /* Raison du ban */
      let reason
      if(reason_args.length > 0) {
        reason = reason_args.join(' ')
      } else {
        reason = "Aucune."
      }

      /* Si "victim" est bien un nombre entier */
      if(Number.isInteger(parseInt(victim))){

        /* Si un utilisateur "victim" existe bel et bien */
        if(message.guild.members.get(victim) != null){

          /* Si l'utilisateur a un rôle plus élevé que sa victime */
          if(Permission.hasHigherRole(message.member, victim) || Permission.isOwner(message.member)) {

            Report.forceban(victim, message.author, reason, bot)
            message.guild.ban(victim, reason)
            Success.forceban(victim, reason, message)

          } else {

            if(Permission.hasLowerRole(message.member, victim)) {

              Error.rankTooHigh(message.channel)

            }  else {

              if(Permission.isSamePerson(message.member, victim)) {

                Error.notOnYou(message.channel)

              } else {

                Error.sameRank(message.channel)

              }

            }

          }

        } else {

          Report.forceban(victim, message.author, reason, bot)
          message.guild.ban(victim, reason)
          Success.forceban(victim, reason, message)

        }

      } else {

         Error.forcebanError(message.channel)

      }
    } else {

      Error.noPermission(message.channel)

    }

  }

}
