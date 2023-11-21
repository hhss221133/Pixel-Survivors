const Test = require('./classes/TestClass'); 

test_in_memory = [];

function CreateTest(a_var) {
    new_test = new Test(a_var);
    test_in_memory.push(new_test);
    console.log(test_in_memory);
    for(i = 0; i < test_in_memory.length; i++) {
        console.log(test_in_memory[i].get());
    }
}


module.exports = CreateTest;