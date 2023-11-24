const ObjectModel = require('../game/objectModel');
const LobbiesModel = require('../models/LobbiesModel');

let bBackendLoopRunning = false;

function GameEvents(socket, io, userTimeouts) {

    socket.on('start game', () => {
        // CreateTest(socket.request.session.username);
        console.log(`${socket.request.session.roomID} lobby started the game`)
        console.log('Callback sent'); 
        
        //extra checkign for host starting game
        if(socket.request.session.username != socket.request.session.roomID) return;

        LobbiesModel.getLobbies( (err, lobbyList) => {
            if (!lobbyList) return; 

            let hostChar = "Knight";
            let clientChar = "Knight";
    
            const curLobby = lobbyList.find(lobby => lobby.createdBy === socket.request.session.roomID);
            for (playerObject of curLobby.players) {
                (playerObject.username == socket.request.session.roomID)? hostChar = playerObject.character :
                    clientChar = playerObject.character;
            }

            const usernamesInRoom = getUsernamesInRoom(socket.request.session.roomID, io);
            console.log(`${usernamesInRoom} users in the io room.`);
            ObjectModel.InitGame(socket.request.session.roomID, usernamesInRoom[0], usernamesInRoom[1], hostChar, clientChar);
            io.to(socket.request.session.roomID).emit('game started');
        }); 
        
    });

    socket.on('is playing?', () => {
        console.log('Checking...')
        const isPlaying = ObjectModel.isAllReady(socket.request.session.roomID, socket.request.session.username);

        if (!isPlaying) {
            io.to(socket.request.session.roomID).emit('player playing', {isPlaying: isPlaying});
            return;
        }

        const gameData = {... ObjectModel.GetGameData(socket.request.session.roomID)};
        gameData["isPlaying"] = true;

        io.to(socket.request.session.roomID).emit('player playing', gameData);
    });

    socket.on('rejoin room', () => {
        console.log("Refreshed")
        socket.join(socket.request.session.roomID);

        // here?

    });

    socket.on('ready', () => {
        console.log(`${socket.request.session.username} ready in ${socket.request.session.roomID}`);
        var allReady = ObjectModel.PlayerReady(socket.request.session.roomID, socket.request.session.username);
        if(allReady) {
            console.log(`all ready in ${socket.request.session.roomID}`);
            io.to(socket.request.session.roomID).emit('all ready', ObjectModel.GetGameData(socket.request.session.roomID)); // start the game
            ObjectModel.SetGameState(socket.request.session.roomID, "active");
            console.log('callback sent');
        }
    });

    socket.on("add score", (dataObj) => {
        ObjectModel.AddScore(socket.request.session.roomID, socket.request.session.username, dataObj.score);
        if (!dataObj.isBoss) return;

        const gameList = ObjectModel.GetGameInMemory();
        const game = gameList.find(g => g.getGameID() === socket.request.session.roomID);

        io.to(socket.request.session.roomID).emit("damage boss", dataObj.damage);

        const bIsBossAlive = ObjectModel.DealDamageToBoss(socket.request.session.roomID, dataObj.damage);

        if (bIsBossAlive) return;
        // the boss is dead, end the game
        let curGame = ObjectModel.GetGameInMemory().find(g => g.getGameID() === socket.request.session.roomID);
        HandleGameEnd(io, curGame);
        
    });

    socket.on("update player pos", (playerPos) => {
        const gameList = ObjectModel.GetGameInMemory();
        const game = gameList.find(g => g.getGameID() === socket.request.session.roomID);
        game.setPlayerPos((socket.request.session.roomID == socket.request.session.username), playerPos);
    });

    socket.on("update boss pos", (bossPos) => {
        const gameList = ObjectModel.GetGameInMemory();
        const game = gameList.find(g => g.getGameID() === socket.request.session.roomID);
        game.setBossPos((socket.request.session.roomID == socket.request.session.username), bossPos);
    });

    socket.on("end the game", () => {
        const gameList = ObjectModel.GetGameInMemory();

        // you may redirect both the players here, this event will be sent twice (from both two players), 
        // so you should ensure that your codes are runned only once
        //
        // clear time of the game can be accessed by game.getClearTime() (in seconds)
        // scores of the player can be accessed by game.getPlayerData()
        // you need to get the target game object from ObjectModel

        /* Your code here */
        
    });

    if (!bBackendLoopRunning) {
        bBackendLoopRunning = true;
        StartBackendLoop(io);
    }

}

function getAllSocketIdsInRoom(roomID, io) {
    const clients = io.sockets.adapter.rooms.get(roomID);
    return clients ? Array.from(clients) : [];
}

function getUsernamesInRoom(roomID, io) {
    const socketIds = getAllSocketIdsInRoom(roomID, io);
    const usernames = [];

    socketIds.forEach(socketId => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && socket.request.session.username) {
            usernames.push(socket.request.session.username);
        }
    });

    return usernames;
}

function StartBackendLoop(io) {
    setInterval(BackendLoop, 15, io); // 15ms = 66.67fps, which is recommended by Valve
};

function BackendLoop(io) {
    const gameList = ObjectModel.GetGameInMemory();
    for (const game in gameList) {
        if (!gameList[game].isGameActive()) continue;
        // this game is active, update the stats for all players in this game

        UpdatePlayerState(io, gameList[game])

        UpdateGameTime(io, gameList[game]);
        
    }
};

function UpdatePlayerState(io, game) {
    io.to(game.getGameID()).emit("update player states", game.getPlayerData());
}

function UpdateGameTime(io, game) {
    const timeLeft = game.updateRemainingTime();
    io.to(game.getGameID()).emit("update time left", game.getRemainingTime());
    if (timeLeft <= 0) {
        HandleGameEnd(io, game);
    }

}


function HandleGameEnd(io, game) {
    if (game.getGameState() == "finished") return; // avoid double calling
    game.setGameState("finished");
    game.setClearTime();
    console.log("Time used: " + game.getClearTime());
    io.to(game.getGameID()).emit("game ends");
};


module.exports = GameEvents;
