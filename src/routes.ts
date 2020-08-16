/* eslint-disable new-cap */
import { Router } from 'express';
import UserController from '@controllers/UserController';
// import AuthController from "./controllers/AuthController";
// import authMiddleware from "./middlewares/auth";

const routes = Router();
// routes.use(authMiddleware);
routes.get('/users', UserController.list);
routes.post('/users', UserController.create);
// routes.post("/register", UserController.create);
// routes.get("/authenticate", AuthController.authenticate);

export default routes;
