// form-handler.js
document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the document is fully loaded
    register_ajax();
    login_ajax();
});

function register_ajax() {
    const registerForm = document.getElementById('registerform');
    const responseMessageElement = document.getElementById('register_responseMessage'); // Get the message element

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                username: registerForm['username'].value,
                password: registerForm['password'].value,
                passwordAgain: registerForm['passwordAgain'].value
            };

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Convert the JavaScript object to a JSON string
            })
            .then(response => response.json())
            .then(data => {
                // Handle response data
                responseMessageElement.textContent = data.message;
                responseMessageElement.style.color = data.success ? '#28a745' : '#d9534f'; // Change color based on success
                responseMessageElement.style.display = 'block';
                console.log(data);
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
        });
    }
}

function login_ajax() {
    const loginForm = document.getElementById('loginform');
    const responseMessageElement = document.getElementById('login_responseMessage'); // Get the message element
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                username: loginForm['username'].value,
                password: loginForm['password'].value
            };

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                responseMessageElement.textContent = data.message;
                responseMessageElement.style.color = data.success ? '#28a745' : '#d9534f'; // Change color based on success
                responseMessageElement.style.display = 'block';
                window.location.href = '/lobbies';
                console.log(data);
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
        });
    }
}