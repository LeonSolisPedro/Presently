import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import http from "http"
import fs from "fs"
import fss from "fs/promises"
import { Readable } from "stream"
const FILE_PATH = './document.txt';

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));



io.on('connection', (socket) => {

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });


  socket.on('addCircle', (data, room) => {
    socket.to(room).emit('receiveCircle', data);
  });

  socket.on('addSquare', (data, room) => {
    socket.to(room).emit('receiveSquare', data);
  });

  socket.on('addLine', (data, room) => {
    socket.to(room).emit('receiveLine', data);
  });

  socket.on('addLineArrow', (data, room) => {
    socket.to(room).emit('receiveLineArrow', data);
  });

  socket.on('objectModified', (data, room) => {
    socket.to(room).emit('receiveObjectModified', data);
  });

  socket.on('drawing', (string, room) => {
    socket.to(room).emit('receiveDrawing', string);
  });

  socket.on('addText', (string, room) => {
    socket.to(room).emit('receiveText', string);
  });

  socket.on('deleteObject', (string, room) => {
    socket.to(room).emit('deleteObject', string);
  });

  socket.on('saveDataDisk', (string, room) => {
    const ostream = fs.createWriteStream(`./slides/${room}/slide1.json`, { encoding: 'utf8' });
    const readable = Readable.from(string);
    readable.pipe(ostream);
  });
});


app.get("/api/getSlide/:id", async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  try {
    await fss.access(`slides/${id}`)
    const files = await fss.readdir(`slides/${id}`)
    const buffer = await fss.readFile(`slides/${id}/slide${page ?? 1}.json`);
    const jsonData = JSON.parse(buffer);
    const response = { numberOfSlides: files.length, current: page ?? 1, content: jsonData }
    return res.status(200).json(response)
  } catch (error) {
    return res.status(404).send()
  }
})



const port = 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});