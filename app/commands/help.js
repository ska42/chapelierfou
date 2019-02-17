const config = require("@config")

/* Commands */
const Command = require('@commands/command')

/* Classes */
const Permission = require('@classes/permission')

/**
  * Classe représentant commande de help
  * @extends Command
  */
module.exports = class Help extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'ping
    * 'prefix'ping
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"help");
  }

  /**
    * Lance "l'action" help de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

    var string = '```md\n'
    +'# Informations\n'
    +'```\n'
    +'**prefix** : '+config.prefix+'\n'
    +'```md\n'
    +'# Commandes standard\n'
    +'```\n'
    +'**help** - Donne un aperçu de toutes les commandes disponibles.\n'
    +'**ping** - Donne le ping du bot en ms\n'
    +'**mmr** [id/@mention] - Donne le mmr actuel de la cible\n'
    +'**top** - Affiche le top 10 actuel mmr du serveur\n'
    +'```md\n'
    +'# Jeux\n'
    +'```\n'
    +'**bataille_navale** - Lance une partie de bataille navale !\n'
    +'**tictactoe** id/@mention - Lance une partie de tictactoe contre la cible\n'

    if ( Permission.isOwner(message.member) ||
         Permission.isHelper(message.member) ||
         Permission.isAdministrator(message.member) ||
         Permission.isModerator(message.member) ){
              string+='```md\n'
              +'# Modération\n'
              +'```\n'
              +'**mute** id/@mention [raison] - Affecte le rôle "Muted" à la cible et lui envoi un message privé pour la notifier\n'
              +'**unmute** id/@mention - Retire le rôle "Muted" de la cible et la notifie par message privé\n'
              +'**warn** id/@mention raison - Averti la cible par message privé avec la raison\n'
    }

      if ( Permission.isOwner(message.member) ||
           Permission.isAdministrator(message.member) ||
           Permission.isModerator(message.member) ){
                string+='**ban** id/@mention [raison] - Banni la cible\n'
                +'**forceban** id [raison] - Force le bannissement de la cible, même si elle n\'est plus sur le serveur (uniquement par id)\n'
                +'**unban** id - Débanni la cible.\n'
                +'**kick** id/@mention [raison] - Expulse la cible du serveur\n'
                +'**purge** - Expulse toutes les personnes qui ont uniquement le rôle everyone\n'
      }

      if ( Permission.isOwner(message.member) ||
           Permission.isAdministrator(message.member) ){
                string+='**send** id/#mention message - Envoi le message dans le salon ciblé via le bot'
      }

      message.channel.send(string)

  }

}
