
const Projectile = function(ctx, x, y, gameArea, owner, endPos, launchSpeed, actorID) {

    // x, y refers to starting position of the projectile
    const sprite = Sprite(ctx, x, y);

    const damage = owner.GetAttackPower();

    const disposeTime = 1; // in seconds
    
    let bCanDealDamage = true;

    let velocity = {};

    let sequences = {

    };

    const ID = actorID;

    const GetID = () => {return ID;}

    const GetDamage = () => {return damage;}

    const CanDealDamage = () => {return bCanDealDamage;}

    const CreateSpriteSequences = function(NewSpriteSequence, DefaultSequence, Scale, SheetName) {
        sequences = NewSpriteSequence;
        sprite.setSequence(DefaultSequence).setScale(Scale).useSheet(SheetName);
    };

    const Initialize = function() {
        const angle = Math.atan2(endPos.y - y, endPos.x - x);
        velocity = {x: Math.cos(angle) * launchSpeed, y: Math.sin(angle) * launchSpeed};
    }
    Initialize();

    const Explode = function() {
        // start the explosion animation, and dispose it after some time
        bCanDealDamage = false;
        sprite.setSequence(sequences.explode);
        sprite.setSequenceEndCallback(DisposeProjectile);
        
    };

    const DisposeProjectile = function() {

        for (const projectileName in projectiles) {
            if (projectiles[projectileName].GetID() == GetID()) {
                delete projectiles[projectileName];
                return;
            } 
        }
    }

    

    const MoveProjectile = function() {

        if (!bCanDealDamage) return;

        let { x, y } = sprite.getXY();

        x += velocity.x * deltaTime;
        y += velocity.y * deltaTime;

        /* Set the new position if it is within the game area */
        gameArea.isPointInBox(x, y)? sprite.setXY(x, y) : Explode();
    
    }

    const Update = function(now) {

        sprite.update(now);

        MoveProjectile();

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

        CreateSpriteSequences: CreateSpriteSequences,
        Update: Update,
        GetID: GetID,
        GetDamage: GetDamage,
        CanDealDamage: CanDealDamage,
        Explode: Explode,
    }
};