require('module-alias/register')
const Discord = require('discord.js')
const bot = new Discord.Client()
const config = require("@config")

/* SQL */
const SQLite = require("better-sqlite3")
const sql = new SQLite('./mmr.sqlite')

/* Commandes */
const Ping = require('@commands/ping')
const SendEmbed = require('@commands/sendEmbed')
const Kick = require('@commands@commands/kick')
const Send = require('@commands/send')
const Ban = require('@commands/ban')
const Forceban = require('@commands/forceban')
const Unban = require('@commands/unban')
const Warn = require('@commands/warn')
const Mute = require ('@commands/mute')
const Unmute = require ('@commands/unmute')
const Tictactoe = require ('@commands/tictactoe')
const Mmr = require ('@commands/mmr')
const Top = require ('@commands/top')
const BatailleNavale = require('@commands/batailleNavale')

/* Classes */
const Permission = require('@classes/permission')
const Report = require('@classes/report')

/* Quand le bot a démarré */
bot.on('ready', function () {
  /* Définir l'activité du bot */
  bot.user.setActivity('le monde brûler', { type: 'WATCHING' }).catch(console.error)

  /* -- BDD -- */
  /* Regarde si la table "mmr" existe */
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'mmr';").get()
  if (!table['count(*)']) {
    /* Si la table n'existe pas, la créé et la setup. */
    sql.prepare("CREATE TABLE mmr (id TEXT PRIMARY KEY, points REAL);").run()

    /* Initialisation de tous les membres de la guilde */
    let members = bot.guilds.get(config.idGuild).members
    /* Met 'startingPoints' points à tous les membres */
    members.forEach(function(member, id){
      if(!member.user.bot){
        sql.prepare("INSERT INTO mmr VALUES ('"+member.user.id+"', "+config.mmr.startingPoints+");").run()
      }
    })
  }

  /* Toutes les 'timer' minutes, enlève 'loosingPoints' points de mmr à tout le monde, met 'vocalPoints' points aux joueurs en vocal */
  setInterval(function(){
    let members = bot.guilds.get(config.idGuild).members
    members.forEach(function(member, id){
      if(!member.user.bot){
        sql.prepare("UPDATE mmr SET points = points-"+config.mmr.loosingPoints+" WHERE id='"+id+"';").run()
      }
    })
    let channels = bot.guilds.get(config.idGuild).channels
    channels.forEach(channel => {
      if(channel.type == 'voice'){
        let members = channel.members
        members.forEach(function(member, id){
          if(!member.user.bot){
            sql.prepare("UPDATE mmr SET points = points+"+config.mmr.vocalPoints+" WHERE id='"+id+"';").run()
          }
        })
      }
    })
  }, config.mmr.timer)
})

/* Quand un message est envoyé dans un channel dont le bot a accès */
bot.on('message', function(message) {
  /* Ajoute 'multiplierPerCharacter' points par caractères du message au mmr du membre */
  if(!message.author.bot){
    sql.prepare("UPDATE mmr SET points = points+"+message.content.length*config.mmr.multiplierPerCharacter+" WHERE id='"+message.author.id+"';").run()
  }

  /* Si le message est une commande commençant par le 'prefix' */
  if (message.content.startsWith(config.prefix) & !message.author.bot) {
    let commandUsed = Ping.parse(message, bot, sql) || SendEmbed.parse(message, bot, sql) || Kick.parse(message, bot, sql) ||
     Ban.parse(message, bot, sql) || Forceban.parse(message, bot, sql) || Send.parse(message, bot, sql) || Warn.parse(message, bot, sql) ||
     Mute.parse(message, bot, sql) || Unmute.parse(message, bot, sql) || Tictactoe.parse(message, bot, sql) || Mmr.parse(message, bot, sql) ||
     Top.parse(message, bot, sql) || BatailleNavale.parse(message, bot, sql) || Unban.parse(message, bot, sql)
  }

   /* Detecte si le message contient une invitation Discord et qu'il n'est ni un bot, ni l'owner, ni un modérateur ou un administrateur */
   if (message.content.includes("discord.gg/" || "discordapp.com/invite/") &&
      !Permission.isBot(message.member) &&
      !Permission.isOwner(message.member) &&
      !Permission.isAdministrator(message.member) &&
      !Permission.isModerator(message.member)) {

        /* Ajoute le role 'muted' au membre */
        let user = message.member.user
        message.member.addRole(config.roles.idMuted)
        Report.automute(user, bot)

        /* Envoye un message a la personne mute puis supprime le message*/
        message.member.send('😶 Vous avez été mute automatiquement sur '+message.guild.name+' pour avoir partagé un lien discord.gg. Pour tout soucis, contactez un membre du staff.')
          .catch(() => Error.memberDM(message.guild.channels.get(config.channels.idStaffReports)))

        Report.censored(message.member.user, message.channel, message.content, bot)
        message.delete()
   } else {

     /* Si le message se trouve dans le salon présentation */
     if(message.channel.id==config.channels.idPresentations){
       /* Si le mssage contient moins de 'charactersMin' caractères et que l'auteur n'a que le rôle @everyone */
       if(message.content.length<config.presentation.charactersMin & message.member.highestRole.id == config.roles.idEveryone){

         /* Kick la personne, supprime le message et envoi les logs */
         Report.kick(message.member.user, bot.user, "Présentation troll/trop courte.", bot)
         Report.censored(message.member.user, message.channel, message.content, bot)
         message.guild.channels.get(config.channels.idAccueil).send('<@'+message.member.id+'> n\'a pas lu attentivement les règles, il/elle va être expulsé(e) : `Présentation troll/trop courte.`')
         message.member.kick("Présentation troll/trop courte.")
         message.delete()

       }

     }

   }

})

/* Quand un member rejoint le serveur */
bot.on('guildMemberAdd', function(member) {
  /* Accueille le nouveau venu et lui donne 'startingPoints' */
  member.guild.channels.get(config.channels.idAccueil).send('<:mad3_hey:480691383557029889> Bienvenue sur Madness, <@'+member.id+'>. \n'+
                                                        'Passe par le salon <#275335992846712832> pour lire les règles puis tu pourras faire ta présentation dans le salon <#473918586600292382> pour faire partie de la communauté. <a:wink:525818750537170964>')
  if(!member.user.bot){
    sql.prepare("INSERT INTO mmr VALUES ('"+member.id+"', '"+config.mmr.startingPoints+"');").run()
  }
})

/* Quand un member part du serveur */
bot.on("guildMemberRemove", function(member) {
  /* Notifie qu'un membre du serveur est partie et supprime son mmr dans la base de données */
  member.guild.channels.get(config.channels.idAccueil).send('<@'+member.id+'> a décidé de nous quitter.\n'+
                                                       'À une prochaine fois, peut-être.  <a:wave:525817586982584330>')
  if(!member.user.bot){
    sql.prepare("DELETE FROM mmr WHERE id = '"+member.id+"';").run()
  }
})

bot.on("guildBanAdd", function(guild, user) {
  Report.ban(user, bot)
})

bot.on("guildBanRemove", function(guild, user) {
  Report.unban(user, bot)
})

/* Quand le bot a une erreur */
bot.on("error", function(error) {
  Report.error(error, bot)
  console.error
})

/* Se connecte sur le serveur */
bot.login(config.token);
