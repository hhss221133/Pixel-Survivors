const Plasmaball = function(ctx, x, y, gameArea, owner, endPos, launchSpeed, actorID) {

    const projectile = Projectile(ctx, x, y, gameArea, owner, endPos, launchSpeed, actorID);


    let hitSFX = new Audio(referenceLists.MagicHit);

    const sequences = {
        idle: {x:0, y:0, width:191, height:141, count:2, timing:250, loop:true, isLeft: false, startingIndex: 0},
        explode: {x:0, y:0, width:191, height:141, count:6, timing:50, loop:false, isLeft: false, startingIndex: 0}
    }

    let scale;

    if (owner.GetAttackType() == BOSS_ATTACK_TYPE.FASTSHOOT) scale = 1;
    else if (owner.GetAttackType() == BOSS_ATTACK_TYPE.MULTIPLESHOOT) scale = 0.4;
    else if (owner.GetAttackType() == BOSS_ATTACK_TYPE.NORMALSHOOT) scale = 1.3

    projectile.CreateSpriteSequences(sequences, sequences.idle, scale, referenceLists.Plasmaball);
    

    const GetHitBox = function() {
        const size = projectile.getDisplaySize();

        const {x, y} = projectile.getXY();

        const top = y + size.height * 0.1;
        const left = x - size.width * 0.1;
        const bottom = y + size.height * 0.32;
        const right = x + size.width * 0.1;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    const HandleProjectileHitBox = function() {
        if (!owner) return;

        if (owner.GetActorType() == ACTOR_TYPE.ENEMY) {
            // player's projectile

            for (const playerName in players) {
                const curPlayer = players[playerName]; 
                if (projectile.CanDealDamage() && curPlayer.GetFSMState() != FSM_STATE.DEAD && GetHitBox().intersect(curPlayer.GetHitBox())) {
                        // deal damage to enemy
                        curPlayer.TakeDamage(projectile.GetDamage(), projectile.getXY());
                        projectile.Explode();
                        PlaySFX(hitSFX);
                        return;
                }
            }
        }
    };



    const Update = function(now) {

        projectile.Update(now);

        HandleProjectileHitBox();

    };

    return {
        getXY: projectile.getXY,
        getScale: projectile.getScale,
        drawBox: projectile.drawBox,
        getDisplaySize: projectile.getDisplaySize,
        getCurSequence: projectile.getCurSequence,
        draw: projectile.draw,
        setSequence: projectile.setSequence,
        drawBox: projectile.drawBox,
        CreateSpriteSequences: projectile.CreateSpriteSequences,
        Update: Update,
        GetID: projectile.GetID,
    }

};