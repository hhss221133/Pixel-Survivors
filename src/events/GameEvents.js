const LobbiesModel = require('../models/LobbiesModel');

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


module.exports = GameEvents;