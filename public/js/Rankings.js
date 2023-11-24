import socket from './SocketHandler.js'; // Import the socket instance

document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    perform_cleanup();
    get_rankings();
});

function perform_cleanup() {
    socket.emit('lobbies json cleanup');
}

function get_rankings() {
    socket.emit('request rankings');
}

function populate_rankings(rankingsData) {
    console.log('updated rankings');
      
    // Sort the overall rankings by 'clearTime' in ascending order
    rankingsData.sort((a, b) => a.clearTime - b.clearTime);
    
    // Get the 'ul' element
    const rankList = document.getElementById('rank_list');
    
    // Populate the 'ul' with sorted data
    rankingsData.forEach((item, index) => {
        // Create the 'li' element
        const li = document.createElement('li');
        li.style = 'display: flex; flex-direction: row; justify-content: space-start; background-color:floralwhite; padding:1px; gap:10px; font-weight:bold; align-items:center';
    
        // Sort the players in 'playerData' by score in descending order
        const sortedPlayers = Object.entries(item.playerData)
                                    .sort(([,scoreA], [,scoreB]) => scoreB - scoreA);
    
        // Prepare HTML content for the 'li' element
        let playersContent = '';
        sortedPlayers.forEach(([username, score]) => {
            playersContent += `<p>${username}:${score} (score)</p>`;
        });
    
        // Set the inner HTML of the 'li' element
        li.innerHTML = `
            <p style='color:red; font-size:25px;'>${index + 1}.</p>
            <p style='font-size:25px;'>Clear Time:${item.clearTime}</p>
            ${playersContent}
        `;
    
        // Append the 'li' to the 'ul'
        rankList.appendChild(li);
    });
      
  
}



//Listeners
socket.on('all rankings', (data) => {
    console.log(data);
    populate_rankings(data);
});
