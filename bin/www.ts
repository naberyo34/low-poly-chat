import app from '../app';
import http from 'http';
import socketio from 'socket.io';
import connectSocketio from './socketio';

// app に対してポート番号を指定
const port = process.env.PORT || '5000';
app.set('port', port);

// app でHTTPサーバーを立ち上げる
const server = http.createServer(app);

// socket.ioの初期化と起動
const io = socketio(server);
connectSocketio(io);

// サーバーを待ち受け状態にする
server.listen(port);
