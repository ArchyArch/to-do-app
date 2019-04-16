const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res, next) => {
    res.render('login');
})

//lets keep what is below on the bottom (?)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port: ${port} ...`);
})