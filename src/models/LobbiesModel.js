const fs = require("fs");
const path = require('path');
require('dotenv').config({path: "../.env"});

const lobbiesjson_path = path.join(__dirname, '../data/lobbies.json');

function readLobbiesFile(callback) {
    fs.readFile(lobbiesjson_path, 'utf8', (err, data) => {
        if (err) return callback(err, null);

        try {
            const lobbies = JSON.parse(data);
            callback(null, lobbies);
        } catch (err) {
            callback(err, null);
        }
    });
}

function writeLobbiesFile(lobbies, callback) {
    fs.writeFile(lobbiesjson_path, JSON.stringify(lobbies, null, 2), 'utf8', callback);
}

const LobbiesModel = {
    getLobbies: (callback) => {
        readLobbiesFile(callback);
    },

    newLobby: (username, callback) => {
        readLobbiesFile((err, lobbies) => {
            if (err) return callback(err, null);

            // Check if the user has already created a lobby
            const existingLobby = lobbies.find(lobby => lobby.createdBy === username);
            if (existingLobby) {
                // User has already created a lobby, return a specific error message
                // return callback(new Error('User already has a lobby'), null);
                callback(null, existingLobby);
            }
            else {
                const newLobby = {
                    createdBy: username,
                    createdAt: new Date().toISOString(),
                    players: [{ username: username, status: "joined", character: 'Knight' }],
                    settings: { maxPlayers: 2 },
                    status: "waiting"
                };
    
                lobbies.push(newLobby);
    
                writeLobbiesFile(lobbies, err => {
                    if (err) return callback(err, null);
                    callback(null, newLobby);
                });
            }
        });
    },

    joinLobby: (username, roomID, callback) => {
        readLobbiesFile((err, lobbies) => {
            if (err) return callback(err, null);

            const lobby = lobbies.find(lobby => lobby.createdBy === roomID);
            if (!lobby) {
                return callback(new Error('Lobby not found'), null);
            }

            const isAlreadyJoined = lobby.players.some(player => player.username === username);
            if (isAlreadyJoined) {
                return callback(new Error('User has already joined this lobby'), null);
            }

            if (lobby.status != 'waiting') {
                return callback(new Error('Lobby currently disabled'), null);
            }
    
            if (lobby.players.length >= lobby.settings.maxPlayers) {
                return callback(new Error('Lobby is full'), null);
            }
    
            lobby.players.push({
                username: username,
                status: "joined",
                character: "Knight"
            });
    
            // Write the updated lobbies back to the file
            writeLobbiesFile(lobbies, err => {
                if (err) return callback(err, null);
                callback(null, lobby);
            });
        });
    },

    setLobbyStatus: (username, roomID, status, callback) => {
        readLobbiesFile((err, lobbies) => {
            if(username != roomID) {
                return;
            }

            if (err) return callback(err);
    
            // Find the lobby with the given ID
            let lobby = lobbies.find(lobby => lobby.createdBy === roomID);
            if (!lobby) {
                return callback(new Error('Lobby not found'));
            }
    
            if (lobby.createdBy === username) {
                lobby.status = status; // Set status to "disabled"
            }
    
            // Write the updated list of lobbies back to the file
            writeLobbiesFile(lobbies, err => {
                if (err) return callback(err);
                callback(null);
            });
        });
    },
    
    leaveLobby: (username, roomID, callback) => {
        readLobbiesFile((err, lobbies) => {
            if (err) return callback(err);
    
            // Find the lobby with the given ID
            let lobby = lobbies.find(lobby => lobby.createdBy === roomID);
            if (!lobby) {
                return callback(new Error('Lobby not found'));
            }
    
            // Check if the user is in the lobby's players array
            const playerIndex = lobby.players.findIndex(player => player.username === username);
            if (playerIndex === -1) {
                return callback(new Error('User not found in the lobby'));
            }
    
            // Remove the user from the players array
            lobby.players.splice(playerIndex, 1);
    
            // If the user leaving is the creator, handle lobby deletion
            if (lobby.createdBy === username) {
                const index = lobbies.indexOf(lobby);
                lobbies.splice(index, 1);
                lobby = null;
            }
    
            // Write the updated list of lobbies back to the file
            writeLobbiesFile(lobbies, err => {
                if (err) return callback(err);
                callback(null, lobbies, lobby);
            });
        });
    },
    
    editLobbyChar: (username, roomID, char, callback ) => {
        readLobbiesFile((err, lobbies) => {

            if (err) return callback(err);
    
            // Find the lobby with the given ID
            let lobby = lobbies.find(lobby => lobby.createdBy === roomID);
            if (!lobby) {
                return callback(new Error('Lobby not found'));
            }
            const playerIndex = lobby.players.findIndex(player => player.username === username);
            if (playerIndex === -1) {
                return callback(new Error('User not found in the lobby'));
            }
            lobby.players[playerIndex].character = char;


            

    
            // Write the updated list of lobbies back to the file
            writeLobbiesFile(lobbies, err => {
                if (err) return callback(err);
                callback(null);
            });
        });
    },
}

module.exports = LobbiesModel;