const axios = require('axios');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const prepareLogin = () => {
    document.querySelector('form').addEventListener('submit', initLogin);
}

const initLogin = (e) => {
    e.preventDefault();
    const emailInput = document.querySelector('.standard-email');
    const passwordInput = document.querySelector('.standard-password');
    performLogin(emailInput.value, passwordInput.value);
}

const performLogin = async (email, password) => {
    axios.post(
        'http://localhost:3000/auth', 
        {
            email: email,
            password: password
        }
    )
    .then(async function (response) {

        window.location.href = `http://localhost:3000/dashboard/${response.headers['x-users-id']}`;

    })
    .catch(async function (error) {
    console.log(error);
    });
}

prepareLogin();