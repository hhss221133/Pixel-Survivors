const Game = require('./classes/Game'); 

game_in_memory = [];

function InitGame(roomID, host, client) {
    var new_game = new Game(roomID, host, client);
    game_in_memory.push(new_game);
    console.log(game_in_memory);
    for(i = 0; i < game_in_memory.length; i++) {
        console.log(game_in_memory[i].getGameID());
    }
}

function PlayerReady(roomID, player) {
    // Find the Game object with the specified roomID
    let game = game_in_memory.find(g => g.getGameID() === roomID);

    if (game) {
        game.setPlayerReady(player);
        return game.isAllReady();
        
    } else {
        // No Game with the specified roomID found
        console.log(`No game found for room ID ${roomID}`);
    }
}

function AddScore(roomID, username, score) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    if (!game) return;
    game.addScoreToplayer(username, score);

};

function GetGameInMemory() {return game_in_memory;}

module.exports = {
    InitGame, 
    PlayerReady,
    GetGameInMemory,
    AddScore
};