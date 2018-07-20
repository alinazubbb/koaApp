import Koa from 'koa';
import mongoose from 'mongoose';
import logger from 'koa-logger';
import bodyParser from 'koa-parser';
import cors from 'koa2-cors';

import config from './config';
import configurePublic from './controllers/index';

const app = new Koa();

// mongoose.Promise = global.Promise;

mongoose.connect(config.database, () => {
  console.log('db connected');
});

app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(configurePublic())
  .use(async (ctx) => {
    ctx.body = 'hi'
  });

app
  .listen(config.port, () =>
    (console.log(`app works on ${config.port} port`)));