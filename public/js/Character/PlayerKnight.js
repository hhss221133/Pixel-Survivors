const PlayerKnight = function(ctx, x, y, gameArea) {

    const player = Player(ctx, x, y, gameArea);

    let playerType = PLAYER_TYPE.KNIGHT;

    const sequences = {
        idleRight: {x:0, y:0, width:100, height:55, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:495, width:100, height:55, count:8, timing:200, loop:true, isLeft: true, startingIndex: 9},

        moveRight: {x:0, y:55, width:100, height:55, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:550, width:100, height:55, count:8, timing:200, loop:true, isLeft: true, startingIndex: 9},

        attackRight: {x:0, y:165, width:100, height:55, count:8, timing:50, loop:false, isLeft: false, startingIndex: 0},
        attackLeft: {x:0, y:660, width:100, height:55, count:8, timing:50, loop:false, isLeft: true, startingIndex: 9}
    }

    player.CreateSpriteSequences(sequences, sequences.idleRight, scale = 2, "../../assets/player_knight.png");


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

    const Update = function(now) {
        player.Update(now);

        GetAttackHitBox();
    };




    return {
        SetMaxHP: player.SetMaxHP,
        SetWalkSpeed: player.SetWalkSpeed,
        SetAttackPower: player.SetAttackPower,
        GetDirection: player.GetDirection,
        CreateSpriteSequences: player.CreateSpriteSequences,
        MoveCharacter: player.MoveCharacter,
        ChangeSpriteDirection: player.ChangeSpriteDirection,
        getBoundingBox: player.getBoundingBox,
        draw: player.draw,
        Update: Update,
    };
};