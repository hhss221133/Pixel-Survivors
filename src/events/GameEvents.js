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
            ObjectModel.SetGameState(socket.request.session.roomID, "active");
            io.to(socket.request.session.roomID).emit('all ready'); // start the game
            console.log('callback sent');
        }
    });

    socket.on("add score", (score) => {
        console.log("User: " + socket.request.session.username);
        ObjectModel.AddScore(socket.request.session.roomID, socket.request.session.username, score);
        if (score != 3) return;

        // a player hits the boss, reduce its HP
        const BossAlive = ObjectModel.DealDamageToBoss(socket.request.session.roomID, 1);

        if (BossAlive) return;

        ObjectModel.SetGameState(socket.request.session.roomID, "finished");
        // end the game
        console.log("the boss is dead");
        
    });

    if (!bBackendLoopRunning) {
        bBackendLoopRunning = true;
        StartBackendLoop(socket, io);
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

function StartBackendLoop(socket, io) {
    setInterval(BackendLoop, 15, socket, io);
};

function BackendLoop(socket, io) {
    const gameList = ObjectModel.GetGameInMemory();
    for (const game in gameList) {
        if (!gameList[game].isGameActive()) continue;
        // this game is active, update the stats for all players in this game
        const playerData = {... gameList[game].getPlayerData()};
        const usersInRoom = getUsernamesInRoom(socket.request.session.roomID, io);
        
        playerData["username"] = socket.request.session.username;
        io.to(gameList[game].getGameID()).emit("update player scores", playerData);

     //   gameData["timeLeft"] = gameList[game].getRemainingTime(); 
    }

};


module.exports = GameEvents;
