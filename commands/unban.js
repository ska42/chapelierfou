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
module.exports = class Unban extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'forceban
    * 'prefix'forceban id/@mention [reason]
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"unban")
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
            /* id ou mention de la victime */
            let victim = args[1];

            /* Si "victim" est bien un nombre entier */
            if(Number.isInteger(parseInt(victim))){
                  message.guild.unban(victim)
                    .then(user => Success.unban(user.tag, user.id, message))
                    .catch(error => Error.notBanned(message.channel, victim))

            } else {

               Error.unbanError(message.channel)

            }
          } else {

            Error.noPermission(message.channel)

          }

  }

}
