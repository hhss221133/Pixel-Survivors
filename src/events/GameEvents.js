const {InitGame, PlayerReady} = require('../game/objectModel');


function GameEvents(socket, io, userTimeouts) {

    socket.on('start game', () => {
        // CreateTest(socket.request.session.username);
        console.log(`${socket.request.session.roomID} lobby started the game`)
        console.log('Callback sent'); 
        
        //extra checkign for host starting game
        if(socket.request.session.username == socket.request.session.roomID) {
            const usernamesInRoom = getUsernamesInRoom(socket.request.session.roomID, io);
            console.log(`${usernamesInRoom} users in the io room.`);
            InitGame(socket.request.session.roomID, usernamesInRoom[0], usernamesInRoom[1]);
            io.to(socket.request.session.roomID).emit('game started');
        }
    });

    socket.on('rejoin room', () => {
        socket.join(socket.request.session.roomID);
    });

    socket.on('ready', () => {
        console.log(`${socket.request.session.username} ready in ${socket.request.session.roomID}`);
        var allReady = PlayerReady(socket.request.session.roomID, socket.request.session.username);
        if(allReady) {
            console.log(`all ready in ${socket.request.session.roomID}`);
            io.to(socket.request.session.roomID).emit('all ready');
            console.log('callback sent');
        }
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