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


    $(document).on("keydown", function(event) {

        HandleKnightAttackInput(event.keyCode);

    });

    const HandleKnightAttackInput = function(keyCode) {
        /* only for knight to attack */ 
        if (playerType != PLAYER_TYPE.KNIGHT || keyCode != ACTION_KEY.ATTACK) return;
           
        (player.getCurSequence().isLeft)? player.setSequence(sequences.attackLeft, sequences.idleLeft) : 
            player.setSequence(sequences.attackRight, sequences.idleRight);
      
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
        Update: player.Update,
    };
};