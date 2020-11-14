$(() => {
  const socket = io();
  const $entrance = $('[data-js-selector=entrance]');
  const $room = $('[data-js-selector=room]');
  const $member = $('[data-js-selector=member]');
  const $message = $('[data-js-selector=message]');
  const $formMessage = $('[data-js-selector=formMessage]');
  const $inputMessage = $('[data-js-selector=inputMessage]');
  const $formName = $('[data-js-selector=formName]');
  const $inputName = $('[data-js-selector=inputName]');
  const active = '--active';
  /**
   * name: string
   * privateKey: string
   * publicKey: number
   * character: string
   */
  let iam;

  const listenEvent = () => {
    // アクセス時に発行されたtokenを受け取り保存
    socket.on('token', (token) => {
      iam = token;
    });
    // 入室に成功したとき、DOMを切り替える
    socket.on('join-succeed', () => {
      $entrance.removeClass(active);
      $room.addClass(active);
    });
    // 誰かが入室/退室したとき、ユーザー一覧をDOMに反映する
    socket.on('update-connecting-user', (connectingUser) => {
      $member.empty();
      connectingUser.forEach((user) => {
        const text = $('<li>').text(`${user.name} (${user.character})`);
        $member.append(text);
      });
    });
    // 誰かが投稿したとき、内容をDOMに反映する
    socket.on('post', (post) => {
      const text = `${post.name} (${post.character}): ${post.text}`;
      $message.append($('<li>').text(text));
    });
  };

  listenEvent();

  // 入室 + 名前の送信
  $formName.submit((e) => {
    e.preventDefault();
    iam.name = $inputName.val();
    socket.emit('join', iam);
  });

  // メッセージ送信
  $formMessage.submit((e) => {
    e.preventDefault();
    const post = {
      text: $inputMessage.val(),
      name: iam.name,
      publicKey: iam.publicKey,
      character: iam.character,
    };
    // emit = 放出 ここではサーバーに対して通知を飛ばす
    socket.emit('post', post);
    // テキストボックスの初期化
    $inputMessage.val('');
    return false;
  });
});
