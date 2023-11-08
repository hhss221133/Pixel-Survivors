const GameLoop = function() {

    /* Get the canvas and 2D context */
    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    const totalGameTime = 240;   // Total game time in seconds

    const players = {};

    const gameArea = BoundingBox(context, 0, 0, 900, 1600);



    const InitializeGame = function() {
        // Initialze player, enemy and UI

        players.player1 = PlayerKnight(context, 500, 500, gameArea);
    };

    const doFrame = function(now) {
        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        players.player1.Update(now);

        players.player1.draw();
        /* Process the next frame */
        requestAnimationFrame(doFrame);
    };

    const StartGame = function() {

        InitializeGame();

        requestAnimationFrame(doFrame);
    };


    return {
        StartGame: StartGame 
    };

};

