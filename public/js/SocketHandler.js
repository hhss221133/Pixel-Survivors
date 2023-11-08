const socket = io('http://localhost:8000');

socket.on('connect', () => {
    console.log('Connected to the server via WebSockets!');
});

socket.on('login required', () => {
    console.log('You are not logged in.');
    window.location.href = '/';
});

export default socket;