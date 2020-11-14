$(() => {
  const socket = io();
  $('form').submit((e) => {
    e.preventDefault();
    // emit = 放出 ここではサーバーに対して通知を飛ばす
    socket.emit('chat message', $('#m').val());
    // テキストボックスの初期化
    $('#m').val('');
    return false;
  });
  // socket.on はemitされたイベントの通知を受け取って発火(BE, FE共通)
  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });
});
