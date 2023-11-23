const PlayerWizard = function(ctx, x, y, gameArea, actorID) {

    const player = Player(ctx, x, y, gameArea, actorID);
    
    const magicSpeed = 300;

    const maxHP = 5;

    let playerType = PLAYER_TYPE.WIZARD;

    player.SetMaxHP(maxHP);

    player.SetAttackCoolDown(0.8);

    player.SetWalkSpeed(200);

    const sequences = {
        idleRight: {x:0, y:20, width:128, height:128, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:532, width:128, height:128, count:8, timing:200, loop:true, isLeft: true, startingIndex: 7},

        moveRight: {x:0, y:148, width:128, height:128, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:660, width:128, height:128, count:8, timing:100, loop:true, isLeft: true, startingIndex: 7},

        attackRight: {x:0, y:276, width:128, height:128, count:7, timing:50, loop:false, isLeft: false, startingIndex: 0},
        attackLeft: {x:0, y:788, width:128, height:128, count:7, timing:50, loop:false, isLeft: true, startingIndex: 7},

        dieRight: {x:0, y:404, width:128, height:128, count:4, timing:200, loop:false, isLeft: false, startingIndex: 0},
        dieLeft: {x:0, y:916, width:128, height:128, count:4, timing:200, loop:false, isLeft: true, startingIndex: 7},
    }

    player.SetAttackSFX(referenceLists.MagicSpell, 0);

    player.CreateSpriteSequences(sequences, sequences.idleRight, scale = 1, "assets/sprite/original/player_wizard.png", "assets/sprite/white/player_wizard_white.png");

    const GetHitBox = function() {
        const size = player.getDisplaySize();

        const {x, y} = player.getXY();

        const top = y - size.height * 0.2;
        const bottom = y + size.height * 0.4;
        let left, right;

        if (player.getCurSequence().isLeft) {
            left = x - size.width * 0.15;
            right = x + size.width * 0.3;
        }
        else {
            left = x - size.width * 0.3;
            right = x + size.width * 0.15;
        }

        return BoundingBox(ctx, top, left, bottom, right);
    };

    canvas.addEventListener("click", function (event) {

        HandleWizardAttackInput(event);

    });

    const HandleWizardAttackInput = function(event) {

        if (!player.CanCharAttack() || player.GetFSMState() == FSM_STATE.DEAD) return;

        const {x, y} = player.getXY();
        const playerScale = player.getScale();

        let startPos = {};
        startPos.y = y - (playerScale * 30);

        if (event.clientX < x) {
            // clicked position is to the left of the player character
            startPos.x = x - (playerScale * 30);
            player.setSequence(sequences.attackLeft, sequences.idleLeft)
        }
        else {
            // to the right
            startPos.x = x + (playerScale * 30);
            player.setSequence(sequences.attackRight, sequences.idleRight);
        }

        let rect = canvas.getBoundingClientRect();
        const endPos = {x: event.clientX - rect.left, y: event.clientY - rect.top};



        AddProjectile(players[player.GetID()], PROJECTILE_TYPE.WATERBALL, startPos, endPos, magicSpeed);

        player.StartAttack();
    };

    const Update = function(now) {
        player.Update(now);

    };




    return {
        SetMaxHP: player.SetMaxHP,
        SetWalkSpeed: player.SetWalkSpeed,
        SetAttackPower: player.SetAttackPower,
        GetAttackPower: player.GetAttackPower,
        GetDirection: player.GetDirection,
        getXY: player.getXY,
        CreateSpriteSequences: player.CreateSpriteSequences,
        GetHitBox: GetHitBox,
        TakeDamage: player.TakeDamage,
        GetFSMState: player.GetFSMState,
        getBoundingBox: player.getBoundingBox,
        draw: player.draw,
        Update: Update,
        GetID: player.GetID,
        GetActorType: player.GetActorType,
        AddHealth: player.AddHealth,
        AddPlayerScore: player.AddPlayerScore,
    };
};