// 公式チュートリアルに準拠
// see: https://socket.io/get-started/chat/
const connectSocketio = (io: SocketIO.Server) => {
  io.on('connection', (socket) => {
    console.log('ユーザーのsocket.ioへの接続を確認しました');

    // socket.on はemitされたイベントの通知を受け取って発火(BE, FE共通)
    socket.on('chat message', (msg) => {
      console.log('イベント chat message を受け取りました emitでメッセージを返却します');
      // emit = 放出 ここではすべてのクライアントに通知を飛ばす
      io.emit('chat message', msg);
    });
  });
};

export default connectSocketio;
