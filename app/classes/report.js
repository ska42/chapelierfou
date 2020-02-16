const config = require("@config")

const idStaffReports = config.channels.idStaffReports

/**
  * Classe représentant le report d'une commande dans le chan StaffReports
  */
module.exports = class Report {

  static warn (victim, staff, reason, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' ⚠️'+victim.tag +'(`'+victim.id+'`) a été averti par **'+staff.tag+'** (`'+staff.id+'`): `'+reason+'`.')
  }

  static kick (victim, staff, reason, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 💣'+victim.tag +'(`'+victim.id+'`) a été kick par **'+staff.tag+'** (`'+staff.id+'`): `'+reason+'`.')
  }

  static censored(victim, channel, content, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 🚫 Message censuré de '+victim.tag +'(`'+victim.id+'`) dans #'+channel.name+'(`'+channel.id+'`) :\n'
      +'```\n'
      +content+'\n'
      +'```')
  }

  static automute (victim, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 😶'+victim.tag +'(`'+victim.id+'`) a été mute automatiquement pour "pub".')
  }

  static mute (victim, staff, reason, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 😶'+victim.tag +'(`'+victim.id+'`) a été mute par **'+staff.tag+'** (`'+staff.id+'`): `'+reason+'`.')
  }

  static unmute (victim, staff, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 😮'+victim.tag +'(`'+victim.id+'`) a été unmute par **'+staff.tag+'** (`'+staff.id+'`).')
  }

  static ban (user, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 🚨'+user.tag +'(`'+user.id+'`) a été banni.')
  }

  static forceban (id, staff, reason, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 🚨 <@'+id +'> (`'+id+'`) a été banni par **'+staff.tag+'** (`'+staff.id+'`): `'+reason+'`.')
  }

  static unban (user, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' 🕵️ '+user.tag+' (`'+user.id+'`) a été débanni.')
  }

  static error (error, bot) {
    bot.guilds.get(config.idGuild).channels.get(idStaffReports).send(this.timerString(new Date())+' '+console.log(error))
  }

  static timerString (today) {
    var string = '`['+this.getHours(today)+':'+this.getMinutes(today)+':'+this.getSeconds(today)+']`'
    return string
  }

  static getHours (today) {
    var hours = today.getHours()
    if (hours<10) {hours = "0" + hours}
    return hours
  }

  static getMinutes (today) {
    var minutes = today.getMinutes()
    if (minutes<10) {minutes = "0" + minutes}
    return minutes
  }

  static getSeconds (today) {
    var seconds = today.getSeconds()
    if(seconds<10) {seconds = "0" + seconds}
    return seconds
  }

}
