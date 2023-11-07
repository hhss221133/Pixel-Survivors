const LobbiesModel = require('../models/LobbiesModel');

function LobbyEvents(socket, io) {
    // Handle request for lobbies
    socket.on('request lobbies', () => {
        console.log(socket.request.session.username, "requested lobbies");
        LobbiesModel.getLobbies((err, lobbies) => {
            if (err) {
                // Handle error
                console.error('Error retrieving lobbies:', err);
                socket.emit('lobby error', 'Failed to retrieve lobbies');
            } else {
                // Emit the lobbies data back to the requesting client
                console.log("sent lobbies to", socket.request.session.username);
                socket.emit('lobbies', lobbies);
            }
        });
    });
    // You can add more lobby-related event handlers here
}

module.exports = LobbyEvents;