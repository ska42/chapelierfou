const Discord = require('discord.js')
const config = require("@config")

/* Games */
const Game = require('@games/game')
const Boat = require('@games/battleship/boat')

/* Classes */
const Error = require('@classes/error')

/**
  * Classe représentant le jeu bataille navale
  */
module.exports = class Battleship extends Game {

  /**
    * Constructeur Battleship
    * @param {Channel} channel - Channel ou a été lancé le jeu
    * @param {GuildMember[]} players - Tableau des participants au jeu
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  constructor(channel, players, bot, sql) {
    super(channel, players, bot, sql)
    if (Battleship.instance == null) {
      Battleship.instance = this
      this.gameStart()
    } else {
      this.channel.send('Une partie est déjà en cours `'+config.prefix+'carte`.')
    }
  }

  /**
    * Lancement de la partie
    */
  gameStart() {
    /* Instanciation du tableau de la bataille */
    this.tab = new Array(10)
    for (var i = 0; i < 10; i++) {
      this.tab[i] = new Array(10)
    }

    /* Mettre toutes les valeurs du tableau a 0 */
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        this.tab[i][j] = 0
      }
    }

    /* Initialisation Boats */
    this.boats = new Array(5)
    /*x1 5 cases */
    var porteAvion = new Boat(5)
    porteAvion.setPosition(this.boatPlacement(5))
    this.boats[0]=porteAvion
    /*x1 4 cases */
    var croiseur = new Boat(4)
    croiseur.setPosition(this.boatPlacement(4))
    this.boats[1]=croiseur
    /*x2 3 cases */
    var sousmarin1 = new Boat(3)
    var sousmarin2 = new Boat(3)
    sousmarin1.setPosition(this.boatPlacement(3))
    this.boats[2]=sousmarin1
    sousmarin2.setPosition(this.boatPlacement(3))
    this.boats[3]=sousmarin2
    /*x1 2 cases */
    var torpilleur = new Boat(2)
    torpilleur.setPosition(this.boatPlacement(2))
    this.boats[4]=torpilleur

    this.channel.send("Pour jouer tapez la commande "+config.prefix+"vise colonne ligne - exemple `"+config.prefix+"vise a 1`")
    this.affichageTableau()

    /* Collector pour jouer */
    this.play = new Discord.MessageCollector(this.channel, m => !m.author.bot)

    this.play.on('collect', message => {
      if (message.content.startsWith(config.prefix+"vise")) {
        let args = message.content.split(' ')
        if ((args[1]=="a" || args[1]=="b" || args[1]=="c" ||
             args[1]=="d" || args[1]=="e" || args[1]=="f" ||
             args[1]=="g" || args[1]=="h" || args[1]=="i" || args[1]=="j") &&
            (args[2]=="1" || args[2]=="2" || args[2]=="3" ||
             args[2]=="4" || args[2]=="5" || args[2]=="6" ||
             args[2]=="7" || args[2]=="8" || args[2]=="9" || args[2]=="10")) {
          var canPlay = true // true si le joueur peut jouer
          var oldDate // Ancienne date ou le joueur à joué
          var index // index du joueur dans le tableau des joueurs/date/score
          this.players.forEach(function(player, i) {
            if ( message.author.id == player[0] ) {
              oldDate = player[1]
              if (new Date().getTime() > player[1].getTime()) {
                index = i
              } else {
                canPlay = false
              }
            }
          })
          /* Transformation des valeurs pour qu'elles correspondent au tableau */
          if ( canPlay ) {
            switch(args[1]){
              case "a":args[1]=0
                break;
              case "b":args[1]=1
                break;
              case "c":args[1]=2
                break;
              case "d":args[1]=3
                break;
              case "e":args[1]=4
                break;
              case "f":args[1]=5
                break;
              case "g":args[1]=6
                break;
              case "h":args[1]=7
                break;
              case "i":args[1]=8
                break;
              case "j":args[1]=9
                break;
            }
            args[2] = parseInt(args[2])-1
            var pos = [args[1], args[2]]
            if (this.tab[args[1]][args[2]] == 0) {
              var nextDate = new Date()
              nextDate.setMinutes(nextDate.getMinutes() + 10)
              if( index != null ) {
                this.players[index][1] = nextDate
              } else {
                this.players.push([message.author.id, nextDate, 0])
                index = this.players.length-1
              }
              this.boats.forEach(function(boat) {
                if ( boat.containPosition(pos) ) {
                  boat.getHit()
                  if ( boat.isAlive () ) {
                    this.tab[args[1]][args[2]] = 2
                    this.channel.send('Crac ! Un navire a été touché !')
                    if ( boat.getLife()+1 == boat.getLength() ) {
                      this.players[index][2] += 10
                    } else {
                      this.players[index][2] += 5
                    }
                  } else {
                    var boatPosition = boat.getPosition()
                    for ( var i = 0; i < boatPosition.length; i++ ) {
                      this.tab[boatPosition[i][0]][boatPosition[i][1]] = 3
                    }
                    this.channel.send('Boum ! Le navire a coulé !')
                    this.players[index][2] += 8
                    var allDead = true
                    this.boats.forEach(function(bateau) {
                      if (bateau.isAlive()) {
                        allDead = false
                      }
                    }, this)
                    if (allDead) {
                      this.win()
                    }
                  }
                } else {
                }
              }, this)
              if(this.tab[args[1]][args[2]] == 0){
                this.tab[args[1]][args[2]] = 1
                this.channel.send('Plouf ! Vous avez tiré dans l\'eau !')
              }
              this.affichageTableau()
            } else {
              Error.alreadyTaken(this.channel)
            }
          } else {
            var date = new Date();
            var timeDiff = Math.abs(oldDate.getTime() - date.getTime());
            var diffMinutes = Math.ceil(timeDiff / (60000));
            this.channel.send('Votre dernier tir est trop récent, vous pourrez tirer dans '+diffMinutes+' minutes.')
          }
        } else {
          Error.viseError(this.channel)
        }
      }
      if (message.content.startsWith(config.prefix+"carte")) {
        this.affichageTableau()
      }
    })
  }

  /**
    * Si la partie a été gagnée
    * Affiche le score des participants
    */
  win(){
    this.play.stop()
    this.channel.send('GG! Tous les navires ont été coulés !')
    var string = "Les Scores :\n"
    this.players.forEach(function(player, i) {
      string+="<@"+player[0]+"> : "+player[2]+"points\n"
    })
    this.channel.send(string)
    Battleship.instance = null
  }

  /**
    * Place un bateau
    * @param {int} length - longueur du bateau
    * @return {Array[][]} - Position du bateau
    */
  boatPlacement(length) {
    var goodPlacement = false
    var placement = new Array(length)

    for (var i = 0; i < 2; i++) {
      placement = new Array(2)
    }

    while (!goodPlacement) {
      goodPlacement = true
      var randX = Math.floor(Math.random() * 10)
      var randY = Math.floor(Math.random() * 10)
      var randDirection = Math.floor(Math.random() * 2)

      /* Si la direction est horizontale */
      if (randDirection == 0) {
        if ( (randX + length) < 10 ) {
          for ( var i = 0; i < length; i++) {
            var testPos = [randX+i, randY]
            this.boats.forEach(function (boat) {
              if (boat.containPosition(testPos)) {
                goodPlacement = false
              }
            })
            if (goodPlacement) {
              placement[i] = testPos
            }
          }
        } else {
          goodPlacement = false
        }
      /* Sinon, si elle est verticale */
      } else {
        if ( (randY + length) <10 ) {
          for ( var i = 0; i < length; i++) {
            var testPos = [randX, randY+i]
            this.boats.forEach(function (boat) {
              if (boat.containPosition(testPos)) {
                goodPlacement = false
              }
            })
            if (goodPlacement) {
              placement[i] = testPos
            }
          }
        } else {
          goodPlacement = false
        }
      }

    }
    return placement
  }

  /**
    * Affiche le tableau
    */
  affichageTableau() {
    var string = ""
    for (var i = 0; i < 10; i++) {
      for(var j = 0; j < 10; j++) {
        switch(this.tab[i][j]){
          case 0:
            string+=":white_circle:"
            break;
          case 1:
            string+=":blue_circle:"
            break;
          case 2:
            string+=":red_circle:"
            break;
          case 3:
            string+=":cookie:"
            break;
        }
      }
      switch(i){
        case 0:
          string+=":regional_indicator_a:"
          break;
        case 1:
          string+=":regional_indicator_b:"
          break;
        case 2:
          string+=":regional_indicator_c:"
          break;
        case 3:
          string+=":regional_indicator_d:"
          break;
        case 4:
          string+=":regional_indicator_e:"
          break;
        case 5:
          string+=":regional_indicator_f:"
          break;
        case 6:
          string+=":regional_indicator_g:"
          break;
        case 7:
          string+=":regional_indicator_h:"
          break;
        case 8:
          string+=":regional_indicator_i:"
          break;
        case 9:
          string+=":regional_indicator_j:"
          break;
      }
      string+="\n"
    }
    string+=":one::two::three::four::five::six::seven::eight::nine::keycap_ten:"
    this.channel.send(string)
  }

}
