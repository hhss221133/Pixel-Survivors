const socket = io('http://localhost:8000');

socket.on('connect', () => {
    console.log('Connected to the server via WebSockets!');
});

export default socket;
