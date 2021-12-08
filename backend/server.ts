import express, { Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  HashedValueGeneratorFactory,
  UniqueEntityIDGeneratorFactory,
} from './entities';
import BcryptHash from './infrastructure/pulgins/BcryptHash';
import ObjectIdGenerator from './infrastructure/pulgins/ObjectIdGenerator';
import BaseRouter from './infrastructure/routes';

// init id factory
UniqueEntityIDGeneratorFactory.getInstance().initialize(
  new ObjectIdGenerator()
);
console.log('Entity ID Generators initialized');

// init hash factory
HashedValueGeneratorFactory.getInstance().initialize(new BcryptHash());
console.log('hashed value Generators initialized');

// init express
const app = express();

// dotenc config
dotenv.config();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
// set header
app.use(function (_, res: Response, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Access-Control-Max-Age', '3600');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, x-access-token, x-user-id,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// connect mongoose
mongoose
  .connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Successfully connect to MongoDB.');
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// Add APIs
app.use('/api', BaseRouter);

// set port, listen for requests
const PORT = process.env.API_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
