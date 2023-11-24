class Player {
    constructor(name, playerType) {
        this.name = name;
        this.ready = null;
        this.score = 0;
        this.playerType = playerType;
        this.playerPos = {x: 100, y: 540};
        this.bossPos = {x: 1000, y: 180};
    }

    setReady(bool_) {
        this.ready = bool_;
    }

    getReady() {
        return this.ready;
    }

    getName() {
        return this.name;
    }

    addScore(score) {
        if (score <= 0) return;
        this.score += score;
    }

    getPlayerType() {
        return this.playerType;
    }

    getScore() {
        return this.score;
    }

    setBossPos(pos) {
        this.bossPos.x = pos.x;
        this.bossPos.y = pos.y;
    }

    setPlayerPos(pos) {
        this.playerPos.x = pos.x;
        this.playerPos.y = pos.y;
    }

    getBossPos() {
        return this.bossPos;
    }

    getPlayerPos() {
        return this.playerPos;
    }

    getPlayerGameData() {
        const data = {};
        data["playerPos"] = this.getPlayerPos();
        data["bossPos"] = this.getBossPos();
        data["score"] = this.getScore();
        data["playerType"] = this.getPlayerType();
        return data;
    }
}

module.exports = Player