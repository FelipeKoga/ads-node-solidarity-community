/* eslint-disable new-cap */
import { Router } from 'express';
import UserController from '@controllers/UserController';
import auth from '@middlewares/auth';
import AuthController from '@controllers/AuthController';

const routes = Router();
routes.use(auth);
routes.post('/login', AuthController.authenticate);
routes.get('/users', UserController.list);
routes.post('/users', UserController.create);

export default routes;
