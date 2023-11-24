const LobbiesModel = require('../models/LobbiesModel');
const {deleteRoomID} = require('./MWSocketSessions');

function edit_lobby_status(sessID, socket, status) {
    console.log("");
    console.log(`Setting ${sessID} host lobbies to ${status}`);
    LobbiesModel.setLobbyStatus(sessID, socket.request.session.roomID, status, (err, updatedLobbies, lobbyInfo) => {
        if (err) {
            console.error('Error in lobby delete:', err);
            
            socket.emit('lobby delete error', "Lobby deletion failed");
        } else {
            console.log(`Status update for ${sessID} complete`);
        }
    });
}

function performCleanup(sessID, socket, io) {
    console.log("");
    console.log("cleaning up");
    socket.emit('disable create');
    LobbiesModel.leaveLobby(sessID, socket.request.session.roomID, (err, updatedLobbies, lobbyInfo) => {
        if (err) {
            console.error('Error in lobby delete:', err);
            socket.emit('lobby delete error', "Lobby deletion failed");
            socket.emit('allow create');
        } else {
            roomID = socket.request.session.roomID;
            socket.emit('allow create');
            io.to(roomID).emit('lobby updated', lobbyInfo);
            io.emit('io updated lobbies json', updatedLobbies);

            roomID = socket.request.session.roomID;
            
            //Delete roomID session variable
            deleteRoomID(socket, (err) => {
                if (err) {
                    console.error('Session save error:', err);
                }
            });
        }
    });
}

module.exports = {performCleanup, edit_lobby_status};