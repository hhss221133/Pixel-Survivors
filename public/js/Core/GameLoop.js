const players = {};

const enemies = {};

const projectiles = {};

const totalGameTime = 240;   // Total game time in seconds

let actorIndex = 0;

let deltaTime = 0.0167; // frame time for 60fps

/* Get the canvas and 2D context */
const canvas = $("canvas").get(0);
const context = canvas.getContext("2d");
const gameArea = BoundingBox(context, 0, 0, 900, 1600);


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

const AddProjectile = function(owner, projectileType, startPos, endPos, launchSpeed) {
    let newProjectileID = owner.GetID() + "_" + projectileType + "_" + actorIndex;

    switch (projectileType) {
        case PROJECTILE_TYPE.FIREBALL:
            projectiles[newProjectileID] = Fireball(context, startPos.x, startPos.y, gameArea, owner, endPos, launchSpeed, newProjectileID);
            break;
        case PROJECTILE_TYPE.WATERBALL:
            projectiles[newProjectileID] = Waterball(context, startPos.x, startPos.y, gameArea, owner, endPos, launchSpeed, newProjectileID);
            break;
    }

    actorIndex++;
    
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

let RemoveActorQueue = {};

/************************************************************************************************************************************/

const GameLoop = function() {

    let start = Date.now();

    const InitializeGame = function() {
        // Initialze player, enemy and UI

       // AddKnight(500, 500);
        AddWizard(600, 500);

        AddMushroom(1000, 700);
      //  AddSkeleton(1000, 300);
     //   AddFlyingEye(1000, 500);
    };

    const doFrame = function(now) {

        context.clearRect(0, 0, canvas.width, canvas.height);

        CalculateDeltaTime();

        UpdateAndDraw(now);

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    };

    const CalculateDeltaTime = function() {
        let current = Date.now();
        deltaTime = current - start;
        deltaTime *= 0.001;
        start = current;
    };

    const UpdateAndDraw = function(now) {
        for(const playerName in players) {
            const updateTarget = players[playerName];
            updateTarget.Update(now);
            updateTarget.draw();
        }
        for(const enemyName in enemies) {
            const updateTarget = enemies[enemyName];
            updateTarget.Update(now);
            updateTarget.draw();
        }
        for(const projectileName in projectiles) {
            const updateTarget = projectiles[projectileName];
            updateTarget.Update(now);
            updateTarget.draw();
        }

    };

    const StartGame = function() {

        InitializeGame();

        requestAnimationFrame(doFrame);
    };

    return {
        StartGame: StartGame 
    };

};


