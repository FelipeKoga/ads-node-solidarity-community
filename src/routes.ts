/* eslint-disable new-cap */
import { Router } from 'express';
import UserController from '@controllers/UserController';
import auth from '@middlewares/auth';
import AuthController from '@controllers/AuthController';

const routes = Router();
routes.post('/login', AuthController.authenticate);
routes.post('/user', AuthController.register);

routes.use(auth);
routes.get('/me', UserController.getById);
routes.put('/user', UserController.update);

export default routes;
