/* Component to store the properties for all characters, i.e. player & enemy */

const Character = function(ctx, x, y, gameArea, actorID) {
    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    const ID = actorID;

    let charState = FSM_STATE.MOVE;

    let attackCoolDown = 1; // in seconds

    let bCanAttack = true;

    let bCanSpawnProjectile = false; // only for enemies that can spawn projectile

    let maxHP = 3;

    let curHP = maxHP;

    let walkSpeed = 100;

    let attackPower = 1;

    let knockBackDuration = 0.2; // in second

    let knockBackSpeed = 1000; // in pixel

    let knockBackDirection = null;

    let sequences = {
        /* MUST BE initialized before using!*/
    };

    let attackSFX = new Audio();

    let attackSFXDelay = 0; // to match the animation, the SFX will be played after a certain time

    let hitTargetArray = [];  // store the target hit in the current attack, need to be reset every attack

    let direction = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};

    const GetID = () => {return ID;}

    const EmptyHitTargetArray = () => {hitTargetArray = [];}

    const SetAttackSFX = function(audioSrc, newDelay) {
        attackSFX.src = audioSrc;
        attackSFXDelay = newDelay;
    }


    const TryAddHitTargetToArray = function(newTarget) {
        if (hitTargetArray.includes(newTarget)) return false;

        hitTargetArray.push(newTarget);
        return true;
    };

    const SetKnockBackSpeed = function(newSpeed) {
        knockBackSpeed = newSpeed;
    }

    const SetMaxHP = function(newMaxHp) {
        maxHP = newMaxHp;
        curHP = maxHP;
    }

    const StartKnockBack = function(newDir) {
        knockBackDirection = newDir;
        charState = FSM_STATE.KNOCKBACK;
        setTimeout(EndKnockBack, knockBackDuration * 1000);
    };

    const EndKnockBack = function() {
        if (charState == FSM_STATE.DEAD) return;
        knockBackDirection = null;
        ToIdle();
    }

    const PlayAttackSFXAfterDelay = function() {
        if (charState != FSM_STATE.ATTACK) return;
        PlaySFX(attackSFX);
    };

    const SetAttackCoolDown = (newCoolDown) => {attackCoolDown = newCoolDown;}

    const GetSequenceList = () => {return sequences;}
    
    const GetAttackPower = () => {return attackPower;}

    const CanSpawnProjectile = () => {return bCanSpawnProjectile;}

    const ResetCanSpawnProjectile = () => {bCanSpawnProjectile = false;}

    const Clamp = (val, max, min) => Math.min(Math.max(val, min), max);

    const DealDamage = function(damage) {
        // only for damage calculation, not for performing action after death
        curHP = Clamp(curHP - damage, maxHP, 0);
    };

    const GetCurHP = () => {return curHP;}

    const ResetHP = () => {curHP = maxHP;}

    const ToIdle = function() {

        charState = FSM_STATE.MOVE;

        if (direction.horizontal == DIRECTION_X.STOP && direction.vertical == DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.idleLeft) : sprite.setSequence(sequences.idleRight);
        }
        else if (direction.horizontal != DIRECTION_X.STOP) {
            (direction.horizontal == DIRECTION_X.LEFT)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }
        else if (direction.vertical != DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }
        EmptyHitTargetArray();
    };

    const StartAttack = function() {
        bCanAttack = false;
        bCanSpawnProjectile = true;
        SetFSMState(FSM_STATE.ATTACK);
        setTimeout(ResetCanAttack, attackCoolDown * 1000);
        setTimeout(PlayAttackSFXAfterDelay, attackSFXDelay);
    };


    const ResetCanAttack = () => {bCanAttack = true;}

    const SetSequenceEndToIdle = function() {
        sprite.setSequenceEndCallback(ToIdle);
    }
    SetSequenceEndToIdle();


    const SetWalkSpeed = function(NewWalkSpeed) {
        walkSpeed = NewWalkSpeed;
    };

    const SetAttackPower = function(NewAttackPower) {
        attackPower = NewAttackPower;
    };

    const SetFSMState = function(NewState) {

        if (charState == NewState) return;

        charState = NewState;
    }

    const AddHealth = function(healthAmount) {
        curHP = Clamp(curHP + healthAmount, maxHP, 0);
    };

    const GetFSMState = () => {return charState;}

    const CanCharAttack = function() {
        return (charState == FSM_STATE.MOVE || charState == FSM_STATE.KNOCKBACK) && bCanAttack;
    } 

    const GetDirection = function() {
        return {... direction};
    };

    /* Create sprite sequeunces specific to each character  */
    const CreateSpriteSequences = function(NewSpriteSequence, DefaultSequence, Scale, SheetName, WhiteSheetName, CheatSheetName) {
        sequences = NewSpriteSequence;
        sprite.setSequence(DefaultSequence).setScale(Scale).useSheet(SheetName, WhiteSheetName, CheatSheetName);
    };

    const MoveCharacter = function() {

        // if character is not moving, just return
        if (direction.horizontal == DIRECTION_X.STOP && direction.vertical == DIRECTION_Y.STOP) return;

        if (charState == FSM_STATE.DEAD || charState == FSM_STATE.KNOCKBACK) return;

        let { x, y } = sprite.getXY();

        // Move the character
        switch (direction.horizontal) {
            case DIRECTION_X.LEFT:
                x -= walkSpeed * deltaTime;
                break;
            case DIRECTION_X.RIGHT:
                x += walkSpeed * deltaTime;
                break;
        };

        switch (direction.vertical) {
            case DIRECTION_Y.UP:
                y -= walkSpeed * deltaTime;
                break;
            case DIRECTION_Y.DOWN:
                y += walkSpeed * deltaTime;
                break;
        };

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y))
            sprite.setXY(x, y);
    };

    const HandleKnockBack = function() {

        if (charState != FSM_STATE.KNOCKBACK || !knockBackDirection) return;

        let { x, y } = sprite.getXY();

        switch (knockBackDirection.horizontal) {
            case DIRECTION_X.LEFT:
                x -= knockBackSpeed * deltaTime;
                break;
            case DIRECTION_X.RIGHT:
                x += knockBackSpeed * deltaTime;
                break;
        };

        switch (knockBackDirection.vertical) {
            case DIRECTION_Y.UP:
                y -= knockBackSpeed * deltaTime;
                break;
            case DIRECTION_Y.DOWN:
                y += knockBackSpeed * deltaTime;
                break;
        };

        if (gameArea.isPointInBox(x, y))
            sprite.setXY(x, y);

    };

    const ChangeSpriteDirection = function(newDir) {
        
        
        const curDir = {... direction};

        direction = newDir;

        
        if (GetFSMState() != FSM_STATE.MOVE) return;
        // To idle animation, only proceed if character is not doing other actions

        if (newDir.horizontal == DIRECTION_X.STOP && newDir.vertical == DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.idleLeft) : sprite.setSequence(sequences.idleRight);
        }
        else if (curDir.horizontal != newDir.horizontal && newDir.horizontal != DIRECTION_X.STOP) {
            (newDir.horizontal == DIRECTION_X.LEFT)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }
        else if (curDir.vertical == DIRECTION_Y.STOP && newDir.vertical != DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }
        
        
    };

    const GetMaxHP = () => {return maxHP;}

    // deltaTime stores the time in one frame
    const Update = function(now) {

        sprite.update(now);

        MoveCharacter();

        HandleKnockBack();
    };

    const SetCurHP = function(newHP) {
        curHP = newHP;
    }

    return {
        SetMaxHP: SetMaxHP,
        SetCurHP: SetCurHP,
        GetMaxHP: GetMaxHP,
        SetWalkSpeed: SetWalkSpeed,
        SetAttackPower: SetAttackPower,
        GetDirection: GetDirection,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getScale: sprite.getScale,
        CreateSpriteSequences: CreateSpriteSequences,
        MoveCharacter: MoveCharacter,
        drawBox: sprite.drawBox,
        ChangeSpriteDirection: ChangeSpriteDirection,
        getCurSequence: sprite.getCurSequence,
        draw: sprite.draw,
        setSequence: sprite.setSequence,
        Update: Update,
        GetCurHP: GetCurHP,
        getDisplaySize: sprite.getDisplaySize,
        GetID: GetID,

        // FSM State related
        GetFSMState: GetFSMState,
        SetFSMState: SetFSMState,
        CanCharAttack: CanCharAttack,
        setSequenceEndCallback: sprite.setSequenceEndCallback,
        StartAttack: StartAttack,

        // HitBox and attack related,
        getIndex: sprite.getIndex,
        TryAddHitTargetToArray: TryAddHitTargetToArray,
        EmptyHitTargetArray: EmptyHitTargetArray,
        GetAttackPower: GetAttackPower,
        DealDamage: DealDamage,
        SetAttackCoolDown: SetAttackCoolDown,
        StartKnockBack: StartKnockBack,
        SetKnockBackSpeed: SetKnockBackSpeed,
        CanSpawnProjectile: CanSpawnProjectile,
        ResetCanSpawnProjectile: ResetCanSpawnProjectile,
        AddHealth: AddHealth,
        ResetHP: ResetHP,

        // animation
        GetSequenceList: GetSequenceList,
        SetSequenceEndToIdle: SetSequenceEndToIdle,
        getSequenceEndCallback: sprite.getSequenceEndCallback,
        SetShouldUseWhiteSheet: sprite.SetShouldUseWhiteSheet,
        SetShouldUseCheatSheet: sprite.SetShouldUseCheatSheet,

        //SFX
        SetAttackSFX: SetAttackSFX,

    };
};
