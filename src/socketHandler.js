
const LobbiesEvents = require('./events/LobbiesEvents');
const LobbyEvents = require('./events/LobbyEvents');
const {performCleanup, edit_lobby_status} = require('./middleware/MWLobbiesCleanup');
const {socketrequireLogin} = require('./middleware/MWSocketSessions');


module.exports = function (io, Session) {
    io.use((socket, next) => {
        // Wrap the session middleware into Socket.IO
        Session(socket.request, {}, next);
    });

    io.use(socketrequireLogin);

    const userTimeouts = new Map();

    io.on('connection', (socket) => {
        const sessID = socket.request.session.username;

        console.log("");
        console.log(socket.request.session.username, 'connected');
        
        clearTimeout(socket.disconnectionTimeout);

        LobbiesEvents(socket, io, userTimeouts);
        LobbyEvents(socket, io), userTimeouts;

        socket.on('reconnected', () => {
            clearTimeout(userTimeouts.get(sessID));
            userTimeouts.delete(sessID);
            edit_lobby_status(sessID, socket, 'waiting');
        });

        socket.on('disconnect', (reason) => {
            console.log("");
            console.log(socket.request.session.username, "disconnected with reason", reason);
            
            edit_lobby_status(sessID, socket, 'disable');

            userTimeouts.set(sessID, setTimeout(() => {
                performCleanup(sessID, socket, io);
            }, 3000));

        });
    });
}