const CreateTest = require('../game/CreateTest');


function GameEvents(socket, io, userTimeouts) {

    socket.on('start game', () => {
        CreateTest(socket.request.session.username);
        io.to(socket.request.roomID).emit('game started');
    });
}

module.exports = GameEvents;