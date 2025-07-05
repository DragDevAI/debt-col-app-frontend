const apiURL = 'https://debtcolapi.onrender.com';
const bRegister = document.getElementById('bRegister');
const username = document.getElementById('sname');
const password = document.getElementById('spassword');
const cpassword = document.getElementById('cpassword');

bRegister.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const uVal = username.value;
    const pVal = password.value;
    const cpVal = cpassword.value;

    if (pVal !== cpVal) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${apiURL}/account/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: uVal, password: pVal, role: 'user' }), // Default role 'user' for regular users
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! You can now log in.');
            window.location.href = 'index.html'; // Redirect to login page
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred while trying to register. Please try again later.');
    }
});

