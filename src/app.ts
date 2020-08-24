/* eslint-disable require-jsdoc */
import express from 'express';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';
require('dotenv/config');

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(routes);
    mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
export default new App().express;
