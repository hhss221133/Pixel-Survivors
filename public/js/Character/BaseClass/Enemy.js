const Enemy = function(ctx, x, y, gameArea, enemyID) {

    const character = Character(ctx, x, y, gameArea);

    const ID = enemyID;

    let disposeEnemyTime = 1; // time to dispose the enemy when it is dead (in second)

    let moveThreshold = 80;   // enemy will stop moving if it is too close to the player

    let yMoveThreshold = 30; 

    let xMoveThreshold = 30;   // to prevent the enemy from changing direction endlessly

    let targetPlayer = null;

    let distanceToPlayer = 0;

    const SetThreshold = function(newMoveThreshold, newXMoveThreshold, newYMoveThreshold){
        moveThreshold = newMoveThreshold;
        yMoveThreshold = newYMoveThreshold;
        xMoveThreshold = newXMoveThreshold;
    };

    const FindTargetPlayer = function() {
        targetPlayer = null;
        let minDistance = Number.POSITIVE_INFINITY;

        for (const player in players) {
            
            if (players[player].GetCurHP() <= 0) continue;

            const playerXY = players[player].getXY();
            const enemyXY = character.getXY();
            let distance = Math.sqrt(Math.pow((playerXY.x - enemyXY.x), 2) + Math.pow((playerXY.y - enemyXY.y), 2) );
            if (distance < minDistance) {
                minDistance = distance;
                targetPlayer = players[player];
            }
        }
        distanceToPlayer = minDistance;
 
    }

    const MoveEnemy = function() {

        let newDir = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};
        if (!targetPlayer) {
            character.ChangeSpriteDirection(newDir);
            return;
        }


        const playerXY = targetPlayer.getXY();
        const enemyXY = character.getXY();
        
        const yDistance = Math.abs(playerXY.y - enemyXY.y);

        if (distanceToPlayer < moveThreshold && yDistance < yMoveThreshold) {
            character.ChangeSpriteDirection(newDir);
            if (character.CanCharAttack()) {
                Attack();
            } 
            return;
        }


        let xDiff = Math.abs(playerXY.x - enemyXY.x);

        if (playerXY.x < enemyXY.x && xDiff > xMoveThreshold) {
            newDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (playerXY.x > enemyXY.x && xDiff > xMoveThreshold) {
            newDir.horizontal = DIRECTION_X.RIGHT;
        }

        if (playerXY.y > enemyXY.y) {
            newDir.vertical = DIRECTION_Y.DOWN;
        }
        else if (playerXY.y < enemyXY.y) {
            newDir.vertical = DIRECTION_Y.UP;
        }

        character.ChangeSpriteDirection(newDir);
    };

    const GetID = () => {return ID;}


    const TakeDamage = function(damage, playerXY) {

        if (character.GetFSMState() == FSM_STATE.DEAD) return;

        character.DealDamage(damage);

        StartKnockBack(playerXY);
        
        let HP = character.GetCurHP();
        if (HP > 0) return;

        // character die
        character.SetFSMState(FSM_STATE.DEAD);
        HandleEnemyDead();
        
    };

    const StartKnockBack = function(playerXY) {

        const enemyXY = character.getXY();

        let knockBackDir = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};

        if (playerXY.x > enemyXY.x) {
            knockBackDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (playerXY.x < enemyXY.x) {
            knockBackDir.horizontal = DIRECTION_X.RIGHT;
        }

        if (playerXY.y > enemyXY.y && Math.abs(playerXY.y - enemyXY.y) > 10) {
            knockBackDir.vertical = DIRECTION_Y.UP;
        }
        else if (playerXY.y < enemyXY.y && Math.abs(playerXY.y - enemyXY.y) > 10) {
            knockBackDir.vertical = DIRECTION_Y.DOWN;
        } 

        character.StartKnockBack(knockBackDir);

    };

    const HandleEnemyDead = function() {

        character.setSequenceEndCallback(EnemyDie);

        (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().dieLeft) :
            character.setSequence(character.GetSequenceList().dieRight);
            
    };

    const EnemyDie = function() {
        setTimeout(DisposeEnemy, disposeEnemyTime * 1000);
    };

    const DisposeEnemy = function() {
        for (enemyName in enemies) {
            if (enemies[enemyName].GetID() == ID) {
                delete enemies[ID];
                return;
            } 
        }
    }

    const Attack = function() {
        character.StartAttack();

        (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().attackLeft, character.GetSequenceList().idleLeft) :
            character.setSequence(character.GetSequenceList().attackRight, character.GetSequenceList().idleRight);
    };

    const Update = function(now) {
        character.Update(now);
        
        
        if (character.GetFSMState() == FSM_STATE.DEAD) return;

        FindTargetPlayer();

        MoveEnemy();

    };

    return {
        SetMaxHP: character.SetMaxHP,
        SetWalkSpeed: character.SetWalkSpeed,
        SetAttackPower: character.SetAttackPower,
        GetDirection: character.GetDirection,
        CreateSpriteSequences: character.CreateSpriteSequences,
        MoveCharacter: character.MoveCharacter,
        getXY: character.getXY,
        getScale: character.getScale,
        drawBox: character.drawBox,
        ChangeSpriteDirection: character.ChangeSpriteDirection,
        getCurSequence: character.getCurSequence,
        getDisplaySize: character.getDisplaySize,
        setSequence: character.setSequence,
        draw: character.draw,
        Update: Update,
        GetID: GetID,

        // FSM State related
        GetFSMState: character.GetFSMState,
        SetFSMState: character.SetFSMState,
        CanCharAttack: character.CanCharAttack,
        setSequenceEndCallback: character.setSequenceEndCallback,

        // attack 
        StartAttack: character.StartAttack,
        TakeDamage: TakeDamage,
        DealDamage: character.DealDamage,
        GetCurHP: character.GetCurHP,
        getIndex: character.getIndex,
        SetAttackCoolDown: character.SetAttackCoolDown,
        TryAddHitTargetToArray: character.TryAddHitTargetToArray,
        GetAttackPower: character.GetAttackPower,
        SetThreshold: SetThreshold,
        SetKnockBackSpeed: character.SetKnockBackSpeed,
        
    }
};