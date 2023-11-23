/************************************************************************************************************************************/

// Global variables and functions shared by all modules

const players = {};

const enemies = {};

const projectiles = {};

const explosions = {};

const collectibles = {};

let curSocket = null;

const healthAppearIntervalMin = 5000; // in miliseconds

const healthAppearIntervalMax = 9000; // in miliseconds

const SFXMasterVolume = 0.8;

const BGMMasterVolume = 0.3;

let GameRunning = true;

let actorIndex = 0; // for generating GUID

let deltaTime = 0.0167; // default frame time for 60fps, this will be calculated each frame by simply frame[i] - frame[i-1]

let collectibleTimer = null;

let bossRef = null;

let BGM_stage1 = new Audio(referenceLists.Boss_Stage1);
BGM_stage1.loop = true;
BGM_stage1.volume = BGMMasterVolume;
let BGM_stage2 = new Audio(referenceLists.Boss_Stage2);
BGM_stage2.loop = true;
BGM_stage2.volume = BGMMasterVolume;
let BGM_stage3 = new Audio(referenceLists.Boss_Stage3);
BGM_stage3.loop = true;
BGM_stage3.volume = BGMMasterVolume;
let BGM_stage4 = new Audio(referenceLists.Boss_Stage4);
BGM_stage4.loop = true;
BGM_stage4.volume = BGMMasterVolume;
let BGM_stage5 = new Audio(referenceLists.Boss_Stage5);
BGM_stage5.loop = true;
BGM_stage5.volume = BGMMasterVolume;

let PlayerStateData = null;

let TimeLeft = null;


/* Get the canvas and 2D context */
const canvas = $("canvas").get(0);
const context = canvas.getContext("2d");
const gameArea = BoundingBox(context, 30, 30, 660, 1240);


const AddSkeleton = (x, y) => AddEnemy(ENEMY_TYPE.SKELETON, x, y);

const AddFlyingEye = (x, y) => AddEnemy(ENEMY_TYPE.FLYINGEYE, x, y);

const AddMushroom = (x, y) => AddEnemy(ENEMY_TYPE.MUSHROOM, x, y);

const AddEnemy = function(enemyType, enemyX, enemyY) {
    let newEnemyID = enemyType + "_" + actorIndex;
    switch (enemyType) {
        case ENEMY_TYPE.SKELETON:
            enemies[newEnemyID] = EnemySkeleton(context, enemyX, enemyY, gameArea, newEnemyID);
            break;
        case ENEMY_TYPE.FLYINGEYE:
            enemies[newEnemyID] = EnemyFlyingEye(context, enemyX, enemyY, gameArea, newEnemyID);
            break;
        case ENEMY_TYPE.MUSHROOM:
            enemies[newEnemyID] = EnemyMushroom(context, enemyX, enemyY, gameArea, newEnemyID);
            break;
    }

    actorIndex++;
};

const HandleEndGame = function() {
    if (!bossRef) return;
    bossRef.HandleEnemyDead();

    requestAnimationFrame(GameEndDoFrame);
};

const GameEndDoFrame = function(now) {
    if (!bossRef) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    bossRef.Update(now);
    bossRef.draw();
    requestAnimationFrame(GameEndDoFrame);
}

const AddCollectibleHealth = function() {
    let newCollectibleID = "CollectibleHealth_" + actorIndex;
    collectibles[newCollectibleID] = CollectibleHealth(newCollectibleID);
    actorIndex++;

    collectibleTimer = setTimeout(AddCollectibleHealth, GetRanNumInRange(healthAppearIntervalMin, healthAppearIntervalMax));
}

const AddProjectile = function(owner, projectileType, startPos, endPos, launchSpeed) {
    let newProjectileID = owner.GetID() + "_" + projectileType + "_" + actorIndex;

    switch (projectileType) {
        case PROJECTILE_TYPE.FIREBALL:
            projectiles[newProjectileID] = Fireball(context, startPos.x, startPos.y, gameArea, owner, endPos, launchSpeed, newProjectileID);
            break;
        case PROJECTILE_TYPE.WATERBALL:
            projectiles[newProjectileID] = Waterball(context, startPos.x, startPos.y, gameArea, owner, endPos, launchSpeed, newProjectileID);
            break;
        case PROJECTILE_TYPE.PLASMABALL:
            projectiles[newProjectileID] = Plasmaball(context, startPos.x, startPos.y, gameArea, owner, endPos, launchSpeed, newProjectileID);
            break;
    }

    actorIndex++;
    
};

const AddExplosion = function(owner) {
    let newExplosionID = owner.GetID() + "_Explosion_" + actorIndex;
    explosions[newExplosionID] = Explosion(context, 0, 0, gameArea, owner, newExplosionID);

    actorIndex++;
};

