/* Component to store the properties for all characters, i.e. player & enemy */

const Character = function(ctx, x, y, gameArea) {
    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    let sequences = {
        /* MUST BE initialized before using!*/
    };

    let maxHP = 50;

    let walkSpeed = 300;

    let attackPower = 1;

    let deltaTime = 0.0167; // frame time for 60fps

    let start = Date.now();

    let direction = {horizontal: DIRECTION_X.STOP, vertical: DIRECTION_Y.STOP};

    const SetMaxHP = function(NewHP) {
        maxHP = NewHP;
    };

    const SetWalkSpeed = function(NewWalkSpeed) {
        walkSpeed = NewWalkSpeed;
    };

    const SetAttackPower = function(NewAttackPower) {
        attackPower = NewAttackPower;
    };

    const CalculateDeltaTime = function() {
        let current = Date.now();
        deltaTime = current - start;
        deltaTime *= 0.001;
        start = current;

    };

    const GetDirection = function() {
        return {... direction};
    };

    /* Create sprite sequeunces specific to each character  */
    const CreateSpriteSequences = function(NewSpriteSequence, DefaultSequence, Scale, SheetName) {
        sequences = NewSpriteSequence;
        sprite.setSequence(DefaultSequence).setScale(Scale).useSheet(SheetName);
    };

    const MoveCharacter = function() {

        // if character is not moving, just return
        if (direction.horizontal == DIRECTION_X.STOP && direction.vertical == DIRECTION_Y.STOP) return;

        let { x, y } = sprite.getXY();

        // Move the character
        switch (direction.horizontal) {
            case DIRECTION_X.LEFT:
                x -= walkSpeed * deltaTime;
                break;
            case DIRECTION_X.RIGHT:
                x += walkSpeed * deltaTime;
                break;
        };

        switch (direction.vertical) {
            case DIRECTION_Y.UP:
                y -= walkSpeed * deltaTime;
                break;
            case DIRECTION_Y.DOWN:
                y += walkSpeed * deltaTime;
                break;
        };

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y))
            sprite.setXY(x, y);
    };

    const ChangeSpriteDirection = function(newDir) {
        
        // To idle
        if (newDir.horizontal == DIRECTION_X.STOP && newDir.vertical == DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.idleLeft) : sprite.setSequence(sequences.idleRight);
        }
        else if (direction.horizontal != newDir.horizontal && newDir.horizontal != DIRECTION_X.STOP) {
            (newDir.horizontal == DIRECTION_X.LEFT)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }
        else if (direction.vertical == DIRECTION_Y.STOP && newDir.vertical != DIRECTION_Y.STOP) {
            (sprite.getCurSequence().isLeft)? sprite.setSequence(sequences.moveLeft) : sprite.setSequence(sequences.moveRight);
        }

        direction = newDir;
    };

    const UpdateSprite = (now) => {sprite.update(now)};

    // deltaTime stores the time in one frame
    const Update = function(now) {

        CalculateDeltaTime();

        MoveCharacter();

        UpdateSprite(now);
    };

    return {
        SetMaxHP: SetMaxHP,
        SetWalkSpeed: SetWalkSpeed,
        SetAttackPower: SetAttackPower,
        GetDirection: GetDirection,
        CreateSpriteSequences: CreateSpriteSequences,
        MoveCharacter: MoveCharacter,
        ChangeSpriteDirection: ChangeSpriteDirection,
        getBoundingBox: sprite.getBoundingBox,
        getCurSequence: sprite.getCurSequence,
        draw: sprite.draw,
        setSequence: sprite.setSequence,
        Update: Update,
    };
};