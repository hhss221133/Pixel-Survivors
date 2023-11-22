const Player = require('./Player');

class Game {
    constructor(roomID, hostN, clientN) {
        this.gameID = roomID;
        this.playerHost = new Player(hostN);
        this.playerClient = new Player(clientN);
        this.gameState = 'waiting'; // Example states: 'waiting', 'active', 'finished'
    }

    getGameID() {
        return this.gameID;
    }

    setPlayerReady(playerName) {
        if (this.playerHost.getName() === playerName) {
            this.playerHost.setReady(true);
        } else if (this.playerClient.getName() === playerName) {
            this.playerClient.setReady(true);
        } else {
            return false;
        }
    }

    addScoreToplayer(username, score) {
        (username == this.playerHost.getName())? this.playerHost.addScore(score) : this.playerClient.addScore(score);
        console.log("Updated Score: " + this.playerHost.getScore() + " " + this.playerClient.getScore());
    }

    isAllReady() {
        return this.playerHost.getReady() === true && this.playerClient.getReady() === true;
    }
}

module.exports = Game