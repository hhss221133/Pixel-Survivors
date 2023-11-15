const Enemy = function(ctx, x, y, gameArea, enemyID) {

    const character = Character(ctx, x, y, gameArea, enemyID);

    let disposeEnemyTime = 1; // time to dispose the enemy when it is dead (in second)

    let moveThreshold = 80;   // enemy will start attack if this is greater than their distance

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
            
            if (players[player].GetFSMState() == FSM_STATE.DEAD) continue;

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

    const GetTargetPlayer = () => {return targetPlayer;}

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

    const TakeDamage = function(damage, playerXY) {

        if (character.GetFSMState() == FSM_STATE.DEAD) return;

        character.DealDamage(damage);

        StartKnockBack(playerXY);
        character.SetShouldUseWhiteSheet();
        
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
        for (const enemyName in enemies) {
            if (enemies[enemyName].GetID() == character.GetID()) {
                delete enemies[character.GetID()];
                return;
            } 
        }
    }

    const IsPlayerAtLeft = function() {
        if (!targetPlayer) return false;

        return (targetPlayer.getXY().x < character.getXY().x)? true : false;
    }

    const Attack = function() {
        character.StartAttack();

        (IsPlayerAtLeft())? character.setSequence(character.GetSequenceList().attackLeft, character.GetSequenceList().idleLeft) :
            character.setSequence(character.GetSequenceList().attackRight, character.GetSequenceList().idleRight);
    };

    const Update = function(now) {
        character.Update(now);
        
        
        if (character.GetFSMState() == FSM_STATE.DEAD) return;

        FindTargetPlayer();

        MoveEnemy();

    };

    const GetActorType = () => ACTOR_TYPE.ENEMY;

    const IsBoss = () => {return false;}

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
        setSequence: character.setSequence,
        draw: character.draw,
        getDisplaySize: character.getDisplaySize,
        Update: Update,
        GetID: character.GetID,
        SetShouldUseWhiteSheet: character.SetShouldUseWhiteSheet,

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
        GetActorType: GetActorType,
        CanSpawnProjectile: character.CanSpawnProjectile,
        ResetCanSpawnProjectile: character.ResetCanSpawnProjectile,
        GetTargetPlayer: GetTargetPlayer,
        IsPlayerAtLeft: IsPlayerAtLeft,
        IsBoss: IsBoss,
        
    }
};