import Router from 'koa-router';
import userControllers from './userControllers';


const configurePublic = () => {
  const publicRouter = Router();
  publicRouter.use(userControllers());
  return publicRouter.routes();
};

export default configurePublic;

