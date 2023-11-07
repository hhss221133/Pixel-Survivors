const GameLoop = function() {

    /* Get the canvas and 2D context */
    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    const totalGameTime = 240;   // Total game time in seconds

    const players = {};

    const gameArea = BoundingBox(context, 0, 0, 1600, 900);

    const CreatePlayerKnight = function() {
        const sequences = {
            /* sprite sequences for knight*/
            idleRight: {x:0, y:0, width:100, height:55, count:8, timing:200, loop:true}
        };

        const NewPlayer = Player(context, 500, 500, gameArea);
        NewPlayer.CreateSpriteSequences(sequences, sequences.idleRight, scale = 2, shadowScale = {x:0, y:0}, "../../assets/player_knight.png");
        return NewPlayer;
    };

    const InitializeGame = function() {
        // Initialze player, enemy and UI
        players.player1 = CreatePlayerKnight();
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

