import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import http from "http"
import fs from "fs"
const FILE_PATH = './document.txt';

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));



io.on('connection', (socket) => {

    socket.on('addCircle', (data) => {
        socket.broadcast.emit('receiveCircle', data);
    });
    socket.on('addSquare', (data) => {
        socket.broadcast.emit('receiveSquare', data);
    });
    socket.on('addLine', (data) => {
        socket.broadcast.emit('receiveLine', data);
    });
    socket.on('addLineArrow', (data) => {
        socket.broadcast.emit('receiveLineArrow', data);
    });
    socket.on('objectModified', (data) => {
        socket.broadcast.emit('recieveObjectModified', data)
    })
    socket.on('drawing', (string) => {
        socket.broadcast.emit('drawing', string);
    });
    socket.on('addText', (string) => {
        socket.broadcast.emit('receiveText', string);
    });
});


const port = 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});