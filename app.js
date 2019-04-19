const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const auth = require('./middleware/auth');

if (!config.get('jwtPrivateKey')) {
    console.error('Error: jwtPrivateKey is not defined.');
    process.exit(1);
}

const loginRouter = require('./routes/login');
const regRouter = require('./routes/register');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.use('/login', loginRouter);
app.use('/register', regRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/dashboard', auth, dashboardRouter);

//lets keep what is below on the bottom (?)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port: ${port} ...`);
})

mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));