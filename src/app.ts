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
    console.log(process.env.MONGO_DB_URL);
    mongoose.connect(
      process.env.MONGO_DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log('Connected to');
      }
    );
  }
}
export default new App().express;
