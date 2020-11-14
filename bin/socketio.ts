import crypto from 'crypto';

interface Token {
  privateKey: string;
  publicKey: number;
  character: string;
}

interface ConnectingUser {
  publicKey: number;
  character: string;
  name?: string;
}

interface Post {
  text: string;
  publicKey: number;
  character: string;
  name: string;
}

/**
 * IDからトークンを作成して返す
 * @param id socket.id
 * @param publicKey 公開情報としてのユーザー識別子 単なる連番
 * @returns {Token} IDと選択されたキャラクター
 */
const createToken = (id: string, publicKey: number): Token => {
  // 受け取ったidから適当にハッシュ値を作る
  const privateKey = crypto.createHash('sha1').update(id).digest('hex');
  // 9種類の中からランダムにアバターを決定する
  const charList = 'abcdefghi';
  const character = charList[Math.floor(Math.random() * charList.length)];
  return {
    privateKey,
    publicKey,
    character,
  };
};

const connectSocketio = (io: SocketIO.Server) => {
  // 内部でコネクションしているユーザーを記憶する
  let connectingUser: ConnectingUser[] = [];
  let count = 0;
  // サーバーに接続されたとき
  io.on('connection', (socket) => {
    console.log('ユーザーのsocket.io接続を検知しました');
    // アクセスしたユーザーのトークンを作成し、本人に送付
    const token = createToken(socket.id, count);
    io.to(socket.id).emit('token', token);
    // 述べ参加人数を更新 (publicKeyとして使う)
    count++;

    // 切断を検知したとき
    socket.on('disconnect', (reason) => {
      console.log('ユーザーのsocket.io切断を検知しました', reason);

      // 接続中のユーザーから切断されたユーザーを削除
      const currentUser = connectingUser.filter(
        (user) => user.publicKey !== token.publicKey
      );
      connectingUser = currentUser;

      // 最新アクティブユーザーの通知
      io.emit('update-connecting-user', connectingUser);
      console.log('現在入室中のユーザーは以下です', connectingUser);
    });

    // チャットルームへ入室したとき
    socket.on('join', (user) => {
      console.log('入室を試行しています', user);
      // ここはprivate鍵を使って判定
      if (user.privateKey === token.privateKey) {
        // 入室成功の通知
        io.to(socket.id).emit('join-succeed');
        console.log('入室に成功しました');

        // ユーザーリストに新たなユーザーを追加
        const newUser: ConnectingUser = {
          publicKey: user.publicKey,
          character: user.character,
          name: user.name,
        };
        connectingUser.push(newUser);

        // 最新アクティブユーザーの通知
        io.emit('update-connecting-user', connectingUser);
        console.log('現在入室中のユーザーは以下です', connectingUser);
      } else {
        console.log('入室に失敗しました');
      }
    });

    // 誰かが投稿したとき
    socket.on('post', (post: Post) => {
      console.log(
        'ユーザーから post を受け取りました emitで全員宛に投稿を返却します'
      );
      io.emit('post', post);
    });
  });
};

export default connectSocketio;
