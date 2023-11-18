
const Explosion = function(ctx, x, y, gameArea, owner, actorID) {

    // x, y refers to starting position of the projectile
    const sprite = Sprite(ctx, x, y);

    const damage = owner.GetAttackPower();

    let bCanDealDamage = false;

    let hitSFX = new Audio(referenceLists.MagicHit);

    let sequences = {
        idle: {x:0, y:0, width:192, height:192, count:1, timing:250, loop:true, isLeft: false, startingIndex: 0},
        explode: {x:0, y:192, width:192, height:192, count:16, timing:35, loop:false, isLeft: false, startingIndex: 0}
    };

    sprite.setSequence(sequences.idle).setScale(1).useSheet(referenceLists.Explosion);

    const SetRandomPosition = function() {
        const randomX = Math.random() * (gameArea.getRight() - gameArea.getLeft()) + gameArea.getLeft();
        const randomY = Math.random() * (gameArea.getBottom() - gameArea.getTop()) + gameArea.getTop();

        sprite.setXY(randomX, randomY);
    };

    SetRandomPosition();
    
    const ID = actorID;

    const GetID = () => {return ID;}

    const Explode = function() {
        // start the explosion animation, and dispose it after some time
        bCanDealDamage = false;
        sprite.setSequence(sequences.explode);
        sprite.setSequenceEndCallback(DisposeProjectile);
        
    };

    const DisposeThis = function() {

        for (const explosionName in explosions) {
            if (explosions[explosionName].GetID() == GetID()) {
                delete explosions[explosionName];
                return;
            } 
        }
    }

    sprite.setSequenceEndCallback(DisposeThis);

    
    const ExplodeThis = function() {
        bCanDealDamage = true;
        sprite.setSequence(sequences.explode);
        PlaySFX(hitSFX);
        setTimeout(DisposeThis, sequences.explode.timing * sequences.explode.count);
    }

    let explosionTimeMin = owner.GetExplosionTime() * 700;  
    let explosionTimeMax = owner.GetExplosionTime() * 1300;

    setTimeout(ExplodeThis, GetRanNumInRange(explosionTimeMin, explosionTimeMax));


    const HandleHitPlayer = function() {

        if (!owner || !bCanDealDamage) return;

        for (const playerName in players) {
            const curPlayer = players[playerName]; 
            if (curPlayer.GetFSMState() != FSM_STATE.DEAD && GetHitBox().intersect(curPlayer.GetHitBox())) {
                curPlayer.TakeDamage(damage, sprite.getXY());
                bCanDealDamage = false;
                return;
            }
        }
    };

    const GetHitBox = function() {
        const size = sprite.getDisplaySize();

        const {x, y} = sprite.getXY();

        const top = y - size.height * 0.25;
        const left = x - size.width * 0.25;
        const bottom = y + size.height * 0.25;
        const right = x + size.width * 0.25;

        return BoundingBox(ctx, top, left, bottom, right);
    };



    const Update = function(now) {

        sprite.update(now);

        HandleHitPlayer();
 
    };


    return {
        getXY: sprite.getXY,
        getScale: sprite.getScale,
        drawBox: sprite.drawBox,
        getDisplaySize: sprite.getDisplaySize,
        getCurSequence: sprite.getCurSequence,
        draw: sprite.draw,
        setSequence: sprite.setSequence,
        drawBox: sprite.drawBox,
        Update: Update,
        GetID: GetID,
        Explode: Explode,
    }
};