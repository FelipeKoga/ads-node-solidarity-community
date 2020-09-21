/* eslint-disable new-cap */
import { Router } from 'express';
import UserController from '@controllers/UserController';
import auth from '@middlewares/auth';
import AuthController from '@controllers/AuthController';
import OcurrenceController from '@controllers/OcurrenceController';

const routes = Router();
routes.post('/login', AuthController.authenticate);
routes.post('/user', AuthController.register);
routes.get('/forgotPassword', AuthController.forgotPassword);

routes.use(auth);
routes.get('/me', UserController.getById);
routes.put('/user', UserController.update);
routes.get('/ocurrences', OcurrenceController.getAllOcurrences);
routes.post('/ocurrences', OcurrenceController.newOcurrence);
routes.put('/ocurrences/:id', OcurrenceController.updateOcurrence);
routes.get('/ocurrences/:id', OcurrenceController.getOcurrence);
routes.delete('/ocurrences/:id', OcurrenceController.deleteOcurrence);

routes.get('/ocurrences/me', OcurrenceController.getUserOcurrences);

export default routes;
