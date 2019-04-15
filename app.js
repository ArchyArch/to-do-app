const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port: ${port} ...`);
})