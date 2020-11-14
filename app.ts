import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';

const app = express();

// Viewのセットアップ
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// TODO: 何してるか調べる
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーターの読み込み
app.use('/', indexRouter);

// 404を受け取ったときにエラーを発生させる
// MEMO: ここの引数は3つのときreq, res, nextとなる
app.use((_req, _res, next) => {
  next(createError(404));
});

// エラーハンドラ
// TODO: ここだと引数4つあって型が取れなくなる どうするの
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
