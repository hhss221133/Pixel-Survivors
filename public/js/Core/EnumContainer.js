/* Store the enum objects */

const DIRECTION_X = {
    LEFT : 0,
    RIGHT : 1,
    STOP : 2  // not moving in x-axis
};

const DIRECTION_Y = {
    UP : 0,
    DOWN : 1,
    STOP : 2   // not moving in y-axis
};

const MOVEMENT_KEY = {
    UP : "87",  // W
    DOWN : "83", // S
    LEFT : "65", // A
    RIGHT: "68" // D
}

const ACTION_KEY = {
    ATTACK: "75"
};

const PLAYER_TYPE = {
    KNIGHT : 0,
    WIZARD : 1
};

// states in the finite state machine(FSM)
const FSM_STATE = {
    MOVE: 0,    // walk and idle
    ATTACK: 1,
    KNOCKBACK: 2,
    DEAD: 3
};


