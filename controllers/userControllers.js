import Router from 'koa-router';
import db from '../models/index';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config.js';

const userSignupControler = async (ctx) => {
  const { username, password } = JSON.parse(ctx.request.body);
  if (!username || !password) {
    ctx.status = 406;
    ctx.body = {
      authenticated: false,
      message: 'Invalid query',
      username: username,
      password: password
    };
    return;
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 2)
    console.log('passwordHash',passwordHash)
    const user = new db.User({
      username: username,
      password: passwordHash,
    });
    const newUser = await user.save();
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: `You signed up as ${newUser.username}`,
    };
  } catch (err) {
    ctx.status = 403;
    const message = err.errors;
    ctx.body = {
      message
    };
  }
};

const userLoginControler = async (ctx) => {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body;
  console.log(username, password)
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = {
      authenticated: false,
      message: 'Invalid query',
    };
    return;
  }
  try {
    const user = await db.User.findOne({ username })
    const checkPassword = await user.checkPassword(password)
    if (checkPassword) {
      ctx.status = 200;
      const token = jwt.sign({ _id: user._id }, config.secret);
      ctx.body = {
        authenticated: true,
        username: user.username,
        token,
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        authenticated: false,
        message: 'Invalid password',
      };
    }
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      authenticated: false,
      message: 'Invalid user name',
    };
  }
};

const getUserData = async (ctx) => {
  try {
    const header = ctx.headers['x-authorization-token'];
    const bearer = header.split(' ');
    const bearerToken = bearer[1];
    const token = bearerToken;

    const { _id } = await jwt.verify(token, config.secret);
    const { username } = await db.User.findOne({ _id });
    ctx.status = 200;
    ctx.body = {
      authenticated: true,
      username,
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      authenticated: false,
      err: `cannot veryfy`,
    };
  }
};

export default function userRouter() {
  const router = Router();
  router.post('/signup', userSignupControler);
  router.post('/login', userLoginControler);
  router.get('/getuserdata', getUserData);
  return router.routes();
}
