import socket from './SocketHandler.js'; // Import the socket instance

const Game = GameLoop();



document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    ping_server();
    rejoin_room();
    on_load();
    ready_button();
});

function ping_server() {
    socket.emit('reconnected');
}

function on_load() {
    socket.emit('is playing?');
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

//Listeners;

socket.on("set character", (playerType) => {
    (playerType == "Knight")? AddKnight(100, 540) : AddWizard(100, 540);
});

socket.on('all ready', () => {
    console.log('callback');
    const init_overlay = document.getElementById('init_overlay');
    init_overlay.style.display = 'none';
    Game.StartGame(socket);
});

socket.on('player playing', (isPlaying) => {
    if(isPlaying) {
        console.log('callback');
        const init_overlay = document.getElementById('init_overlay');
        init_overlay.style.display = 'none';
    }
});

socket.on("update player states",  (playerData) => {
    PlayerStateData = playerData;
});

socket.on("update time left",  (timeData) => {
    TimeLeft = timeData;
});

socket.on("game ends", () => {
    GameRunning = false;
});
