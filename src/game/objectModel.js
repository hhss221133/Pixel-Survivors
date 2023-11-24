const Game = require('./classes/Game'); 

game_in_memory = [];

function InitGame(roomID, host, client, hostChar, clientChar) {
    var new_game = new Game(roomID, host, client, hostChar, clientChar);
    game_in_memory.push(new_game);
    console.log(game_in_memory);
}

function PlayerReady(roomID, player) {
    
    // Find the Game object with the specified roomID
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    console.log(game_in_memory);

    if (game) {
        game.setPlayerReady(player);
        return game.isAllReady();
        
    } else {
        // No Game with the specified roomID found
        console.log(`No game found for room ID ${roomID}`);
    }
}

function SetGameState(roomID, newState) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    if (!game) return;
    game.setGameState(newState);
}

function AddScore(roomID, username, score) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    if (!game || !game.isGameActive()) return; 
    // only add score if the game is active
    game.addScoreToplayer(username, score);

};

function GetGameInMemory() {return game_in_memory;}

function isAllReady(roomID, player) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    console.log(game_in_memory);

    if (game) {
        return game.isAllReady();
        
    } else {
        console.log(`No game found for room ID ${roomID}`);
    }
}

function DealDamageToBoss(roomID, damage) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    if (!game || !game.isGameActive()) return;

    return (game.dealDamageToBoss(damage));
}

function GetGameData(roomID) {
    let game = game_in_memory.find(g => g.getGameID() === roomID);
    if (!game) return;

    return game.getGameData();
};

module.exports = {
    InitGame, 
    PlayerReady,
    GetGameInMemory,
    AddScore,
    isAllReady,
    SetGameState,
    DealDamageToBoss,
    GetGameData
};

