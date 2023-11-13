const express = require('express');
const session = require('express-session');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

//Express App setup
const app = express();

app.use(express.static('../public'));
app.use(express.json());

//Session settings
const Session = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(Session);
app.set('view engine', 'ejs');

//Routes import defined here
const UserAuth = require('./routes/UserAuth');

app.use(UserAuth);

//Creating HTTP and WS server
const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingInterval: 5000, // How often a ping is sent, in milliseconds
    pingTimeout: 1000,   // How long to wait for a pong before considering the connection closed
});

console.log(`Socket.IO pingInterval set to: ${io.opts.pingInterval}`);
console.log(`Socket.IO pingTimeout set to: ${io.opts.pingTimeout}`);

require('./socketHandler')(io, Session);

//Starting the HTTP Server
httpServer.listen(8000);

console.log('HTTP and WS server started on port 8000');