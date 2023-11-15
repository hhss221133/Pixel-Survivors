const Player = function(ctx, x, y, gameArea, actorID) {

    const character = Character(ctx, x, y, gameArea, actorID);

    character.SetMaxHP(50);

    const invulnerabilityTime = 1; // in second

    let bCanTakeDamage = true;

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

        if (character.GetFSMState() == FSM_STATE.DEAD) return;

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

     //   if (curDir.horizontal == newDir.horizontal && curDir.vertical == newDir.vertical) return;
        character.ChangeSpriteDirection(newDir);
    };

    const HandleMovementInputUp = function(keyCode) {

        /* not movement key, return */
        if (keyCode != MOVEMENT_KEY.DOWN && keyCode != MOVEMENT_KEY.UP 
            && keyCode != MOVEMENT_KEY.LEFT && keyCode != MOVEMENT_KEY.RIGHT) return;

        if (character.GetFSMState() == FSM_STATE.DEAD) return;
            
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

    const HandlePlayerDead = function() {

        character.setSequenceEndCallback(PlayerDie);
        // stop the player
        character.ChangeSpriteDirection({horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP});

        (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().dieLeft) :
            character.setSequence(character.GetSequenceList().dieRight);
    };
    
    const PlayerDie = function() {
        setTimeout(DisposePlayer, 2000);
    };
    
    const DisposePlayer = function() {
        for (playerName in players) {
            if (players[playerName].GetID() == character.GetID()) {
                delete players[character.GetID()];
                return;
            } 
        }
    }

    const TakeDamage = function(damage, enemyXY) {

        if (character.GetFSMState() == FSM_STATE.DEAD || !bCanTakeDamage) return;

        bCanTakeDamage = false;
        setTimeout(ResetCanTakeDamage, invulnerabilityTime * 1000);

        character.DealDamage(damage);

        StartKnockBack(enemyXY);
        character.SetShouldUseWhiteSheet();
        
        let HP = character.GetCurHP();

        if (HP > 0) return;

        // character die
        character.SetFSMState(FSM_STATE.DEAD);

        HandlePlayerDead();
    };

    const StartKnockBack = function(enemyXY) {

        const playerXY = character.getXY();

        let knockBackDir = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};

        if (playerXY.x < enemyXY.x) {
            knockBackDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (playerXY.x > enemyXY.x) {
            knockBackDir.horizontal = DIRECTION_X.RIGHT;
        }

        if (playerXY.y < enemyXY.y && Math.abs(playerXY.y - enemyXY.y) > 10) {
            knockBackDir.vertical = DIRECTION_Y.UP;
        }
        else if (playerXY.y > enemyXY.y && Math.abs(playerXY.y - enemyXY.y) > 10) {
            knockBackDir.vertical = DIRECTION_Y.DOWN;
        } 

        character.StartKnockBack(knockBackDir);

    };

    const ResetCanTakeDamage = () => {bCanTakeDamage = true;}

    const Update = function(now) {

        character.Update(now);
    };

    const GetActorType = () => ACTOR_TYPE.PLAYER;



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
        draw: character.draw,
        Update: Update,
        GetID: character.GetID,
        GetActorType: GetActorType,
        SetAttackCoolDown: character.SetAttackCoolDown,

        // FSM State related
        GetFSMState: character.GetFSMState,
        SetFSMState: character.SetFSMState,
        CanCharAttack: character.CanCharAttack,
        setSequenceEndCallback: character.setSequenceEndCallback,
        StartAttack: character.StartAttack,

        // attack related
        getIndex: character.getIndex,
        TryAddHitTargetToArray: character.TryAddHitTargetToArray,
        EmptyHitTargetArray: character.EmptyHitTargetArray,
        GetAttackPower: character.GetAttackPower,
        HandlePlayerDead: HandlePlayerDead,
        TakeDamage: TakeDamage,
        GetCurHP: character.GetCurHP,
        AddHealth: character.AddHealth,

    };
};