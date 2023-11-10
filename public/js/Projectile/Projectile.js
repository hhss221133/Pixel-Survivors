
const Projectile = function(ctx, x, y, gameArea, owner) {

    const sprite = Sprite(ctx, x, y);

    const damage = owner.GetAttackPower();

    let sequences = {

    };

    const CreateSpriteSequences = function(NewSpriteSequence, DefaultSequence, Scale, SheetName) {
        sequences = NewSpriteSequence;
        sprite.setSequence(DefaultSequence).setScale(Scale).useSheet(SheetName);
    };


    return {
        getXY: sprite.getXY,
        getScale: sprite.getScale,
        drawBox: sprite.drawBox,
        getDisplaySize: sprite.getDisplaySize,
        getCurSequence: sprite.getCurSequence,
        draw: sprite.draw,
        setSequence: sprite.setSequence,

        CreateSpriteSequences: CreateSpriteSequences,
    }
};