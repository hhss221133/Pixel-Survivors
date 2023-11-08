// Utility functions for session management
function socketrequireLogin(socket, next) {
    if (socket.request.session && socket.request.session.username) {
        // User is logged in, proceed to the next part of the code
        next();
    } else {
        // User is not logged in, emit an event to the client
        socket.emit('login required', 'You must be logged in.');
        socket.disconnect(true); // Forcefully close the connection
    }
}

// Function to set the roomID in the session
function setRoomID(socket, roomID, callback) {
    socket.request.session.roomID = roomID;
    socket.request.session.save(callback);
}

// Function to delete the roomID from the session
function deleteRoomID(socket, callback) {
    delete socket.request.session.roomID;
    socket.request.session.save(callback);
}

module.exports = {
    setRoomID,
    deleteRoomID,
    socketrequireLogin
};