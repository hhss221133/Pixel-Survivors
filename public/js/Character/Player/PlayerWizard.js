const PlayerWizard = function(ctx, x, y, gameArea) {

    const player = Player(ctx, x, y, gameArea);

    let playerType = PLAYER_TYPE.WIZARD;

    const sequences = {
        idleRight: {x:0, y:20, width:128, height:128, count:8, timing:200, loop:true, isLeft: false, startingIndex: 0},
        idleLeft: {x:0, y:537, width:128, height:128, count:8, timing:200, loop:true, isLeft: true, startingIndex: 7},

        moveRight: {x:0, y:148, width:128, height:128, count:8, timing:100, loop:true, isLeft: false, startingIndex: 0},
        moveLeft: {x:0, y:660, width:128, height:128, count:8, timing:100, loop:true, isLeft: true, startingIndex: 7},

        attackRight: {x:0, y:276, width:128, height:128, count:7, timing:50, loop:false, isLeft: false, startingIndex: 0},
        attackLeft: {x:0, y:788, width:128, height:128, count:7, timing:50, loop:false, isLeft: true, startingIndex: 7}
    }

    player.CreateSpriteSequences(sequences, sequences.idleRight, scale = 1.2, "../../assets/player_wizard.png");


    const GetHitBox = function() {
        const size = player.getDisplaySize();

        const {x, y} = player.getXY();

        const top = y - size.height * 0.25;
        const left = x - size.width * 0.3;
        const bottom = y + size.height * 0.45;
        const right = x + size.width * 0.3;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const HandleWizardAttackInput = function() {



        player.StartAttack();
        
        (player.getCurSequence().isLeft)? player.setSequence(sequences.attackLeft, sequences.idleLeft) : 
            player.setSequence(sequences.attackRight, sequences.idleRight);
    };

    const Update = function(now) {
        player.Update(now);
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