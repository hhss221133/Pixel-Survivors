const fs = require("fs");
const path = require('path');
const rankings_path = path.join(__dirname, '../data/rankings.json');


function RankingsEvents(socket, io, userTimeouts) {

    // Handle request for lobbies list
    socket.on('request rankings', () => {
        fs.readFile(rankings_path, 'utf8', (err, data) => {
            if (err) {
                // Handle error (e.g., file not found or read error)
                console.error("Error reading rankings file:", err);
                socket.emit('rankings response', { error: "Unable to retrieve rankings." });
                return;
            }

            try {
                // Parse the JSON data
                const rankings = JSON.parse(data);
                // Emit the rankings to the requesting client
                io.emit('all rankings', rankings);
            } catch (parseErr) {
                // Handle JSON parsing error
                // console.error("Error parsing rankings JSON:", parseErr);
                // io.emit('rankings response', { error: "Error processing rankings data." });
            }
        });
    });
}

module.exports = RankingsEvents;