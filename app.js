//app.js
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const queue = require("./queue");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

const router = express.Router();

router.post('/task', (req, res) => {
    queue.sendToQueue("proccess_data", req.body);
    res.json({message: 'Your request will be processed!'});
});


app.use('/', router);

app.post('/login', (req, res, next) => {
    res.json({ token: '123456' });
});

module.exports = app;
