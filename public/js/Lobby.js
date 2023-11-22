import socket from './SocketHandler.js'; // Import the socket instance

document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    one_time_disable();
    ping_server();
    retrieve_session();
    char_change_handler();
    start_game_button();
});

function ping_server() {
    socket.emit('reconnected');
}

function retrieve_session() {
    socket.emit("retrieve lobby session");
}

function one_time_disable() {
    const start_game = document.getElementById('start_game');
    if(start_game) {
        start_game.setAttribute('disabled', true);
    }
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

    const host_char = document.getElementById('host_char');
    const client_char = document.getElementById('client_char');

    if('roomID' in sessionData) {
        if(sessionData.username == sessionData.roomID) {
            // const host = document.getElementById('host');
            // host.textContent = sessionData.username;
            client_char.setAttribute('disabled', true);
            create_lobby_json();
        }
        else {
            // const client = document.getElementById('client');
            // client.textContent = sessionData.username;
            host_char.setAttribute('disabled', true);
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
        
        const host_char = document.getElementById('host_char');
        const client_char = document.getElementById('client_char');
        
        host.textContent = lobbyInfo.players[0].username;
        host.dataset.player = lobbyInfo.players[0].username;
        host_char.value = lobbyInfo.players[0].character;

        if(lobbyInfo.players.length > 1) {
            const start_game = document.getElementById('start_game');
            if(start_game) {
                start_game.removeAttribute('disabled');
            }

            client.textContent = lobbyInfo.players[1].username;
            client.dataset.player = lobbyInfo.players[1].username;
            client_char.value = lobbyInfo.players[1].character;
        } 
        else {
            const start_game = document.getElementById('start_game');
            if(start_game) {
                start_game.setAttribute('disabled', true);
            }
            client_char.value = 'Knight';
            client.textContent = "Waiting for player...";
        }
    }
    else {
        window.location.href = '/lobbies';
    }
});

socket.on('lobby join json error', (err) => {
    alert(err);
    // alert("There was an error joining the room, please try again.");
    window.location.href = '/lobbies';
});

socket.on('game started', () => {
    // alert("There was an error joining the room, please try again.");
    window.location.href = '/game';
});





//On change handlers
function char_change_handler() {
    document.getElementById('host_char').addEventListener('change', function() {
        socket.emit('lobby char change', this.value);
    });

    document.getElementById('client_char').addEventListener('change', function() {
        socket.emit('lobby char change', this.value);
    });
}