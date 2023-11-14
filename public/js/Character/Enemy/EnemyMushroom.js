const EnemyMushroom = function(ctx, x, y, gameArea, enemyID) {

    const enemy = Enemy(ctx, x, y, gameArea, enemyID);

    enemy.SetAttackCoolDown(3.5);

    enemy.SetKnockBackSpeed(350);

    enemy.SetThreshold(300, 150, 1000);

    enemy.SetMaxHP(3);
    
    let fireballSpeed = 150;

    const sequences = {
        idleRight: {x:0, y:0, width:150, height:150, count:4, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:600, width:150, height:150, count:4, timing:200, loop:true, isLeft: true, startingIndex: 7},

        moveRight: {x:0, y:150, width:150, height:150, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:750, width:150, height:150, count:8, timing:100, loop:true, isLeft: true, startingIndex: 7},

        attackRight: {x:0, y:300, width:150, height:150, count:8, timing:100, loop:false, isLeft: false, startingIndex: 0, attackIndex: 6},
        attackLeft: {x:0, y:900, width:150, height:150, count:8, timing:100, loop:false, isLeft: true, startingIndex: 7, attackIndex: 1},

        dieRight: {x:0, y:450, width:150, height:150, count:4, timing:200, loop:false, isLeft: false, startingIndex: 0},
        dieLeft: {x:0, y:1050, width:150, height:150, count:4, timing:200, loop:false, isLeft: true, startingIndex: 7},
    };

    enemy.CreateSpriteSequences(sequences, sequences.idleRight, scale = 1.8, "assets/original/enemy_mushroom.png", "assets/white/enemy_mushroom_white.png");

    const GetHitBox = function() {
        const size = enemy.getDisplaySize();

        const {x, y} = enemy.getXY();

        const top = y - size.height * 0.1;
        const left = x - size.width * 0.1;
        const bottom = y + size.height * 0.2;
        const right = x + size.width * 0.1;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const HandleSpawnProjectile = function() {

        if (!enemy.CanSpawnProjectile()) return;

        const sequence = enemy.getCurSequence();

        if (sequence.isLeft) {
            if (enemy.getIndex() <= sequence.attackIndex) {
                enemy.ResetCanSpawnProjectile();
                SpawnFireball();
            }
        }
        else {
            // right animation
            if (enemy.getIndex() >= sequence.attackIndex) {
                enemy.ResetCanSpawnProjectile();
                SpawnFireball();
            }
        }
    };

    const SpawnFireball = function() {
        
        const targetPlayer = enemy.GetTargetPlayer();

        if (!targetPlayer) return;
       

        const {x, y} = enemy.getXY();
        const enemyScale = enemy.getScale();

        let startPos = {};
        startPos.y = y;

        if (enemy.getCurSequence().isLeft) {
            startPos.x = x - (enemyScale * 30);
        }
        else {
            startPos.x = x + (enemyScale * 30);
        }

        const endPos = targetPlayer.getXY();

        AddProjectile(enemies[enemy.GetID()], PROJECTILE_TYPE.FIREBALL, startPos, endPos, fireballSpeed);

    };



    const Update = function(now) {
        enemy.Update(now);

        HandleSpawnProjectile();
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

        // HitBox and attackrelated
        GetHitBox: GetHitBox,
        TakeDamage: enemy.TakeDamage,
        GetID: enemy.GetID,
        GetAttackPower: enemy.GetAttackPower,

    }
};