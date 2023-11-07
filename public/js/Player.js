

const Player = function(ctx, x, y, gameArea) {
    const character = Character(ctx, x, y, gameArea);

    /* Handle the keydown of ASDW keys for movement */
    $(document).on("keydown", function(event) {

        /* not movement key, return */
        if (event.keyCode != MOVEMENT_KEY.DOWN && event.keyCode != MOVEMENT_KEY.UP 
            && event.keyCode != MOVEMENT_KEY.LEFT && event.keyCode != MOVEMENT_KEY.RIGHT) return;
         
        let newDir = character.GetDirection();

        /* x-direction */
        if (event.keyCode == MOVEMENT_KEY.LEFT) {
            newDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (event.keyCode == MOVEMENT_KEY.RIGHT) {
            newDir.horizontal = DIRECTION_X.RIGHT;
        }

        /* y-direction */
        if (event.keyCode == MOVEMENT_KEY.UP) {
            newDir.vertical = DIRECTION_Y.UP;
        }
        else if (event.keyCode == MOVEMENT_KEY.DOWN) {
            newDir.vertical = DIRECTION_Y.DOWN;
        }

        character.ChangeSpriteDirection(newDir);
    });

    /* Handle the keyup of ASDW keys for movement */
    $(document).on("keyup", function(event) {

        /* not movement key, return */
        if (event.keyCode != MOVEMENT_KEY.DOWN && event.keyCode != MOVEMENT_KEY.UP 
            && event.keyCode != MOVEMENT_KEY.LEFT && event.keyCode != MOVEMENT_KEY.RIGHT) return;
            
        /* get the current direction of the player for initialization */
        let newDir = character.GetDirection();

        /* x-direction */
        if (event.keyCode == MOVEMENT_KEY.LEFT ) {
            if (newDir.horizontal != DIRECTION_X.RIGHT)
                newDir.horizontal = DIRECTION_X.STOP;
        }
        else if (event.keyCode == MOVEMENT_KEY.RIGHT) {
            if (newDir.horizontal != DIRECTION_X.LEFT)
                newDir.horizontal = DIRECTION_X.STOP;
        }

        /* y-direction */
        if (event.keyCode == MOVEMENT_KEY.UP) {
            if (newDir.vertical != DIRECTION_X.DOWN)
                newDir.vertical = DIRECTION_X.STOP;
        }
        else if (event.keyCode == MOVEMENT_KEY.DOWN) {
            if (newDir.vertical != DIRECTION_X.UP)
                newDir.vertical = DIRECTION_X.STOP;
        }

        character.ChangeSpriteDirection(newDir);
    });

    const Update = function(now) {

        character.Update(now);
    };

    return {
        SetMaxHP: character.SetMaxHP,
        SetWalkSpeed: character.SetWalkSpeed,
        SetAttackPower: character.SetAttackPower,
        GetDirection: character.GetDirection,
        CreateSpriteSequences: character.CreateSpriteSequences,
        MoveCharacter: character.MoveCharacter,
        ChangeSpriteDirection: character.ChangeSpriteDirection,
        getBoundingBox: character.getBoundingBox,
        draw: character.draw,
        Update: Update,
    };
};