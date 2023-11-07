const fs = require("fs");
const path = require('path');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
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

            const newLobby = {
                id: uuidv4(),
                createdBy: username,
                createdAt: new Date().toISOString(),
                players: [{ username: username, status: "joined" }],
                settings: { maxPlayers: 2 },
                status: "waiting"
            };

            lobbies.push(newLobby);

            writeLobbiesFile(lobbies, err => {
                if (err) return callback(err, null);
                callback(null, newLobby);
            });
        });
    }
}

module.exports = LobbiesModel;