
const Player = function(ctx, x, y, gameArea, actorID) {

    const character = Character(ctx, x, y, gameArea, actorID);

    const invulnerabilityTime = 1; // in second

    let bCanTakeDamage = true;

    let playerType = PLAYER_TYPE.KNIGHT;

    let walkSpeed;

    let playerScore = 0;

    let takeDamageSFX = new Audio(referenceLists.PlayerHit);

    let dieSFX = new Audio(referenceLists.PlayerDie);

    let respawnSFX = new Audio(referenceLists.PlayerRespawn);

    let cheatModeSFX = new Audio();

    let bIsCheatMode = false;

    let healthImage = new Image();
    healthImage.src = referenceLists.CollectibleHealth;

    const playerRespawnTime = 15; // in second

    let respawnTimer = null;

    /* Handle the keydown of ASDW keys for movement */
    $(document).on("keydown", function(event) {

        HandleMovementInputDown(event.keyCode);

        HandleCheatKey(event.keyCode);

    });

    /* Handle the keyup of ASDW keys for movement */
    $(document).on("keyup", function(event) {

        HandleMovementInputUp(event.keyCode);
    });

    const SetPlayerType = function(newType) {
        playerType = newType;
    };

    const AddPlayerScore = function(isEnemyBoss) {
        if (!curSocket) return;
        const dataObj = {}
        dataObj.damage = character.GetAttackPower();
        dataObj.score = (isEnemyBoss)? character.GetAttackPower() * 3 : character.GetAttackPower() * 2;
        dataObj.isBoss = isEnemyBoss;
        curSocket.emit("add score", dataObj);
    }

    const GetPlayerScore = () => {return playerScore;}

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

    const HandleCheatKey = function(keyCode) {
        if (keyCode != ACTION_KEY.CHEAT) return;
        cheatModeSFX.pause();

        (bIsCheatMode)? ToNormalMode() : ToCheatMode();

    };

    const ToCheatMode = function() {
        bIsCheatMode = true;
        cheatModeSFX.src = referenceLists.CheatOn;
        PlaySFX(cheatModeSFX);
        
        character.SetShouldUseCheatSheet(true);
        character.SetWalkSpeed(500);
        character.SetAttackPower(10);
    }

    const ToNormalMode = function() {
        bIsCheatMode = false;
        cheatModeSFX.src = referenceLists.CheatOff;
        PlaySFX(cheatModeSFX);
        
        character.SetShouldUseCheatSheet(false);
        character.SetWalkSpeed(walkSpeed);
        character.SetAttackPower(1);
    };

    const HandlePlayerDead = function() {

        if (bossRef && !bossRef.GetTargetPlayer()) bossRef.FindTargetPlayer();

        // stop the player
        character.ChangeSpriteDirection({horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP});

        (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().dieLeft) :
            character.setSequence(character.GetSequenceList().dieRight);

        character.setSequenceEndCallback(PlayerDie);
    };
    
    const PlayerDie = function() {
        if (respawnTimer) return;
        respawnTimer = setTimeout(RespawnPlayer, playerRespawnTime * 1000);
    };
    
    const RespawnPlayer = function() {
        if (respawnTimer) respawnTimer = null;
        if (character.GetFSMState() != FSM_STATE.DEAD) return;

        PlaySFX(respawnSFX);
        character.ResetHP();
        character.SetSequenceEndToIdle();
        character.SetFSMState(FSM_STATE.MOVE);
        if (curSocket) {
            curSocket.emit("set player HP", character.GetCurHP());
        }
        (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().idleLeft) :
            character.setSequence(character.GetSequenceList().idleRight); 

        if (bossRef && !bossRef.GetTargetPlayer()) bossRef.FindTargetPlayer();
    }

    const TakeDamage = function(damage, enemyXY) {

        if (character.GetFSMState() == FSM_STATE.DEAD || !bCanTakeDamage) return;

        bCanTakeDamage = false;
        setTimeout(ResetCanTakeDamage, invulnerabilityTime * 1000);

        character.DealDamage(damage);

        let HP = character.GetCurHP();

        if (curSocket) {
            curSocket.emit("set player HP", HP);
        }
        

        StartKnockBack(enemyXY);
        character.SetShouldUseWhiteSheet();
        
        

        if (HP > 0) {
            PlaySFX(takeDamageSFX);
            return;
        }

        PlaySFX(dieSFX);

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

    const draw = function() {
        character.draw();
        drawUI();
    }
    
    const drawUI = function() {
        drawHealthUI();
        drawScoreUI();
        drawRemainingTimeUI();
    }

    const ResetCanTakeDamage = () => {bCanTakeDamage = true;}

    const Update = function(now) {
        character.Update(now);
        sendDataToServer();

    };

    const sendDataToServer = function() {
        if (!curSocket) return;
        curSocket.emit("update player pos", character.getXY());
    };

    const GetActorType = () => ACTOR_TYPE.PLAYER;

    const drawHealthUI = function() {
        if (!healthImage.src) return;

        let xOffset = 20;

        for (let i = 0; i < character.GetCurHP(); i++) {
            ctx.drawImage(healthImage, xOffset , 20, 40, 40);
            xOffset += 50;
        }
    }

    const drawScoreUI = function() {
        ctx.font = "30px Arial";
        if (!PlayerStateData) {
            ctx.fillText("Your score: 0", 20, 100);
            ctx.fillText("Rival's score: 0", 20, 150);
            return;
        }

        const username = $("html").data("username");

        let playerScore, rivalScore;

        for (const property in PlayerStateData) {
            (property == username)?  playerScore = PlayerStateData[property] : rivalScore = PlayerStateData[property];
        }
        ctx.fillStyle = "black";
        if (playerScore < rivalScore) ctx.fillStyle = "red";
        else if (playerScore > rivalScore) ctx.fillStyle = "blue";
        ctx.fillText("Your score: " + playerScore, 20, 100);

        ctx.fillStyle = "black";
        ctx.fillText("Rival's score: " + rivalScore, 20, 150);

    };

    const drawRemainingTimeUI = function() {
        ctx.fillStyle = "black";
        if (!TimeLeft) {
            ctx.fillText("Time Remaining: 240", 20, 200);
        }
        else {
            ctx.fillText("Time Remaining: " + Math.ceil(TimeLeft * 0.001), 20, 200);
        }
    };

    const SetWalkSpeed = function(NewWalkSpeed) {
        walkSpeed = NewWalkSpeed;
        character.SetWalkSpeed(walkSpeed);
    };



    return {
        SetMaxHP: character.SetMaxHP,
        SetWalkSpeed: SetWalkSpeed,
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
        draw: draw,
        Update: Update,
        GetID: character.GetID,
        GetActorType: GetActorType,
        SetAttackCoolDown: character.SetAttackCoolDown,
        SetCurHP: character.SetCurHP,

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

        AddPlayerScore: AddPlayerScore,
        SetAttackSFX: character.SetAttackSFX,
        drawUI: drawUI

    };
};