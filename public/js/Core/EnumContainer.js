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
    KNIGHT : "Knight",
    WIZARD : "Wizard"
};

const ENEMY_TYPE = {
    SKELETON: "Skeleton",
    FLYINGEYE: "FlyingEye",
    MUSHROOM: "Mushroom"
};

const PROJECTILE_TYPE = {
    WATERBALL: "Waterball",
    FIREBALL: "Fireball",
    PLASMABALL: "Plasmaball"
};

const ACTOR_TYPE = {
    PLAYER: 0,
    ENEMY: 1,
};

const BOSS_ATTACK_TYPE = {
    NONE: 0,
    NORMALSHOOT: 1,
    MULTIPLESHOOT: 2,
    FASTSHOOT: 3,
    TELEPORT: 4,
    EXPLOSION: 5
};

// states in the finite state machine(FSM)
const FSM_STATE = {
    MOVE: 0,    // walk and idle
    ATTACK: 1,
    KNOCKBACK: 2,
    DEAD: 3
};


