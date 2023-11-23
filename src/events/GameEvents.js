const ObjectModel = require('../game/objectModel');
const LobbiesModel = require('../models/LobbiesModel');
const Player = require('../game/classes/Player');

const players = [];

let bBackendLoopRunning = false;

function GameEvents(socket, io, userTimeouts) {

    socket.on('start game', () => {
        // CreateTest(socket.request.session.username);
        console.log(`${socket.request.session.roomID} lobby started the game`)
        console.log('Callback sent'); 
        
        //extra checkign for host starting game
        if(socket.request.session.username == socket.request.session.roomID) {
            const usernamesInRoom = getUsernamesInRoom(socket.request.session.roomID, io);
            console.log(`${usernamesInRoom} users in the io room.`);
            ObjectModel.InitGame(socket.request.session.roomID, usernamesInRoom[0], usernamesInRoom[1]);
            io.to(socket.request.session.roomID).emit('game started');
        }
    });

    socket.on('is playing?', () => {
        console.log('Checking...')
        var isPlaying = ObjectModel.isAllReady(socket.request.session.roomID, socket.request.session.username);
        io.to(socket.request.session.roomID).emit('player playing', isPlaying);
    });

    socket.on('rejoin room', () => {
        console.log("Refreshed")
        socket.join(socket.request.session.roomID);
    });

    socket.on('ready', () => {
        console.log(`${socket.request.session.username} ready in ${socket.request.session.roomID}`);
        var allReady = ObjectModel.PlayerReady(socket.request.session.roomID, socket.request.session.username);
        if(allReady) {
            console.log(`all ready in ${socket.request.session.roomID}`);
            io.to(socket.request.session.roomID).emit('all ready', socket.request.session.username); // start the game
            ObjectModel.SetGameState(socket.request.session.roomID, "active");
            console.log('callback sent');
        }
    });

    socket.on("add score", (score) => {
        console.log("User: " + socket.request.session.username);
        ObjectModel.AddScore(socket.request.session.roomID, socket.request.session.username, score);
        if (score != 3) return;

        const bIsBossAlive = ObjectModel.DealDamageToBoss(socket.request.session.roomID, 1);

        if (bIsBossAlive) return;
        // the boss is dead, end the game
        let curGame = ObjectModel.GetGameInMemory().find(g => g.getGameID() === socket.request.session.roomID);
        HandleGameEnd(io, curGame);
        
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
    setInterval(BackendLoop, 15, io);
};

function BackendLoop(io) {
    const gameList = ObjectModel.GetGameInMemory();
    for (const game in gameList) {
        const curgame = gameList[game];
        if (!curgame.isGameActive()) continue;
        // this game is active, update the stats for all players in this game

        UpdatePlayerState(io, curgame)

        UpdateGameTime(io, curgame);
        
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
