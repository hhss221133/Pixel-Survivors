const CreateTest = require('../game/main');


function GameEvents(socket, io, userTimeouts) {

    socket.on('start game', () => {
        CreateTest(socket.request.username);
        io.to(socket.request.roomID).emit('game started');
    });
}

module.exports = GameEvents;