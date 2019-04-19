const config = require('config');
const jwt = require('jsonwebtoken');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        let xhr = new XMLHttpRequest();
        await xhr.open('GET', 'http://localhost:3000/login/failed');
        xhr.setRequestHeader('x-failure-reason', 'No token provided.');
        xhr.send();

        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        let xhr = new XMLHttpRequest();
        await xhr.open('GET', 'http://localhost:3000/login/failed');
        xhr.setRequestHeader('x-failure-reason', 'Invalid token.');
        xhr.send();
        res.status(400).send('Invalid token.');
    }
}