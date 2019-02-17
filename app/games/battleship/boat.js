/**
  * Classe représentant un bateau
  */
module.exports = class Boat {

  /**
    * Constructeur Boat
    * @param {int} length - Longueur du bateau
    */
  constructor(length) {
     this.length = length
     this.life = length
     this.alive = true
     /* Initialisation du tableau de position */
     this.position = new Array(length)
     for (var i = 0; i < length; i++) {
       this.position[i]=new Array(2)
     }
  }

  /**
    * Setter position
    * @param {Array[][]} pos - Positions du bateau
    */
  setPosition(pos) {
    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < 2; j++) {
        this.position[i][j]=pos[i][j]
      }
    }
  }

  /**
    * Vérifié si le bateau contient la position pos
    * @param {Array[2]} pos - Position ciblée
    * @return {boolean}
    */
  containPosition(pos) {
    for (var i = 0; i < this.length; i++) {
      if (this.position[i][0]==pos[0] & this.position[i][1]==pos[1]) {
        return true
      }
    }
    return false
  }

  /**
    * Le Bateau a été touché, il perd une vie et s'il n'en a plus, on passe this.alive a false
    */
  getHit() {
    this.life--
    if (this.life==0) {
       this.alive = false
    }
  }

  /**
    * Retourne l'etat du Bateau
    * @return {boolean}
    */
  isAlive() {
    return this.alive
  }

  /**
    * Retourne la vie du Bateau
    * @return {int}
    */
    getLife() {
      return this.life
    }

  /**
    * Getter length
    * @return {int}
    */
  getLength() {
    return this.length
  }

  /**
    * Getter position
    * @return {Array[][]}
    */
  getPosition() {
    return this.position
  }

}
