import express from 'express';
import http from 'http';
import socketio from 'socket.io';

// 公式チュートリアルに準拠
// see: https://socket.io/get-started/chat/

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (_socket) => {
  console.log('a user connected');
});

server.listen(5000, () => {
  console.log('listening on localhost:5000');
});
