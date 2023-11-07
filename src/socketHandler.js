
const LobbyEvents = require('./events/LobbyEvents');


module.exports = function (io, Session) {
    io.use((socket, next) => {
        // Wrap the session middleware into Socket.IO
        Session(socket.request, {}, next);
    });

    io.on('connection', (socket) => {
        console.log('User connected');

        if (socket.request.session && socket.request.session.username) {
            console.log(socket.request.session.username, "logged in and connected");
            // User has a valid session

            LobbyEvents(socket, io);
        } else {
            // User does not have a valid session, handle accordingly
            socket.emit('auth_error', 'User is not authenticated');
        }

        socket.on('disconnect', () => {
            console.log("User disconnected");
        });
    });
}