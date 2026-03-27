//  Create a middleware that logs all incoming requests to the console.

const express = require('express');
const app = express();

function logRequests(req, res, next) {
    // write the logic for request log here
    //${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}T${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.
    console.log(`${req.method} / - ${new Date().toISOString()}`);
    next();
}

app.use(logRequests);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
});

module.exports = app;
