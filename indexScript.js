const apiURL = 'https://debtcolapi.onrender.com';
const bLogIn = document.getElementById('bLogIn');
const bGLogIn = document.getElementById('bGLogIn');
const username = document.getElementById('lname');
const password = document.getElementById('lpassword');

bLogIn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const uVal = username.value;
    const pVal = password.value;


    try {
        const response = await fetch(`${apiURL}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: uVal, password: pVal }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Store the JWT token in localStorage
            localStorage.setItem('role', data.account.role); // Store the role in localStorage
            localStorage.setItem('userID', data.account.id); // Store the role in localStorage            
            localStorage.setItem('username', data.account.name); // Store the username in localStorage
            window.location.href = 'landing.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while trying to log in. Please try again later.');
    }
});

bGLogIn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const uVal = 'guest';
    const pVal = 'guest';

    try {
        const response = await fetch(`${apiURL}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: uVal, password: pVal }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Store the JWT token in localStorage
            localStorage.setItem('role', data.account.role); // Store the role in localStorage
            localStorage.setItem('username', uVal); // Store the username in localStorage
            alertGuestLogin(); // Show alert for guest login
            //window.location.href = 'landing.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while trying to log in. Please try again later.');
    }
});

// Create an alert function for guest login
function alertGuestLogin() {
    const alert = document.createElement('div');
    alert.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 w-[30%]';

    const message = document.createElement('span');
    message.textContent = 'You are about to log in as Guest, you will not be able to place any orders. If you want to place orders, please log in with your account or create a new one. Click the button below to continue.';
    message.className = 'block mb-2';

    const button = document.createElement('button');
    button.textContent = 'I understand, continue as Guest';
    button.className = 'w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition';
    button.onclick = () => {
        alert.remove();
        window.location.href = 'landing.html';
    };

    alert.appendChild(message);
    alert.appendChild(button);
    document.body.appendChild(alert);
};