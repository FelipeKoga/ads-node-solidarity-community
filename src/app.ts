/* eslint-disable require-jsdoc */
import express from 'express';
import cors from 'cors';
import routes from './routes';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(routes);
  }
}
export default new App().express;
