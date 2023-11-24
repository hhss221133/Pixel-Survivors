import socket from './SocketHandler.js'; // Import the socket instance

let currentUsername = null;

document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded

    logout();
    perform_cleanup();
    // get_profile();
    get_lobbies();
    create_lobby_session();
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

function perform_cleanup() {
    socket.emit('lobbies json cleanup');
}

// function populate_profile(username) {
//     const username_el = document.getElementById('profile_username');
//     username_el.textContent = username;
// }

// function get_profile() {
//     socket.emit('get username');
// }

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

        //Create status span
        const statSpan = document.createElement('span');
        statSpan.textContent = `${lobby.status}`;
        // Create the join button
        const joinButton = document.createElement('button');
        joinButton.className = 'join_btn';
        joinButton.id = 'join_lobby_btn'
        joinButton.textContent = 'Join';
        joinButton.dataset.owner = lobby.createdBy;

        // Append the username span and the right div (which contains the users count and join button) to the list item
        listItem.appendChild(usernameSpan);
        itemRightDiv.appendChild(usersSpan);
        itemRightDiv.appendChild(statSpan);
        itemRightDiv.appendChild(joinButton);
        listItem.appendChild(itemRightDiv);

        // Append the list item to the lobby list element
        lobbyListElement.appendChild(listItem);
    });

    join_lobby_session();
}

function get_lobbies() {
    socket.emit('request lobbies');
}

function create_lobby_session() {
    const create_lobby = document.getElementById('create_lobby');

    if (create_lobby) {
        create_lobby.addEventListener('click', function(e) {
            e.preventDefault();

            socket.emit('create lobby session');       
        });
    }
}

function join_lobby_session() {
    const join_lobby_btn = document.getElementById('join_lobby_btn');
    if (join_lobby_btn) {
        join_lobby_btn.addEventListener('click', function(e) {
            e.preventDefault();
            socket.emit('join lobby session', this.dataset.owner);       
        });
    }
}

//Socket Listeners
// socket.on('receive username', (username) => {
//     currentUsername = username;
//     populate_profile(username);
// });


socket.on('all lobbies list', (lobbies) => {
    // Call the function to populate the lobby list with the data received
    populate_lobbies(lobbies);
});

//Listening for io emit when any socket creates/delete a lobby json + room
socket.on('io updated lobbies json', () => {
    get_lobbies();
});

//User opens/joins a new/existing Lobby
socket.on('lobby session started', () => {
    socket.emit('set creating or joining');
    window.location.href = '/lobby';
});


//Clean up occuring
socket.on('disable create', () => {
    const create_lobby = document.getElementById('create_lobby');
    create_lobby.setAttribute('disabled', true);
});

socket.on('allow create', () => {
    const create_lobby = document.getElementById('create_lobby');
    create_lobby.removeAttribute('disabled');
});
