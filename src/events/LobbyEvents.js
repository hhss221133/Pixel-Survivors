const LobbiesModel = require('../models/LobbiesModel');
const GameEvents = require('../events/GameEvents');
const {performCleanup} = require('../middleware/MWLobbiesCleanup');


function LobbyEvents(socket, io, userTimeouts) {

    socket.on('retrieve lobby session', () => {
        console.log("");
        console.log(socket.request.session.username, "retrieve lobby session");
        
        sessionData = {
            "username": socket.request.session.username,
            "roomID": socket.request.session.roomID
        }

        socket.emit('lobby session retrieved', sessionData); 
        console.log("retrieved lobby session of", socket.request.session.username);
    });

    socket.on('create lobby json', () => {
        console.log("");
        console.log(socket.request.session.username, "requested create lobby json");
        LobbiesModel.newLobby(socket.request.session.username, (err, newLobby) => {
            if (err) {
                // console.error('Error in lobby creation:', err);

                // Check the type of error and emit specific messages for different errors
                if (err.message === 'User already has a lobby') {
                    socket.emit('lobby create error', { code: 'ALREADY_EXISTS', message: 'You have already created a lobby.' });
                } else {
                    socket.emit('lobby create error', { code: 'INTERNAL_ERROR', message: 'Failed to create lobby due to server error.' });
                }
            } else {
                // Emit the new lobby data back to the requesting client
                console.log("");
                console.log("Lobby created for", socket.request.session.username);

                socket.join(newLobby.createdBy);

                console.log(`Socket ${socket.request.session.username} joined lobby room ${newLobby.createdBy}`);
                
                io.to(newLobby.createdBy).emit('lobby updated', newLobby);
                io.emit('io updated lobbies json'); //multicast
            }
        });

    });

    socket.on('join lobby json', () => {
        console.log("");
        console.log(socket.request.session.username, "requested join lobby json")
        const username = socket.request.session.username; // Assuming the username is stored in the session
        const roomID = socket.request.session.roomID;

        LobbiesModel.joinLobby(username, roomID, (err, updatedLobby) => {
            if (err) {
                // console.error('Error joining lobby:', err);
                socket.emit('lobby join json error', err.message);
            } else {
                // The user successfully joined the lobby
                socket.join(roomID);

                console.log(`${username} joined lobby ${roomID}`);
                // Emit to all sockets in the room that a new user has joined
                io.to(roomID).emit('lobby updated', updatedLobby);
                io.emit('io updated lobbies json'); //multicast
            }
        });
    });

    socket.on('leave lobby json', () => {
        console.log(socket.request.session.username, "requested delete lobby");
        performCleanup(socket.request.session.username, socket, io);
        userTimeouts.delete(socket.request.session.username);
    });

    socket.on('start game', () => {
        GameEvents(socket, io, userTimeouts);
    });
}

module.exports = LobbyEvents;