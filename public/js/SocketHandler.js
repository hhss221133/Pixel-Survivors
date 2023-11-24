const socket = io('http://ec2-18-162-115-233.ap-east-1.compute.amazonaws.com');

socket.on('connect', () => {
    console.log('Connected to the server via WebSockets!');
});

socket.on('login required', () => {
    console.log('You are not logged in.');
    window.location.href = '/';
});

export default socket;