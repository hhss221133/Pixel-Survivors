const Boss = function(ctx, x, y, gameArea, enemyID) {

    const character = Character(ctx, x, y, gameArea, enemyID);

    character.SetMaxHP(200);

    character.SetAttackCoolDown(3);

    character.SetWalkSpeed(50);

    let targetPlayer = null;

    let moveThreshold = 500;

    let xMoveThreshold = 20;   // to prevent the enemy from changing direction endlessly

    let summonCoolDown = {1: 20, 2: 18, 3: 15, 4: 13, 5: 10}; 

    let bCanSummon = true;

    let bossStage = 1; // boss has 3 stages, attack patterns change with it

    const summonMaxNum = {1: 2, 2: 3, 3: 4, 4: 5, 5: 7}; // max number of enemies to be summoned on the field, not including boss itself

    const GetActorType = () => {return ACTOR_TYPE.ENEMY;}

    const sequences = {
        idleRight: {x:0, y:0, width:140, height:93, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:651, width:140, height:93, count:8, timing:100, loop:true, isLeft: true, startingIndex: 9},

        moveRight: {x:0, y:93, width:140, height:93, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:744, width:140, height:93, count:8, timing:100, loop:true, isLeft: true, startingIndex: 9},

        attackRight: {x:0, y:186, width:140, height:93, count:10, timing:100, loop:false, isLeft: false, startingIndex: 0, attackIndex: 4},
        attackLeft: {x:0, y:837, width:140, height:93, count:10, timing:100, loop:false, isLeft: true, startingIndex: 9, attackIndex: 5},

        teleportStartRight: {x:0, y:279, width:140, height:93, count:10, timing:100, loop:false, isLeft: false, startingIndex: 0},
        teleportStartLeft: {x:0, y:930, width:140, height:93, count:10, timing:100, loop:false, isLeft: true, startingIndex: 9},

        summonRight: {x:0, y:372, width:140, height:93, count:9, timing:150, loop:false, isLeft: false, startingIndex: 0},
        summonLeft: {x:0, y:1023, width:140, height:93, count:9, timing:150, loop:false, isLeft: true, startingIndex: 9},

        dieRight: {x:0, y:465, width:140, height:93, count:3, timing:800, loop:false, isLeft: false, startingIndex: 0},
        dieLeft: {x:0, y:1116, width:140, height:93, count:3, timing:800, loop:false, isLeft: true, startingIndex: 9},

        teleportEndRight: {x:0, y:558, width:140, height:93, count:10, timing:100, loop:false, isLeft: false, startingIndex: 0},
        teleportEndLeft: {x:0, y:1209, width:140, height:93, count:10, timing:100, loop:false, isLeft: true, startingIndex: 9},
    };

    character.CreateSpriteSequences(sequences, sequences.moveRight, scale = 3, "/public/assets/boss.png");

    const GetHitBox = function() {
        const size = character.getDisplaySize();

        const {x, y} = character.getXY();

        const top = y - size.height * 0.1;
        const bottom = y + size.height * 0.5;
        let left;
        let right; 

        if (character.getCurSequence().isLeft) {
            left = x - size.width * 0.22
            right = x + size.width * 0.18;
        }
        else {
            left = x - size.width * 0.18; 
            right = x + size.width * 0.22;
        }

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const FindTargetPlayer = function() {

        let keys = Object.keys(players);

        targetPlayer = players[keys[parseInt(keys.length * Math.random())]];
    }

    FindTargetPlayer();

    const ResetCanSummon = () => {bCanSummon = true;}

    const RandomAttack = function() {

        character.StartAttack();

        if (TrySummonEnemy()) return;



        if (bossStage == 1) {
        //    (character.getCurSequence().isLeft)? character.setSequence(character.GetSequenceList().attackLeft, character.GetSequenceList().idleLeft) :
         //   character.setSequence(character.GetSequenceList().attackRight, character.GetSequenceList().idleRight);
        }

        else if (bossStage == 2) {

        }

        else {

        }

    };

    const TrySummonEnemy = function() {

        if (!bCanSummon) return false;

        bCanSummon = false;

        const enemyNum = Object.keys(enemies).length - 1;

        if (enemyNum >= summonMaxNum[bossStage]) return false;

        // should summon enemy
        (character.getCurSequence().isLeft)? character.setSequence(sequences.summonLeft, sequences.idleLeft) :
            character.setSequence(sequences.summonRight, sequences.idleRight);

        setTimeout(SummonEnemy, 900);
        setTimeout(ResetCanSummon, Math.random() * (summonCoolDown[bossStage]*1.3 - summonCoolDown[bossStage]*0.7) + summonCoolDown[bossStage]*0.7);
        return true;

    }

    const SummonEnemy = function() {

        const enemyNum = Object.keys(enemies).length - 1;

        for (let i = enemyNum; i <= summonMaxNum[bossStage]; i++) {
            const enemyType = FindRandomEnemyType();
            const summonPos = FindRandomSummonPosition();
            AddEnemy(enemyType, summonPos.x, summonPos.y);
        }
    };

    const FindRandomEnemyType = function() {

        let enemyType;

        if (bossStage == 1) {
            // stage 1 => P(FlyingEye) = 1
            enemyType = ENEMY_TYPE.FLYINGEYE;
        }
        else if (bossStage == 2) {
            const ranNum = Math.floor(Math.random() * 3);
            // stage 2 => P(FlyingEye) = 2/3, P(Skeleton) = 1/3
            enemyType = (ranNum <= 1)? ENEMY_TYPE.FLYINGEYE : ENEMY_TYPE.SKELETON;      
        }
        else if (bossStage == 3) {
            // stage 3 => P(FlyingEye) = 0.4, P(Skeleton) = 0.4, P(Mushroom) = 0.2
            const ranNum = Math.floor(Math.random() * 9);
            if (ranNum <= 3) enemyType = ENEMY_TYPE.FLYINGEYE;
            else if (ranNum <= 7) enemyType = ENEMY_TYPE.SKELETON;
            else enemyType = ENEMY_TYPE.MUSHROOM;
        }
        else if (bossStage == 4) {
            const ranNum = Math.floor(Math.random() * 9);
            // stage 4 => P(FlyingEye) = 0.2, P(Skeleton) = 0.4, P(Mushroom) = 0.4
            if (ranNum <= 1) enemyType = ENEMY_TYPE.FLYINGEYE;
            else if (ranNum <= 5) enemyType = ENEMY_TYPE.SKELETON;
            else enemyType = ENEMY_TYPE.MUSHROOM;
        }
        else {
            const ranNum = Math.floor(Math.random() * 9);
            // stage 5 => P(Skeleton) = 0.4, P(Mushroom) = 0.6
            enemyType = (ranNum <= 3)? ENEMY_TYPE.SKELETON : ENEMY_TYPE.MUSHROOM; 
        }

        return enemyType;
    };

    const FindRandomSummonPosition = function() {
 
        const IsEmptyPosition = function(x, y) {
            // check if there are any players near the target position
            for(const playerName in players) {
                const curPlayerPos = players[playerName].getXY();
                const disToPlayer = Math.sqrt(Math.pow((curPlayerPos.x - x), 2) + Math.pow((curPlayerPos.y - y), 2) );
                if (disToPlayer < 150) return false;
            }
            return true;
        };

        let randomX, randomY;
        do {
            randomX = Math.random() * (gameArea.getRight() - gameArea.getLeft()) + gameArea.getLeft();
            randomY = Math.random() * (gameArea.getBottom() - gameArea.getTop()) + gameArea.getTop();
        } while (!IsEmptyPosition(randomX, randomY));
        return {x: randomX, y: randomY};
    };

    const MoveBoss = function() {

        let newDir = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};

        if (!targetPlayer) {
            character.ChangeSpriteDirection(newDir);
            return;
        }

        const playerXY = targetPlayer.getXY();
        const bossXY = character.getXY();

        const distanceToPlayer = Math.sqrt(Math.pow((playerXY.x - bossXY.x), 2) + Math.pow((playerXY.y - bossXY.y), 2) );

        if (distanceToPlayer < moveThreshold) {
            character.ChangeSpriteDirection(newDir);
            if (character.CanCharAttack()){
                RandomAttack();
            } 
            return;
        }



        let xDiff = Math.abs(playerXY.x - bossXY.x);

        if (playerXY.x < bossXY.x && xDiff > xMoveThreshold) {
            newDir.horizontal = DIRECTION_X.LEFT;
        }
        else if (playerXY.x > bossXY.x && xDiff > xMoveThreshold) {
            newDir.horizontal = DIRECTION_X.RIGHT;
        }

        if (playerXY.y > bossXY.y) {
            newDir.vertical = DIRECTION_Y.DOWN;
        }
        else if (playerXY.y < bossXY.y) {
            newDir.vertical = DIRECTION_Y.UP;
        }

        character.ChangeSpriteDirection(newDir);

    };


    const Update = function(now) {

        character.Update(now);
        
        if (character.GetFSMState() == FSM_STATE.DEAD) return;

        MoveBoss();

    };

    return {
        Update: Update,
        GetID: character.GetID,
        GetFSMState: character.GetFSMState,
        draw: character.draw,
        GetActorType: GetActorType,
        GetHitBox: GetHitBox,
    }


};