class Player {
    constructor(name) {
        this.name = name;
        this.ready = null;
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
}

module.exports = Player