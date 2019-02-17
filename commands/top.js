const Command = require('./command');
const config = require("../config.json")

/* SQL */
const SQLite = require("better-sqlite3")

/**
  * Classe représentant commande de top pour connaître les tops mmr
  * @extends Command
  */
module.exports = class top extends Command {

  /**
    * Vérifie que la commande correspond bien au message 'prefix'top
    * 'prefix'top
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return message.content.startsWith(config.prefix+"top");
  }

  /**
    * Lance "l'action" top de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {
    var string = '```md\n'
    +'📋 Classement | Tag | MMR\n\n'

    /* Récupère les points mmr de tout le monde par ordre de mmr décroissante */
    let request = sql.prepare("SELECT * FROM mmr ORDER BY points DESC;").all()

    for (let i = 0; i < 10; i++) {
      let member = message.guild.members.get(request[i].id)
      if(member == undefined){
        string+='['+(i+1)+'](@'+request[i].id+')\n'
      } else {
        string+='['+(i+1)+']('+member.user.tag+')\n'
      }
      string+='>  Points: '+Math.round(request[i].points*100)/100+'\n\n'
    }

    var index = request.findIndex(function(item, i){
      return item.id == message.author.id
    });
    string+='-------------------------------------\n'
    +'> Votre place actuel :\n'
    +'Classement: <'+(index+1)+'>       MMR: <'+Math.round(request[index].points*100)/100+'>\n'
    +'```'

    message.channel.send(string)
  }

}
