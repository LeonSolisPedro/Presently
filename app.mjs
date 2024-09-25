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
  // Load initial file content on connection
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (!err) {
          socket.emit('receiveEdit', data);
      }
  });

  socket.on('edit', (data) => {
      socket.broadcast.emit('receiveEdit', data);

      // Write data to file
      fs.writeFile(FILE_PATH, data, (err) => {
          if (err) {
              console.error('Error writing to file:', err);
          }
      });
  });
});


const port = 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});