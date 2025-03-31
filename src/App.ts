// @ts-nocheck
import express, { Application } from 'express';
import './config/envLoader';
import bodyParser from 'body-parser';
import cors from 'cors';
import corsMiddleware from './middlewares/corsMiddleware'; 
import routes from './routes';
import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandlers'; 

import path from 'path';

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false, limit: '800mb' }));
app.use(bodyParser.json({ limit: '800mb' }));
app.use(cors());
app.use(corsMiddleware);

app.use('/', routes);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
