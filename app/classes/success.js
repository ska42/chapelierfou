/**
  * Classe représentant le succès d'une commande
  */
module.exports = class Success {

  static warn (tag, id, reason, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été averti (`'+reason+'`) :warning:')
  }

  static kick (tag, id, reason, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été expulsé (`'+reason+'`) <a:FBI:533391336573763614>')
  }

  static mute (tag, id, reason, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été mute (`'+reason+'`) :mute:')
  }

  static unmute (tag, id, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été unmute :open_mouth:')
  }

  static ban (tag, id, reason, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été banni (`'+reason+'`) <a:YoshiHammer:517363494337904640>')
  }

  static forceban(id, reason, message) {
    message.channel.send('👌 '+id+' (`'+id+'`) a été banni (`'+reason+'`) <a:YoshiHammer:517363494337904640>')
  }

  static unban(tag, id, message) {
    message.channel.send('👌 '+tag+' (`'+id+'`) a été débanni. :spy:')
  }

  static send(channel, content, message) {
    message.channel.send('👌 Message : `'+content+'` a bien été envoyé dans <#'+channel.id+'> <a:wave:525817586982584330>')
  }

}
