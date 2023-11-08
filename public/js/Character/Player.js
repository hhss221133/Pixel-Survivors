
const Player = function(ctx, x, y, gameArea) {
    const character = Character(ctx, x, y, gameArea);

    let playerType = PLAYER_TYPE.KNIGHT;

    /* Handle the keydown of ASDW keys for movement */
    $(document).on("keydown", function(event) {

        HandleMovementInputDown(event.keyCode);

    });

    /* Handle the keyup of ASDW keys for movement */
    $(document).on("keyup", function(event) {

        HandleMovementInputUp(event.keyCode);
    });

    const SetPlayerType = function(newType) {
        playerType = newType;
    };

    const HandleMovementInputDown = function(keyCode) {
        /* not movement key, return */
        if (keyCode != MOVEMENT_KEY.DOWN && keyCode != MOVEMENT_KEY.UP 
            && keyCode != MOVEMENT_KEY.LEFT && keyCode != MOVEMENT_KEY.RIGHT) return;

        let curDir = character.GetDirection();
        let newDir = character.GetDirection();

        /* x-direction */
        if (keyCode == MOVEMENT_KEY.LEFT) {
            if (curDir.horizontal != DIRECTION_X.LEFT) 
                newDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (keyCode == MOVEMENT_KEY.RIGHT) {
            if (curDir.horizontal != DIRECTION_X.RIGHT) 
                newDir.horizontal = DIRECTION_X.RIGHT;
        }


        /* y-direction */
        if (keyCode == MOVEMENT_KEY.UP) {
            newDir.vertical = DIRECTION_Y.UP;
        }
        else if (keyCode == MOVEMENT_KEY.DOWN) {
            newDir.vertical = DIRECTION_Y.DOWN;
        }

        if (curDir.horizontal == newDir.horizontal && curDir.vertical == newDir.vertical) return;
        character.ChangeSpriteDirection(newDir);
    };

    const HandleMovementInputUp = function(keyCode) {

        /* not movement key, return */
        if (keyCode != MOVEMENT_KEY.DOWN && keyCode != MOVEMENT_KEY.UP 
            && keyCode != MOVEMENT_KEY.LEFT && keyCode != MOVEMENT_KEY.RIGHT) return;
            
        /* get the current direction of the player for initialization */
        let curDir = character.GetDirection();
        let newDir = character.GetDirection();

        /* x-direction */
        if (keyCode == MOVEMENT_KEY.LEFT ) {
            if (curDir.horizontal != DIRECTION_X.RIGHT)
                newDir.horizontal = DIRECTION_X.STOP;
        }
        else if (keyCode == MOVEMENT_KEY.RIGHT) {
            if (curDir.horizontal != DIRECTION_X.LEFT)
                newDir.horizontal = DIRECTION_X.STOP;
        }

        /* y-direction */
        if (keyCode == MOVEMENT_KEY.UP) {
            if (curDir.vertical != DIRECTION_X.DOWN)
                newDir.vertical = DIRECTION_X.STOP;
        }
        else if (keyCode == MOVEMENT_KEY.DOWN) {
            if (curDir.vertical != DIRECTION_X.UP)
                newDir.vertical = DIRECTION_X.STOP;
        }

        if (curDir.horizontal == newDir.horizontal && curDir.vertical == newDir.vertical) return;
        character.ChangeSpriteDirection(newDir);
    };

    return {
        SetMaxHP: character.SetMaxHP,
        SetWalkSpeed: character.SetWalkSpeed,
        SetAttackPower: character.SetAttackPower,
        GetDirection: character.GetDirection,
        CreateSpriteSequences: character.CreateSpriteSequences,
        MoveCharacter: character.MoveCharacter,
        SetPlayerType: SetPlayerType,
        getXY: character.getXY,
        getScale: character.getScale,
        drawBox: character.drawBox,
        ChangeSpriteDirection: character.ChangeSpriteDirection,
        getCurSequence: character.getCurSequence,
        getDisplaySize: character.getDisplaySize,
        setSequence: character.setSequence,
        getBoundingBox: character.getBoundingBox,
        draw: character.draw,
        Update: character.Update,

        // FSM State related
        GetFSMState: character.GetFSMState,
        SetFSMState: character.SetFSMState,
        CanCharAttack: character.CanCharAttack,
        setSequenceEndCallback: character.setSequenceEndCallback,
        StartAttack: character.StartAttack,

        // Hitbox related
        SetHitBox: character.SetHitBox,
    };
};