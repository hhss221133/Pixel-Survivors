const fs = require("fs");
const path = require('path');
const bcrypt = require("bcrypt");
require('dotenv').config({path: "../.env"});

const userjson_path = path.join(__dirname, '../data/users.json');

const UserModel = {
    findUser: (username, callback) => {
        fs.readFile(userjson_path, 'utf8', (err, data) => {
            if (err) return callback(err, null);

            let users;
            try {
                users = JSON.parse(data);
            } catch (err) {
                return callback(err, null);
            }

            const user = users.find(u => u.username === username);
            return callback(null, user);
        });
    },

    checkLogin: function(username, password, callback) {
        this.findUser(username, function(err, user) {
            if (err) return callback(err);
            if (!user) return callback(null, false);

            bcrypt.compare(password, user.password, function(err, result) {
            if (err) return callback(err);
            return callback(null, result); // result will be true if passwords match, false otherwise
            });
        });
    },

    addUser: (newUser, callback) => {
        fs.readFile(userjson_path, 'utf8', (err, data) => {
            if(err) return callback(err);
            let users;
            try {
                users = JSON.parse(data)
            } catch (err) {
                return callback(err);
            }

            bcrypt.hash(newUser.password, parseInt(process.env.PASSWORD_SALT_ROUNDS, 10), function(err, hash) {
                if (err) return callback(err);

                newUser.password = hash;
                users.push(newUser);

                fs.writeFile(userjson_path, JSON.stringify(users, null, 2), 'utf8', err => {
                    if (err) return callback(err);
                    return callback(null);
                });
            });
        });
    }
}

module.exports = UserModel;