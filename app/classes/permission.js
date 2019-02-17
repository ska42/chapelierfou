const config = require("@config")

const idBots = config.roles.idBots
const idHelper = config.roles.idHelper
const idModerator = config.roles.idModerator
const idAdministrator = config.roles.idAdministrator
const idOwner = config.idOwner

/**
  * Classe checkant les permissions d'un membre
  */
module.exports = class Permission {

  //Retourne vrai si le membre est la victime, faux sinon.
  static isSamePerson(member, victimId){
    if(member.id == member.guild.members.get(victim).id){
      return true
    }
    return false
  }

  // Retourne vrai si le membre a le même role que sa victime, faux sinon.
  static hasSameRole(member, victimId){
    if(member.highestRole.comparePositionTo(member.guild.members.get(victimId).highestRole)==0){
      return true
    }
    return false
  }

  // Retourne vrai si le membre a un rôle moins élevé que sa victime, faux sinon.
  static hasLowerRole(member, victimId){
    if(member.highestRole.comparePositionTo(member.guild.members.get(victimId).highestRole)<0){
      return true
    }
    return false
  }

  // Retourne vrai si le membre a un rôle plus haut que sa victime, faux sinon.
  static hasHigherRole(member, victimId){
    if(member.highestRole.comparePositionTo(member.guild.members.get(victimId).highestRole)>0){
      return true
    }
    return false
  }

  // Retourne vrai si le membre est "Bots", faux sinon.
  static isBot(member){
    if(member.roles.get(idBots)!=null){
      return true
    }
    return false
  }

  // Retourne vrai si le membre est "helper", faux sinon.
  static isHelper(member){
    if(member.roles.get(idHelper)!=null){
      return true
    }
    return false
  }

  // Retourne vrai si le membre est "modérateur", faux sinon.
  static isModerator(member){
    if(member.roles.get(idModerator)!=null){
      return true
    }
    return false
  }

  // Retourne vrai si le membre est "administrateur", faux sinon.
  static isAdministrator(member){
    if(member.roles.get(idAdministrator)!=null){
      return true
    }
    return false
  }

  // Retourne vrai si le membre est "owner", faux sinon.
  static isOwner(member){
    if(member.id==idOwner){
      return true
    }
    return false
  }

}
