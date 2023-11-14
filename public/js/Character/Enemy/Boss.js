const Boss = function(ctx, x, y, gameArea, enemyID) {

    const character = Character(ctx, x, y, gameArea, enemyID);

    character.SetMaxHP(200);

    character.SetAttackCoolDown(5);

    character.SetWalkSpeed(50);

    character.SetKnockBackSpeed(150);

    let attackType = BOSS_ATTACK_TYPE.NONE;

    let targetPlayer = null;

    let moveThreshold = 500;

    let xMoveThreshold = 20;   // to prevent the enemy from changing direction endlessly

    let summonCoolDown = {1: 5, 2: 18, 3: 15, 4: 13, 5: 10}; 

    let bCanSummon = true;

    let bossStage = 1; // boss has 3 stages, attack patterns change with it

    const summonMaxNum = {1: 2, 2: 3, 3: 4, 4: 5, 5: 7}; // max number of enemies to be summoned on the field, not including boss itself

    const normalShootSpeed = {1: 200, 2: 250, 3: 300};

    const fastShootSpeed = {3: 600, 4: 700, 5: 800};

    const multipleShootCount = {1: 5, 2: 4, 3: 5, 4: 5, 5: 5}; 

    const multipleShootSpeed = {1: 150, 2: 200, 3: 225, 4: 250, 5: 300};



    const GetAttackType = () => {return attackType;}

    const GetActorType = () => {return ACTOR_TYPE.ENEMY;}

    const sequences = {
        idleRight: {x:0, y:0, width:140, height:93, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:651, width:140, height:93, count:8, timing:100, loop:true, isLeft: true, startingIndex: 9},

        moveRight: {x:0, y:93, width:140, height:93, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:744, width:140, height:93, count:8, timing:100, loop:true, isLeft: true, startingIndex: 9},

        normalshootRight: {x:0, y:186, width:140, height:93, count:7, timing:80, loop:false, isLeft: false, startingIndex: 0, attackIndex: 4},
        normalshootLeft: {x:0, y:837, width:140, height:93, count:7, timing:80, loop:false, isLeft: true, startingIndex: 9, attackIndex: 5},

        fastshootRight: {x:0, y:186, width:140, height:93, count:7, timing:200, loop:false, isLeft: false, startingIndex: 0, attackIndex: 4},
        fastshootLeft: {x:0, y:837, width:140, height:93, count:7, timing:200, loop:false, isLeft: true, startingIndex: 9, attackIndex: 5},

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

    const NormalShoot = function() {

        attackType = BOSS_ATTACK_TYPE.NORMALSHOOT;

        IsPlayerAtLeft()? character.setSequence(sequences.normalshootLeft, sequences.idleLeft) :
            character.setSequence(sequences.normalshootRight, sequences.idleRight);
    };

    const FastShoot = function() {

        attackType = BOSS_ATTACK_TYPE.FASTSHOOT;

        IsPlayerAtLeft()? character.setSequence(sequences.fastshootLeft, sequences.idleLeft) :
            character.setSequence(sequences.fastshootRight, sequences.idleRight);

    };

    const MultipleShoot = function() {

        attackType = BOSS_ATTACK_TYPE.MULTIPLESHOOT;

        IsPlayerAtLeft()? character.setSequence(sequences.fastshootLeft, sequences.idleLeft) :
            character.setSequence(sequences.fastshootRight, sequences.idleRight);
    };

    const Teleport = function() {

    };

    const RandomAttack = function() {

        character.StartAttack();

        MultipleShoot();
        return;

        if (TrySummonEnemy()) return; // summoning enemy has highest priority 

        if (bossStage == 1) {
            // stage 1 => P(Normal Shoot) = 0.7, P(Multiple Shoot) = 0.3
            const ranNum = Math.floor(Math.random() * 10);
            (ranNum <= 2)? MultipleShoot() : NormalShoot();
        }

        else if (bossStage == 2) {

        }

        else {

        }

    };

    const IsPlayerAtLeft = function() {
        if (!targetPlayer) return false;

        return (targetPlayer.getXY().x < character.getXY().x)? true : false;
    }

    const IsAttack = function() {
        return attackType != BOSS_ATTACK_TYPE.NONE && attackType != BOSS_ATTACK_TYPE.TELEPORT;
    }

    const HandleSpawnAttack = function() {
        // spawn projectile or AOE when the sprite index is correct

        if (!IsAttack() || !character.CanSpawnProjectile()) return;

        const sequence = character.getCurSequence();

        if ((sequence.isLeft && character.getIndex() > sequence.attackIndex) || (!sequence.isLeft && character.getIndex() <sequence.attackIndex)) return;

        character.ResetCanSpawnProjectile();

        switch (attackType) {
            case BOSS_ATTACK_TYPE.NORMALSHOOT:
                SpawnNormalPlasmaball();
                break;
            case BOSS_ATTACK_TYPE.MULTIPLESHOOT:
                SpawnMultiplePlasmaball();
                break;
            case BOSS_ATTACK_TYPE.FASTSHOOT:
                SpawnFastPlasmaball();
                break;
            case BOSS_ATTACK_TYPE.AOE:
                SpawnAOE();
                break;
        }
    };

    const SpawnNormalPlasmaball = function() {
        if (!targetPlayer) return;

        const startPos = GetProjectileSpawnPos();
       
        const endPos = targetPlayer.getXY();

        AddProjectile(enemies[character.GetID()], PROJECTILE_TYPE.PLASMABALL, startPos, endPos, normalShootSpeed[bossStage]);
    };

    const SpawnMultiplePlasmaball = function() {

        if (!targetPlayer) return;

        // the left and right boundary are 45 degree from the player's position

        const startPos = GetProjectileSpawnPos();

        const angleInterval = Math.PI / 2 / (multipleShootCount[bossStage] - 1);

        let curEndPos = GetRotatedEndPos(-Math.PI / 4, null);

        for (let i = 0; i < multipleShootCount[bossStage]; i++) {
            AddProjectile(enemies[character.GetID()], PROJECTILE_TYPE.PLASMABALL, startPos, curEndPos, multipleShootSpeed[bossStage]);
            curEndPos = GetRotatedEndPos(angleInterval, curEndPos);
        }
    };

    const GetRotatedEndPos = function(angle, startingEndPos = null) {

        if (!targetPlayer) return;
        // the rotation is clockwise when positive

        const startPos = GetProjectileSpawnPos();
        const endPos = (startingEndPos == null)? targetPlayer.getXY() : startingEndPos;

        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;

        // calculate by 2d rotation matrix
        const newX = startPos.x + dx * Math.cos(angle) - dy * Math.sin(angle);
        const newY = startPos.y + dx * Math.sin(angle) + dy * Math.cos(angle);

        return { x: newX, y: newY };
    }

    const SpawnFastPlasmaball = function() {
        if (!targetPlayer) return;

        const startPos = GetProjectileSpawnPos();
       
        const endPos = targetPlayer.getXY();

        AddProjectile(enemies[character.GetID()], PROJECTILE_TYPE.PLASMABALL, startPos, endPos, fastShootSpeed[bossStage]);

    };

    const SpawnAOE = function() {

    };

    const GetProjectileSpawnPos = function() {
        const {x, y} = character.getXY();
        const enemyScale = character.getScale();

        let pos = {x: 0, y: 0};
        pos.y = y + (enemyScale * 22);

        if (character.getCurSequence().isLeft) {
            pos.x = x - (enemyScale * 50);
        }
        else {
            pos.x = x + (enemyScale * 50);
        }
        return pos;
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

        for (let i = enemyNum; i < summonMaxNum[bossStage]; i++) {
            const enemyType = FindRandomEnemyType();
            const summonPos = FindRandomSpawnPosition();
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

        HandleSpawnAttack();

    };

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

    return {
        Update: Update,
        GetID: character.GetID,
        GetFSMState: character.GetFSMState,
        draw: character.draw,
        GetActorType: GetActorType,
        GetHitBox: GetHitBox,
        GetAttackType: GetAttackType,
        GetAttackPower: character.GetAttackPower,
        TakeDamage: TakeDamage
    }

};