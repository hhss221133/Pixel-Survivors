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

function RemoveGameData(roomID) {
    // Find the index of the game with the given roomID
    const gameIndex = game_in_memory.findIndex(game => game.getGameID() === roomID);

    // If the game is found, remove it and return the removed game
    if (gameIndex !== -1) {
        const removedGames = game_in_memory.splice(gameIndex, 1);
        return removedGames[0]; // Since splice returns an array, return the first element
    } else {
        console.log('Game not found with roomID:', roomID);
        return null; // Return null to indicate no game was found/removed
    }
}



module.exports = {
    InitGame, 
    PlayerReady,
    GetGameInMemory,
    AddScore,
    isAllReady,
    SetGameState,
    DealDamageToBoss,
    GetGameData,
    RemoveGameData
};