const AddBoss = function(x, y) {
    let newBossID = "Boss" + "_" + actorIndex; 
    enemies[newBossID] = Boss(context, x, y, gameArea, newBossID);
    actorIndex++;

    bossRef = enemies[newBossID];
};

const AddKnight = (x, y) => AddPlayer(PLAYER_TYPE.KNIGHT, x, y);

const AddWizard = (x, y) => AddPlayer(PLAYER_TYPE.WIZARD, x, y);

const AddPlayer = function(playerType, playerX, playerY) {
    let newPlayerID = playerType + "_" + actorIndex;
    switch (playerType) {
        case PLAYER_TYPE.KNIGHT:
            players[newPlayerID] = PlayerKnight(context, playerX, playerY, gameArea, newPlayerID);
            break;
        case PLAYER_TYPE.WIZARD:
            players[newPlayerID] = PlayerWizard(context, playerX, playerY, gameArea, newPlayerID);
            break;
    }

    actorIndex++;
};

const FindRandomSpawnPosition = function() {
    // Find a random position to spawn enemy or collectable health.
    // This position should not be near to the player
 
    const IsEmptyPosition = function(x, y) {
        // check if there are any players near the target position
        for(const playerName in players) {
            const curPlayerPos = players[playerName].getXY();
            const disToPlayer = Math.sqrt(Math.pow((curPlayerPos.x - x), 2) + Math.pow((curPlayerPos.y - y), 2) );
            if (disToPlayer < 100) return false;
        }
        return true;
    };

    let randomX, randomY;
    do {
        randomX = Math.random() * (gameArea.getRight() - gameArea.getLeft()) + gameArea.getLeft();
        randomY = Math.random() * (gameArea.getBottom() - gameArea.getTop()) + gameArea.getTop();
    } while (!IsEmptyPosition(randomX, randomY));
    return {x: randomX, y: randomY};
};

const GetRanNumInRange = function(min, max) {
    return Math.random() * (max - min) + min;
};

const PlaySFX = function(targetSFX, volume = 1) {
    if (!targetSFX.src) return;
    targetSFX.volume = SFXMasterVolume * volume;
    targetSFX.currentTime = 0;
    targetSFX.play();
}

const ChangeBossBGM = function(bossStage) {
    if (bossStage == 1) {
        BGM_stage1.play();
    }
    else if (bossStage == 2) {
        BGM_stage1.pause();
        BGM_stage2.play();
    }
    else if (bossStage == 3) {
        BGM_stage2.pause();
        BGM_stage3.play();
    }
    else if (bossStage == 4) {
        BGM_stage3.pause();
        BGM_stage4.play();
    }
    else if (bossStage == 5) {
        BGM_stage4.pause();
        BGM_stage5.play();
    }
}

const StopAllBGM = function() {
    BGM_stage1.pause();
    BGM_stage2.pause();
    BGM_stage3.pause();
    BGM_stage4.pause();
    BGM_stage5.pause();

}

/************************************************************************************************************************************/

const GameLoop = function() {

    let start = Date.now();

    const InitializeGame = function() {
        // Initialze player, enemy and UI

        collectibleTimer = setTimeout(AddCollectibleHealth, GetRanNumInRange(healthAppearIntervalMin, healthAppearIntervalMax));

        AddBoss(1000, 400);
        ChangeBossBGM(1);
    };

    const doFrame = function(now) {

        context.clearRect(0, 0, canvas.width, canvas.height);

        CalculateDeltaTime();

        UpdateAndDraw(now);

        /* Process the next frame */
        if (GameRunning) {
            requestAnimationFrame(doFrame);
        }
        else {
            // show boss die animation and end the game
            HandleEndGame();
        }
    };

    const CalculateDeltaTime = function() {

        // simple delta time by taking frame[n] - frame[n-1]
        let current = Date.now();
        deltaTime = current - start;
        deltaTime *= 0.001;
        start = current;
    };

    const UpdateAndDraw = function(now) {

        for(const explosionName in explosions) {
            const updateTarget = explosions[explosionName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

        for(const collectibleName in collectibles) {
            const updateTarget = collectibles[collectibleName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

        for(const projectileName in projectiles) {
            const updateTarget = projectiles[projectileName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

        for(const enemyName in enemies) {
            const updateTarget = enemies[enemyName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

        for(const playerName in players) {
            const updateTarget = players[playerName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

    };

    const StartGame = function(socket) {
        curSocket = socket;

        InitializeGame();

        requestAnimationFrame(doFrame);

    };

    return {
        StartGame: StartGame 
    };

};


