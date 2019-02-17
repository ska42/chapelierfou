/**
  * Classe représentant un jeu
  */
module.exports = class Game {

  /**
    * Constructeur Game
    * @param {Channel} channel - Channel ou a été lancé le jeu
    * @param {GuildMember[]} players - Tableau des participants au jeu
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  constructor(channel, players, bot, sql) {
     this.channel = channel
     this.players = players
     this.bot = bot
     this.sql = sql
  }

}
