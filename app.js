const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

if (!config.get('jwtPrivateKey')) {
    console.error('Error: jwtPrivateKey is not defined.');
    process.exit(1);
}

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res, next) => {
    res.render('login');
})

app.get('/register', (req, res, next) => {
    res.render('register');
})

//lets keep what is below on the bottom (?)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port: ${port} ...`);
})

mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));