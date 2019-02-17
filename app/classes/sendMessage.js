const config = require("@config")

/**
  * Classe permettant d'envoyer un message privé
  */
module.exports = class SendMessage {

  static mute (member, reason = null) {
    if ( reason == null ) {
      return member.send('😶 Vous avez été mute sur '+member.guild.name+'.')
    } else {
      return member.send('😶 Vous avez été mute sur '+member.guild.name+': `'+reason+'`')
    }
  }

  static unmute (member) {
    return member.send('😮 Vous avez été unmute sur '+member.guild.name+'.')
  }

}
