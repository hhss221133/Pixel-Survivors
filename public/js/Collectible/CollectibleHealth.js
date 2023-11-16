const CollectibleHealth = function(actorID){
    const sprite = Sprite(context, 0, 0);

    const ID = actorID;

    const healthPoint = 1;

    let moveSpeed = GetRanNumInRange(200, 800);
    let velocity = {x: 0, y: 0};

    const CalculateVelocity = function() {
        const ranNum = Math.floor(Math.random() * 4); // 0,1,2,3

        let startPos = {x: 0, y: 0};
        let endPos = {x: 0, y: 0};

        if (ranNum == 0) {
            // left
            startPos.x = gameArea.getLeft();
            endPos.x = gameArea.getRight();

            startPos.y = GetRanNumInRange(gameArea.getTop(), gameArea.getBottom());
            endPos.y = GetRanNumInRange(gameArea.getTop(), gameArea.getBottom());
        }
        else if (ranNum == 1) {
            // right
            startPos.x = gameArea.getRight();
            endPos.x = gameArea.getLeft();

            startPos.y = GetRanNumInRange(gameArea.getTop(), gameArea.getBottom());
            endPos.y = GetRanNumInRange(gameArea.getTop(), gameArea.getBottom());
        }
        else if (ranNum == 2) {
            // top
            startPos.y = gameArea.getTop();
            endPos.y = gameArea.getBottom();

            startPos.x = GetRanNumInRange(gameArea.getLeft(), gameArea.getRight());
            endPos.x = GetRanNumInRange(gameArea.getLeft(), gameArea.getRight());
        }
        else {
            // bottom
            startPos.y = gameArea.getBottom();
            endPos.y = gameArea.getTop();

            startPos.x = GetRanNumInRange(gameArea.getLeft(), gameArea.getRight());
            endPos.x = GetRanNumInRange(gameArea.getLeft(), gameArea.getRight());
        }
        sprite.setXY(startPos.x, startPos.y);

        const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
        velocity = {x: Math.cos(angle) * moveSpeed, y: Math.sin(angle) * moveSpeed};

    };
    CalculateVelocity();

    const MoveCollectible = function() {
        let { x, y } = sprite.getXY();

        x += velocity.x * deltaTime;
        y += velocity.y * deltaTime;
        
        gameArea.isPointInBox(x, y)? sprite.setXY(x, y) : DisposeThis();
    };

    const sequences = {
        idle: {x:0, y:0, width:128, height:128, count:1, timing:200, loop:true, isLeft: false, startingIndex: 0}
    }

    sprite.setSequence(sequences.idle).setScale(0.3).useSheet(referenceLists.CollectibleHealth);

    const HandlePlayerPickUp = function() {
        // check if player hits any enemy
        for (const playerName in players) {

            const curPlayer = players[playerName];
            if (!GetHitBox().intersect(curPlayer.GetHitBox())) continue;
            if (curPlayer.GetFSMState() == FSM_STATE.DEAD) continue;

            curPlayer.AddHealth(healthPoint);
            DisposeThis();
        }

    };

    const GetHitBox = function() {
        const size = sprite.getDisplaySize();

        const {x, y} = sprite.getXY();

        const top = y - size.height * 0.5;
        const left = x - size.width * 0.5;
        const bottom = y + size.height * 0.5;
        const right = x + size.width * 0.5;

        return BoundingBox(context, top, left, bottom, right);
    };

    const DisposeThis = function() {
        for (const collectibleName in collectibles) {
            if (collectibles[collectibleName].GetID() == GetID()) {
                delete collectibles[collectibleName];
                return;
            } 
        }
    };

    const GetID = () => {return ID;}


    const Update = function(now) {

        sprite.update(now);

        MoveCollectible();

        HandlePlayerPickUp();

    };


    return {
        Update: Update,
        GetID: GetID,
        draw: sprite.draw
    }


};