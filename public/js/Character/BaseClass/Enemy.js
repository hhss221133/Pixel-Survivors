const Enemy = function(ctx, x, y, gameArea, enemyID) {

    const character = Character(ctx, x, y, gameArea);

    const ID = enemyID;

    const disposeEnemyTime = 2; // time to dispose the enemy when it is dead (in s)

    const MoveEnemy = function() {

    };

    const GetID = () => {return ID;}


    const TakeDamage = function(damage) {

        character.DealDamage(damage);
        
        let HP = character.GetCurHP();
        if (HP > 0) return;

        // character die
        character.SetFSMState(FSM_STATE.DEAD);
        HandleEnemyDead();
        
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
        for (enemyName in enemies) {
            if (enemies[enemyName].GetID() == ID) {
                delete enemies[ID];
                return;
            } 
        }
    }

    const Update = function(now) {
        character.Update(now);
        MoveEnemy();
    };


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
        getDisplaySize: character.getDisplaySize,
        setSequence: character.setSequence,
        draw: character.draw,
        Update: Update,

        // FSM State related
        GetFSMState: character.GetFSMState,
        SetFSMState: character.SetFSMState,
        CanCharAttack: character.CanCharAttack,
        setSequenceEndCallback: character.setSequenceEndCallback,
        StartAttack: character.StartAttack,
        TakeDamage: TakeDamage,
        DealDamage: character.DealDamage,
        GetCurHP: character.GetCurHP,
        GetID: GetID,
    }
};