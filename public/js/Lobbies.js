import socket from './SocketHandler.js'; // Import the socket instance


document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    logout();
    get_lobbies();
});

function logout() {
    const logout_button = document.getElementById('logout_button');

    if (logout_button) {
        logout_button.addEventListener('click', function(e) {
            e.preventDefault();

            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    window.location.href = "/";
                }
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
        });
    }
}

function get_lobbies() {
    // const requestLobbiesBtn = document.getElementById('request-lobbies-btn');
    // if (requestLobbiesBtn) {
    //     requestLobbiesBtn.addEventListener('click', () => {
    //         // Emit an event to request the lobbies from the server
    //         socket.emit('request lobbies');
    //     });
    // }
    socket.emit('request lobbies');
}

function populate_lobbies(lobbies) {
    const lobbyListElement = document.getElementById('lobby_list');
    lobbyListElement.innerHTML = ''; // Clear existing lobby items

    lobbies.forEach(lobby => {
        // Create the list item element
        const listItem = document.createElement('li');
        listItem.className = 'lobby_item';

        // Create the span for the username
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'lobby_username';
        usernameSpan.textContent = lobby.createdBy; 

        // Create the div that contains the number of users and the join button
        const itemRightDiv = document.createElement('div');
        itemRightDiv.className = 'lobby_item_right';

        // Create the span for the lobby users count
        const usersSpan = document.createElement('span');
        usersSpan.className = 'lobby_users';
        usersSpan.textContent = `${lobby.players.length}/${lobby.settings.maxPlayers}`; 

        // Create the join button
        const joinButton = document.createElement('button');
        joinButton.className = 'join_btn';
        joinButton.textContent = 'Join';
        joinButton.dataset.uuid = lobby.id; // Set the data attribute to the lobby's UUID

        // Append the username span and the right div (which contains the users count and join button) to the list item
        listItem.appendChild(usernameSpan);
        itemRightDiv.appendChild(usersSpan);
        itemRightDiv.appendChild(joinButton);
        listItem.appendChild(itemRightDiv);

        // Append the list item to the lobby list element
        lobbyListElement.appendChild(listItem);
    });
}



//Socket Listeners
socket.on('lobbies', (lobbies) => {
    // Call the function to populate the lobby list with the data received
    populate_lobbies(lobbies);
});