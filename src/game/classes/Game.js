const Player = require('./Player');

class Game {
    constructor(roomID, hostN, clientN, hostChar, clientChar) {
        this.gameID = roomID;
        this.playerHost = new Player(hostN, hostChar);
        this.playerClient = new Player(clientN, clientChar);
        this.gameState = "waiting"; // Example states: 'waiting', 'active', 'finished'
        this.maxGameTime = 240000; // in ms
        this.remainingTime = this.maxGameTime; // in ms
        this.bossMaxHP = 140;
        this.bossCurHP = this.bossMaxHP;
        this.clearTime = null; // in second
    }

    setPlayerPos(isHost, pos) {
        (isHost)? this.playerHost.setPlayerPos(pos) : this.playerClient.setPlayerPos(pos);
    }

    setBossPos(isHost, pos) {
        (isHost)? this.playerHost.setBossPos(pos) : this.playerClient.setBossPos(pos);
    }

    getBossHP() {
        return this.bossCurHP;
    }

    isBossDead() {
        return this.bossCurHP <= 0;
    }

    setPlayerHP(name, newHP) {
        (name == this.playerHost.getName())?  this.playerHost.setHP(newHP) : this.playerClient.setHP(newHP);
    }

    dealDamageToBoss(damage) {
        if (damage <= 0) return;
        this.bossCurHP -= damage;
        if (this.bossCurHP < 0) this.bossCurHP = 0;

        // true => continue the game, false => end the game (the boss is dead)
        return (this.bossCurHP > 0);
    }

    updateRemainingTime() {
        if (!this.isGameActive()) return 0;
        this.remainingTime -= 15;
        if (this.remainingTime < 0) this.remainingTime = 0;
        return this.remainingTime;
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

    setClearTime() {
        this.clearTime = Math.ceil((this.maxGameTime - this.remainingTime) * 0.001);
    }
    
    getClearTime() {
        return this.clearTime;
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

    getGameData() {
        const gameData = {};
        gameData[this.playerHost.getName()] = this.playerHost.getPlayerGameData();
        gameData[this.playerClient.getName()] = this.playerClient.getPlayerGameData();
        gameData["timeLeft"] = this.getRemainingTime();
        gameData["BossHP"] = this.getBossHP();
        return gameData;
    }
}

module.exports = Game