const Player = require('./Player');

class Game {
    constructor(roomID, hostN, clientN) {
        this.gameID = roomID;
        this.playerHost = new Player(hostN);
        this.playerClient = new Player(clientN);
        this.gameState = "waiting"; // Example states: 'waiting', 'active', 'finished'
        this.remainingTime = 240;
        this.bossCurHP = 150;
    }

    getBossHP() {
        return this.bossCurHP;
    }

    isBossDead() {
        return this.bossCurHP <= 0;
    }

    dealDamageToBoss(damage) {
        if (damage <= 0) return;
        this.bossCurHP -= damage;
        if (this.bossCurHP < 0) this.bossCurHP = 0;

        // true => continue the game, false => end the game (the boss is dead)
        return (this.bossCurHP > 0);
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

    setGameState(newState) {
        this.gameState = newState;
    }

    getGameState() {
        return this.gameState;
    }

    isGameActive() {
        return this.gameState == "active";
    }

    addScoreToplayer(username, score) {
        (username == this.playerHost.getName())? this.playerHost.addScore(score) : this.playerClient.addScore(score);
    }

    isAllReady() {
        return this.playerHost.getReady() === true && this.playerClient.getReady() === true;
    }

    getRemainingTime() {
        return this.remainingTime;
    }

    getPlayerData() {
        const playerData ={};

        playerData[this.playerHost.getName()] = this.playerHost.getScore();
        playerData[this.playerClient.getName()] = this.playerClient.getScore();
        return playerData;
    }
}

module.exports = Game