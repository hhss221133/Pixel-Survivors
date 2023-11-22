import socket from './SocketHandler.js'; // Import the socket instance

const Game = GameLoop();

document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    ping_server();
    rejoin_room();
    ready_button();
});

function ping_server() {
    socket.emit('reconnected');
}

function rejoin_room() {
    socket.emit('rejoin room');
}

function ready_button() {
    const ready_button_ = document.getElementById('ready_button');
    if(ready_button_) {
        ready_button_.addEventListener('click', function(e) {
            e.preventDefault();
            const message = document.getElementById('waiting_ready');
            message.removeAttribute('hidden');
            send_ready();
        });
    }
}
function send_ready() {
    socket.emit('ready');
}

export function send_addScore(score) {
    socket.emit("add score", score);
}


//Listeners;
socket.on('all ready', () => {
    console.log('callback');
    const init_overlay = document.getElementById('init_overlay');
    init_overlay.style.display = 'none';
    Game.StartGame(socket);
});

