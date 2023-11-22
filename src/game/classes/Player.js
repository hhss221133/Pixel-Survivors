class Player {
    constructor(name, playerType) {
        this.name = name;
        this.ready = null;
        this.score = 0;
        this.playerType = playerType;
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

    getScore() {
        return this.score;
    }
}

module.exports = Player