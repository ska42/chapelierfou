const Discord = require('discord.js')
const config = require("../config.json")

/* Games */
const Game = require('./game')

/* Classes*/
const Error = require('../classes/error')

/**
  * Classe du jeu TicTacToe
  * @extends Game
  */
module.exports = class GameTicTacToe extends Game {

  /**
    * Constructeur du TicTacToe
    * Lance l'acceptation du jeu
    * @param {Channel} channel - Channel ou a été lancé le jeu
    * @param {GuildMember[]} players - Tableau des participants au jeu
    * @param {Client} bot - Client du bot
    * @param {SQLite} sql - Table sql
    */
  constructor(channel, players, bot, sql) {
     super(channel, players, bot, sql)
     this.accept(this.players[1])
  }

  /**
    * Acceptation de la partie
    * @param {GuildMember} player - Membre devant accepter la partie
    */
  accept(player) {

    this.accept = false
    this.channel.send("<@"+player.id+">, vous avez 30 secondes pour accepter la partie. `"+config.prefix+"accept`")

    /* collector collectant la potentielle réponse */
    const collector = new Discord.MessageCollector(this.channel, m => m.author.id === player.id, { time: 30000 })

    collector.on('collect', message => {
        if (message.content == config.prefix+"accept") {
            this.accept = true
            collector.stop()
        }
    })

    collector.on('end', () => {
      if(!this.accept){
        Error.timeOut(this.channel)
      } else {
        this.gameStart()
      }
    })

  }

  /**
    * Lancement de la partie
    */
  gameStart() {
    this.turn = this.players[0] // Initialise le tour des joueurs (Le joueur 1 commence ici)
    this.winner = null // Le gagnant sera defini par la variable winner
    /* Intialisation du tableau du tictactoe */
    this.tab=new Array(3)
    for (var i=0; i <3; i++) {
      this.tab[i]=new Array(3)
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this.tab[i][j] = 0
      }
    }

    this.channel.send("Pour jouer, tapez la commande "+config.prefix+"set colonne ligne - exemple : `"+config.prefix+"set a 1`")
    this.affichageTableau()

    this.manche()
  }

  /**
    * Manche d'une partie (méthode récursive)
    */
  manche(){
    this.timer = true
    this.channel.send("Tour de : **"+this.turn.user.tag+"** - `30 secondes`")

    /* Collector attendant une reponse */
    const responseTurn = new Discord.MessageCollector(this.channel, m => m.author.id === this.turn.id, { time: 30000 })

    responseTurn.on('collect', message => {
      /* Vérifie que la commande commence par prefix+set */
        if (message.content.startsWith(config.prefix+"set")) {
            this.timer = false
            let args = message.content.split(' ')
            /* Vérifie que la commande tapée est correcte */
            if ((args[1]=="a" || args[1]=="b" || args[1]=="c") && (args[2]=="1" || args[2]=="2" || args[2]=="3")) {
              switch(args[1]){
                case "a":args[1]=0
                  break;
                case "b":args[1]=1
                  break;
                case "c":args[1]=2
                  break;
              }
              switch(args[2]){
                case "1":args[2]=0
                  break;
                case "2":args[2]=1
                  break;
                case "3":args[2]=2
                  break;
              }
              /* Joue sur le tableau en local this.tab */
              if (this.tab[args[1]][args[2]] == 0) {
                if (this.turn == this.players[0]) {

                  this.tab[args[1]][args[2]] = 1

                } else if(this.turn == this.players[1]) {

                  this.tab[args[1]][args[2]] = 2

                }
                this.affichageTableau()
                responseTurn.stop() // Arrête le collector
              } else {
                Error.alreadyTaken(this.channel)
              }
            } else {
              Error.setError(this.channel)
            }
        }
    })

    responseTurn.on('end', () => {
      if (this.timer) {

        Error.timeOut(this.channel)

        if (this.turn == this.players[0]) {

          this.winner = this.players[1]

        } else if(this.turn == this.players[1]) {

          this.winner = this.players[0]

        }
        this.endGameWin()
      }else {
        this.checkWinning()
      }
        this.timer = false

        if(this.winner==null){
          this.nextTurn()
          this.manche()
        }


    })
  }

  /**
    * Victoire de fin de partie
    */
  endGameWin(){
    this.channel.send('**'+this.winner.user.tag+'** a gagné la partie ! **GG**')
  }

  /**
    * Egalité de fin de partie
    */
  endGameDraw(){
    this.channel.send('Egalité ! **GG**')
  }

  /**
    * Vérifié si un des 2 joueurs à gagné
    */
  checkWinning(){
    if((this.tab[0][0]==this.tab[0][1] && this.tab[0][1]==this.tab[0][2] && this.tab[0][2]!=0) ||
       (this.tab[1][0]==this.tab[1][1] && this.tab[1][1]==this.tab[1][2] && this.tab[1][2]!=0) ||
       (this.tab[2][0]==this.tab[2][1] && this.tab[2][1]==this.tab[2][2] && this.tab[2][2]!=0) ||
       (this.tab[0][0]==this.tab[1][0] && this.tab[1][0]==this.tab[2][0] && this.tab[2][0]!=0) ||
       (this.tab[0][1]==this.tab[1][1] && this.tab[1][1]==this.tab[2][1] && this.tab[2][1]!=0) ||
       (this.tab[0][2]==this.tab[1][2] && this.tab[1][2]==this.tab[2][2] && this.tab[2][2]!=0) ||
       (this.tab[0][0]==this.tab[1][1] && this.tab[1][1]==this.tab[2][2] && this.tab[2][2]!=0) ||
       (this.tab[0][2]==this.tab[1][1] && this.tab[1][1]==this.tab[2][0] && this.tab[2][0]!=0)){
         this.winner = this.turn
         this.endGameWin()
       } else {
         var full = true
         for (var i = 0; i < 3; i++) {
           for (var j = 0; j < 3; j++) {
             if(this.tab[i][j] == 0) {
               full = false
             }
           }
         }
         if(full) {
           this.winner = 'draw'
           this.endGameDraw()
         }
       }
  }

  /**
    * Lance le prochain tour
    */
  nextTurn(){

    if (this.turn == this.players[0]) {
      this.turn = this.players[1]
    } else if(this.turn == this.players[1]) {
      this.turn = this.players[0]
    }

  }

  /**
    * Affiche le tableau du tic tac toe sur le channel
    */
  affichageTableau(){

    var string = "";
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        switch(this.tab[i][j]){
          case 0:
            string+=":white_large_square:"
            break;
          case 1:
            string+=":x:"
            break;
          case 2:
            string+=":o:"
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
      }
      string+="\n"
    }
    string+=":one::two::three:"
    this.channel.send(string)
  }

}
