const Fireball = function(ctx, x, y, gameArea, owner, endPos, launchSpeed, actorID) {

    let spawnSPX = new Audio(referenceLists.FireballSpawn);

    let hitSFX = new Audio(referenceLists.MagicHit);

    const projectile = Projectile(ctx, x, y, gameArea, owner, endPos, launchSpeed, actorID);

    const sequences = {
        idle: {x:0, y:0, width:191, height:141, count:2, timing:250, loop:true, isLeft: false, startingIndex: 0},
        explode: {x:0, y:0, width:191, height:141, count:6, timing:50, loop:false, isLeft: false, startingIndex: 0}
    }

    projectile.CreateSpriteSequences(sequences, sequences.idle, scale = 0.65, referenceLists.Fireball);

    PlaySFX(spawnSPX);

    const GetHitBox = function() {
        const size = projectile.getDisplaySize();

        const {x, y} = projectile.getXY();

        const top = y - size.height * 0.01;
        const left = x - size.width * 0.15;
        const bottom = y + size.height * 0.45;
        const right = x + size.width * 0.15;

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