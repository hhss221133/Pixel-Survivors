import socket from './SocketHandler.js'; // Import the socket instance

document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    ping_server();
    retrieve_session();
    start_game_button();
});

function ping_server() {
    socket.emit('reconnected');
}

function retrieve_session() {
    socket.emit("retrieve lobby session");
}

function start_game_button() {
    const start_game = document.getElementById('start_game');
    if(start_game) {
        start_game.addEventListener('click', function(e) {
            e.preventDefault();
            start_Game();
        });
    }
}

function start_Game() {
    socket.emit("start game");
}

function create_lobby_json() {
    socket.emit("create lobby json");
}

function join_lobby_json() {
    socket.emit("join lobby json");
}

//Socket listeners
socket.on('lobby session retrieved', (sessionData) => {
    console.log(sessionData);
    if('roomID' in sessionData) {
        if(sessionData.username == sessionData.roomID) {
            // const host = document.getElementById('host');
            // host.textContent = sessionData.username;
            create_lobby_json();
        }
        else {
            // const client = document.getElementById('client');
            // client.textContent = sessionData.username;
            join_lobby_json();
        }
    }
    else {
        window.location.href = '/lobbies';
    }
});

//When a new player joins/leaves, the lobby JSON is updated
socket.on('lobby updated', (lobbyInfo) => { 
    if(lobbyInfo) {
        console.log(lobbyInfo);
        const host = document.getElementById('host');
        const client = document.getElementById('client');
        host.textContent = lobbyInfo.players[0].username;
        host.dataset.player = lobbyInfo.players[0].username;
    
        if(lobbyInfo.players.length > 1) {
            client.textContent = lobbyInfo.players[1].username;
            client.dataset.player = lobbyInfo.players[1].username;
        } 
        else {
            client.textContent = "Waiting for player...";
        }
    }
    else {
        window.location.href = '/lobbies';
    }
});

socket.on('lobby join json error', (err) => {
    alert(err);
    alert("There was an error joining the room, please try again.");
    window.location.href = '/lobbies';
});

socket.on("initialize and start game", (roomPlayers) => {
    console.log("Starting game communication!");
    console.log(roomPlayers);
  //  if (roomPlayers[document.getElementById('client')] == undefined) return;

});
