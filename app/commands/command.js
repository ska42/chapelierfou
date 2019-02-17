/**
  * Classe représentant une commande
  */
module.exports = class Command {

  /**
    * Vérifie que la commande correspond bien au message, si c'est le cas, lance "l'action" de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static parse (message, bot, sql) {
    if(this.match(message)) {
      this.action(message, bot, sql)
      return true;
    }
    return false;
  }

  /**
    * Vérifie que la commande correspond bien au message
    * @param {Message} message - Message de la commande
    */
  static match (message) {
    return false;
  }

  /**
    * Action de la commande
    * @param {Message} message - Message de la commande
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  static action (message, bot, sql) {

  }

}
