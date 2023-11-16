const EnemyFlyingEye = function(ctx, x, y, gameArea, enemyID) {

    const enemy = Enemy(ctx, x, y, gameArea, enemyID);

    enemy.SetAttackCoolDown(2);

    enemy.SetMaxHP(2);

    enemy.SetWalkSpeed(80);

    enemy.SetThreshold(50, 50, 50);

    enemy.SetKnockBackSpeed(500);

    const sequences = {
        idleRight: {x:0, y:0, width:150, height:150, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:450, width:150, height:150, count:8, timing:200, loop:true, isLeft: true, startingIndex: 7},

        moveRight: {x:0, y:0, width:150, height:150, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:450, width:150, height:150, count:8, timing:200, loop:true, isLeft: true, startingIndex: 7},

        attackRight: {x:0, y:150, width:150, height:150, count:8, timing:150, loop:false, isLeft: false, startingIndex: 0, attackIndex: 5},
        attackLeft: {x:0, y:600, width:150, height:150, count:8, timing:150, loop:false, isLeft: true, startingIndex: 7, attackIndex: 2},

        dieRight: {x:0, y:300, width:150, height:150, count:4, timing:150, loop:false, isLeft: false, startingIndex: 0},
        dieLeft: {x:0, y:750, width:150, height:150, count:4, timing:150, loop:false, isLeft: true, startingIndex: 7},
    };

    enemy.SetAttackSFX(referenceLists.FlyingEyeAttack, sequences.attackRight.timing * sequences.attackRight.attackIndex);

    enemy.CreateSpriteSequences(sequences, sequences.idleRight, scale = 1.5, referenceLists.FlyingEyeOriginal, referenceLists.FlyingEyeWhite);

    const GetHitBox = function() {
        const size = enemy.getDisplaySize();

        const {x, y} = enemy.getXY();

        const top = y - size.height * 0.15;
        const left = x - size.width * 0.15;
        const bottom = y + size.height * 0.15;
        const right = x + size.width * 0.2;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const GetAttackHitBox = function() {

        const enemyScale = enemy.getScale();

        const size = enemy.getDisplaySize();
        const {x, y} = enemy.getXY();
        const top = y - size.height * 0.18;
        const bottom = y + size.height * 0.15;
        
        let left, right;

        if (enemy.getCurSequence().isLeft) {
            left = x - size.width * 0.2;
            right = x + size.width * 0.1;
        }
        else {
            left = x - size.width * 0.1;
            right = x + size.width * 0.2;
        }

        return BoundingBox(ctx, top, left, bottom, right);
    }

    const HandleAttackHitBox = function() {

        // only enable the hitbox when the character is attacking
        if (enemy.GetFSMState() != FSM_STATE.ATTACK || !enemy.getCurSequence().attackIndex) return;

        const sequence = enemy.getCurSequence();

        if (sequence.isLeft) {
            if (enemy.getIndex() <= sequence.attackIndex) {
                CheckHitPlayer();
            }
        }
        else {
            // right animation
            if (enemy.getIndex() >= sequence.attackIndex) {
                CheckHitPlayer();
            }
        }
    };

    const CheckHitPlayer = function() {
        // check if player hits any enemy
        for (const playerName in players) {
            if (GetAttackHitBox().intersect(players[playerName].GetHitBox())) {
                if (enemy.TryAddHitTargetToArray(players[playerName])) {
                    // deal damage to enemy
                    players[playerName].TakeDamage(enemy.GetAttackPower(), enemy.getXY());
                }
            }
        }
    };

    const Update = function(now) {
        enemy.Update(now);

        HandleAttackHitBox();
    };

    return {
        SetMaxHP: enemy.SetMaxHP,
        SetWalkSpeed: enemy.SetWalkSpeed,
        SetAttackPower: enemy.SetAttackPower,
        GetDirection: enemy.GetDirection,
        CreateSpriteSequences: enemy.CreateSpriteSequences,
        MoveCharacter: enemy.MoveCharacter,
        getXY: enemy.getXY,
        getScale: enemy.getScale,
        drawBox: enemy.drawBox,
        ChangeSpriteDirection: enemy.ChangeSpriteDirection,
        getCurSequence: enemy.getCurSequence,
        getDisplaySize: enemy.getDisplaySize,
        setSequence: enemy.setSequence,
        draw: enemy.draw,
        Update: Update,
        GetActorType: enemy.GetActorType,

        // FSM State related
        GetFSMState: enemy.GetFSMState,
        SetFSMState: enemy.SetFSMState,
        CanCharAttack: enemy.CanCharAttack,
        setSequenceEndCallback: enemy.setSequenceEndCallback,
        StartAttack: enemy.StartAttack,

        // HitBox related
        GetHitBox: GetHitBox,
        GetAttackHitBox: GetAttackHitBox,
        TakeDamage: enemy.TakeDamage,
        GetID: enemy.GetID,
        IsBoss: enemy.IsBoss,

        

    }
};