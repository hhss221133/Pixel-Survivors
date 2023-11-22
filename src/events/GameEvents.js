const ObjectModel = require('../game/objectModel');
const LobbiesModel = require('../models/LobbiesModel');
const Player = require('../game/classes/Player');

const players = [];

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

    socket.on('rejoin room', () => {
        socket.join(socket.request.session.roomID);
    });

    socket.on('ready', () => {
        console.log(`${socket.request.session.username} ready in ${socket.request.session.roomID}`);
        var allReady = ObjectModel.PlayerReady(socket.request.session.roomID, socket.request.session.username);
        if(allReady) {
            console.log(`all ready in ${socket.request.session.roomID}`);
            io.to(socket.request.session.roomID).emit('all ready');
            console.log('callback sent');
        }
    });

    socket.on("add score", (score) => {
        console.log("User: " + socket.request.session.username);
        ObjectModel.AddScore(socket.request.session.roomID, socket.request.session.username, score);
    });
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


module.exports = GameEvents;




/*const LobbiesModel = require('../models/LobbiesModel');
const roomPlayers = {};
const playerSpawnPositionOccupied = {
    bottomLeft: false,
    topRight: false
}
function GameEvents(socket, io, userTimeouts) {
    const username = socket.request.session.username;
    const roomID = socket.request.session.roomID;
    LobbiesModel.getLobbies( (err, lobbyList) => {
        const curLobby = lobbyList.find(lobby => lobby.createdBy === username);
        InitializePlayers(curLobby);
        io.to(roomID).emit("initialize and start game", roomPlayers);
    }); 
};
function InitializePlayers(lobby) {
    if (!lobby) return;
    for (playerObject of lobby.players) {
        roomPlayers[playerObject.username] = {
            maxHP: 5,
            playerType: "Knight",
            walkSpeed: 300,
            isDead: false
        };
        if (!playerSpawnPositionOccupied.bottomLeft) {
            roomPlayers[playerObject.username].pos = {x: 50, y: 630};
            playerSpawnPositionOccupied.bottomLeft = true;
        }
        else {
            roomPlayers[playerObject.username].pos = {x: 1200, y: 50};
            playerSpawnPositionOccupied.topRight = true;
        }
    }
    console.log("Initializing players: " + JSON.stringify(roomPlayers));
};
module.exports = GameEvents; */