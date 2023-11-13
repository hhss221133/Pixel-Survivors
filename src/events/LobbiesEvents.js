const LobbiesModel = require('../models/LobbiesModel');
const { setRoomID } = require('../middleware/MWSocketSessions');
const {performCleanup} = require('../middleware/MWLobbiesCleanup');


function LobbiesEvents(socket, io, userTimeouts) {
    
    // //Use for Lobbies profile section
    // socket.on('get username', () =>{
    //     console.log("");
    //     console.log(socket.request.session.username, "requested username");
    //     console.log("sent username to", socket.request.session.username);
    //     socket.emit('receive username', socket.request.session.username);
    // });

    // Handle request for lobbies list
    socket.on('request lobbies', () => {
        console.log("");
        console.log(socket.request.session.username, "requested lobbies");
        LobbiesModel.getLobbies((err, lobbies) => {
            if (err) {
                // Handle error
                console.error('Error retrieving lobbies:', err);
                socket.emit('lobby get error', 'Failed to retrieve lobbies');
            } else {
                // Emit the lobbies data back to the requesting client
                console.log("sent lobbies to", socket.request.session.username);
                socket.emit('all lobbies list', lobbies);
            }
        });
    });

    //Triggered on Create Lobby button, only persist the session (No DB or rooms created)
    socket.on('create lobby session', () => {
        console.log("");
        console.log(socket.request.session.username, "requested start lobby session");
        // Save the session
        setRoomID(socket, socket.request.session.username, (err) => {
            if (err) {
                console.error('Session save error:', err);
            }
        });

        console.log("Username:",socket.request.session.username, "RoomID:",socket.request.session.roomID);
        console.log("Lobby session started for", socket.request.session.username);
        socket.emit('lobby session started');
    });

    //Triggered on Join button, only persist the session (No DB or rooms created)
    socket.on('join lobby session', (roomID) => {
        console.log("");
        console.log(socket.request.session.username, "requested join lobby session of", roomID);
        // Save the session
        setRoomID(socket, roomID, (err) => {
            if (err) {
                console.error('Session save error:', err);
            }
        });

        console.log("Username:",socket.request.session.username, "RoomID:", roomID);
        console.log(socket.request.session.username, "joined lobby session of", roomID);
        socket.emit('lobby session started');
    });

    socket.on('lobbies json cleanup', () => {
        console.log("");
        console.log(socket.request.session.username, "performing one time Cleanup");
        performCleanup(socket.request.session.username, socket, io);
        userTimeouts.delete(socket.request.session.username);
    });
}

module.exports = LobbiesEvents;