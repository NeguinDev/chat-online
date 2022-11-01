const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require("socket.io");
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'public')));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', require('./socket'));

module.exports = server;