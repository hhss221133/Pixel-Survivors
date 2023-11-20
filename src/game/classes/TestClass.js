class Test {
    constructor(test) {
        this.test_variable = test;
    }

    get() {
        return this.test_variable;
    }

    set(new_var) {
        this.test_variable = new_var;
    }
}


module.exports = Test