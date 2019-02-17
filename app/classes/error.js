const config = require("@config")

/**
  * Classe représentant les erreurs d'une commande
  */
module.exports = class Error {

  static notMuted(channel){
    channel.send('L\'utilisateur n\'est pas mute.')
  }

  static memberDM(channel){
    channel.send('L\'utilisateur a désactivé ses messages privés.')
  }

  static rankTooHigh(channel){
    channel.send('Vous ne pouvez pas utiliser cette commande sur une personne avec un rang plus élevé.')
  }

  static sameRank(channel){
    channel.send('Vous ne pouvez pas utiliser cette commande sur une personne avec un rang équivalent.')
  }

  static notOnYou(channel){
    channel.send('Ce monde est peuplé de fou, mais de la à vouloir utiliser cette commande sur vous même, c\'est idiot.')
  }

  static noPermission(channel){
    channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
  }

  static memberIdNotFound(channel, id){
    channel.send('L\'utilisateur avec l\'id `'+id+'` n\'existe pas ou n\'est plus ici.')
  }

  static wrongChannelTicTacToe(channel){
    channel.send('Merci d\'utiliser cette commande dans le channel <#'+config.channels.idTicTacToe+'>.')
  }

  static wrongChannelBattleship(channel){
    channel.send('Merci d\'utiliser cette commande dans le channel <#'+config.channels.idBattleship+'>.')
  }

  static timeOut(channel){
    channel.send('Le délai d\'attente a été dépassé..')
  }

  static alreadyTaken(channel){
    channel.send('La case que vous tentez de viser est déjà prise.')
  }

  static notBanned(channel, id){
    channel.send('L\'utilisateur avec l\'id `'+id+'` n\'est pas banni ou n\'existe pas.')
  }

  /** Erreurs de Commandes **/

  static banError(channel){
    channel.send('Erreur de commande - ban : \n `'+config.prefix+'ban id/@mention [reason]`')
  }

  static forcebanError(channel){
    channel.send('Erreur de commande - ban : \n `'+config.prefix+'forceban id [reason]`')
  }

  static unbanError(channel){
    channel.send('Erreur de commande - unban : \n `'+config.prefix+'unban id`')
  }

  static kickError(channel){
    channel.send('Erreur de commande - kick : \n `'+config.prefix+'kick id/@mention [reason]`')
  }

  static warnError(channel){
    channel.send('Erreur de commande - warn : \n `'+config.prefix+'warn id/@mention [reason]`')
  }

  static muteError(channel){
    channel.send('Erreur de commande - mute : \n `'+config.prefix+'mute id/@mention [reason]`')
  }

  static unmuteError(channel){
    channel.send('Erreur de commande - unmute : \n `'+config.prefix+'unmute id/@mention`')
  }

  static sendError(channel){
    channel.send('Erreur de commande - send : \n `'+config.prefix+'send #mention/id_channel content`')
  }

  static tictactoeError(channel){
    channel.send('Erreur de commande - tictactoe : \n `'+config.prefix+'tictactoe @mention/id `')
  }

  static mmrError(channel){
    channel.send('Erreur de commande - mmr : \n `'+config.prefix+'mmr [@mention/id] `')
  }

  static setError(channel){
    channel.send('Erreur de commande -set : \n `'+config.prefix+'set colonne ligne` - exemple : `'+config.prefix+' set a 1`')
  }

  static viseError(channel){
    channel.send('Erreur de commande -vise : \n `'+config.prefix+'vise colonne ligne` - exemple : `'+config.prefix+' vise a 1`')
  }

}
