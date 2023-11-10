const PlayerKnight = function(ctx, x, y, gameArea) {

    const player = Player(ctx, x, y, gameArea);

    let playerType = PLAYER_TYPE.KNIGHT;

    const sequences = {
        idleRight: {x:0, y:0, width:100, height:55, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:495, width:100, height:55, count:8, timing:200, loop:true, isLeft: true, startingIndex: 9},

        moveRight: {x:0, y:55, width:100, height:55, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:550, width:100, height:55, count:8, timing:100, loop:true, isLeft: true, startingIndex: 9},

        attackRight: {x:0, y:165, width:100, height:55, count:8, timing:50, loop:false, isLeft: false, startingIndex: 0, attackIndex: 2},
        attackLeft: {x:0, y:660, width:100, height:55, count:8, timing:50, loop:false, isLeft: true, startingIndex: 9, attackIndex: 7},

        dieRight: {x:0, y:275, width:100, height:55, count:8, timing:100, loop:false, isLeft: false, startingIndex: 0},
        dieLeft: {x:0, y:770, width:100, height:55, count:8, timing:100, loop:false, isLeft: true, startingIndex: 9},

    }

    player.CreateSpriteSequences(sequences, sequences.idleRight, scale = 2, "assets/player_knight.png");


    const GetHitBox = function() {
        const size = player.getDisplaySize();

        const {x, y} = player.getXY();

        const top = y - size.height * 0.25;
        const left = x - size.width * 0.2;
        const bottom = y + size.height * 0.45;
        const right = x + size.width * 0.2;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const GetAttackHitBox = function() {
        const playerScale = player.getScale();

        const size = player.getDisplaySize();
        const {x, y} = player.getXY();
        const top = y - size.height * 0.25 - (playerScale * 10);
        const bottom = y + size.height * 0.45 + (playerScale * 5);
        let left, right;

        if (player.getCurSequence().isLeft) {
            left = x - size.width * 0.2 - (playerScale * 35);
            right = x + size.width * 0.2;
        }
        else {
            left = x - size.width * 0.2;
            right = x + size.width * 0.2 + (playerScale * 35);
        }

        return BoundingBox(ctx, top, left, bottom, right);
    };


    $(document).on("keydown", function(event) {

        HandleKnightAttackInput(event.keyCode);

    });

    const HandleKnightAttackInput = function(keyCode) {
        /* only for knight to attack */ 
        if (keyCode != ACTION_KEY.ATTACK || !player.CanCharAttack()) return;

        player.StartAttack();
        
        (player.getCurSequence().isLeft)? player.setSequence(sequences.attackLeft, sequences.idleLeft) :
            player.setSequence(sequences.attackRight, sequences.idleRight);
        
    };

    const HandleAttackHitBox = function() {
        // only enable the hitbox when the character is attacking
        if (player.GetFSMState() != FSM_STATE.ATTACK || !player.getCurSequence().attackIndex) return;

        const sequence = player.getCurSequence();



        if (sequence.isLeft) {
            if (player.getIndex() <= sequence.attackIndex) {
                CheckHitEnemy();
            }
        }
        else {
            // right animation
            if (player.getIndex() >= sequence.attackIndex) {
                CheckHitEnemy();
            }
        }
    };

    const CheckHitEnemy = function() {
        // check if player hits any enemy
        for (const enemyName in enemies) {
            if (GetAttackHitBox().intersect(enemies[enemyName].GetHitBox())) {
                if (player.TryAddHitTargetToArray(enemies[enemyName])) {
                    // deal damage to enemy
                    enemies[enemyName].TakeDamage(player.GetAttackPower(), player.getXY());
                }
            }
        }
    };


    const Update = function(now) {

        player.Update(now);

        HandleAttackHitBox();
    };




    return {
        SetMaxHP: player.SetMaxHP,
        SetWalkSpeed: player.SetWalkSpeed,
        SetAttackPower: player.SetAttackPower,
        GetAttackPower: player.GetAttackPower,
        GetDirection: player.GetDirection,
        getXY: player.getXY,
        CreateSpriteSequences: player.CreateSpriteSequences,
        MoveCharacter: player.MoveCharacter,
        ChangeSpriteDirection: player.ChangeSpriteDirection,
        GetHitBox: GetHitBox,
        draw: player.draw,
        Update: Update,
        TakeDamage: player.TakeDamage,
        GetCurHP: player.GetCurHP,
    };
};