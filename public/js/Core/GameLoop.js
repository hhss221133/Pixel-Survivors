const players = {};

const enemies = {};

const GameLoop = function() {

    /* Get the canvas and 2D context */
    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    const totalGameTime = 240;   // Total game time in seconds

    let enemyIndex = 0;



    const gameArea = BoundingBox(context, 0, 0, 900, 1600);



    const InitializeGame = function() {
        // Initialze player, enemy and UI

        players.player1 = PlayerKnight(context, 500, 500, gameArea);
     //   players.player2 = PlayerWizard(context, 1000, 500, gameArea);


        AddSkeleton(1000, 300);
        AddFlyingEye(1000, 500);
    };

    const doFrame = function(now) {
        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        UpdateAndDraw(now);

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    };

    const UpdateAndDraw = function(now) {
        for(const playerName in players) {
            players[playerName].Update(now);
            players[playerName].draw();
        };
        for(const enemyName in enemies) {
            enemies[enemyName].Update(now);
            enemies[enemyName].draw();
        }
    };

    const AddEnemy = function(enemyType, enemyX, enemyY) {
        let newEnemyID = enemyType + "_" + enemyIndex;
        switch (enemyType) {
            case ENEMY_TYPE.SKELETON:
                enemies[newEnemyID] = EnemySkeleton(context, enemyX, enemyY, gameArea, newEnemyID);
                break;
            case ENEMY_TYPE.FLYINGEYE:
                enemies[newEnemyID] = EnemyFlyingEye(context, enemyX, enemyY, gameArea, newEnemyID);
                break;
        }

        enemyIndex++;
    };

    const AddSkeleton = (x, y) => AddEnemy(ENEMY_TYPE.SKELETON, x, y);

    const AddFlyingEye = (x, y) => AddEnemy(ENEMY_TYPE.FLYINGEYE, x, y);
        
    

    const StartGame = function() {

        InitializeGame();

        requestAnimationFrame(doFrame);
    };

    return {
        StartGame: StartGame 
    };

};


