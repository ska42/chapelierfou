# Chapelier Fou

Bot Discord pour le discord "**Madness**" : https://discord.gg/FbC8pa6

## Pour commencer

Après avoir téléchargé les fichiers vous devez créer un fichier **config.json** dans le dossier **app/** et y ajouter votre config :

(Tous les ids doivent être remplacer par les ids des channels et des roles de votre serveur)

```json
{
  "token": "YourDiscordToken",
  "prefix": "!",
  "idGuild": "YourGuildId",
  "idOwner": "YourId",
  "presentation": {
    "charactersMin": "240"
  },
  "roles": {
    "idAdministrator": "AdminsRoleId",
    "idModerator": "ModsRoleId",
    "idHelper": "HelpersRoleId",
    "idMuted": "MutedsRoleId",
    "idBots": "BotsRoleId",
    "idEveryone": "everyoneRoleId"
  },
  "channels": {
    "idStaffReports": "StaffReportsChannelId",
    "idPresentations": "PresentationChannelId",
    "idAccueil": "AccueilChannelId",
    "idTicTacToe": "TicTacToeChannelId",
    "idBattleship": "BattleshipChannelId"
  },
  "mmr": {
    "startingPoints": "500",
    "vocalPoints": "5",
    "loosingPoints": "1",
    "multiplierPerCharacter": "0.2",
    "timer": "600000"
  }
}
```

## Installation

Pour pouvoir utiliser le bot, il faut ensuite créer les fichiers node js nécéssaire.

Pour celà et après avoir installé **node.js** sur votre machine, ouvrez un terminal à la racine du projet et tapez :

```
npm install
```

Après avoir attendu un moment, votre application est prête à être lancée !

## Lancement

Il ne reste plus qu'à lancer votre bot :

```
node index.js
```
