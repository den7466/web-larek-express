import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import path from 'path';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import clearTempFiles from './controllers/clear-temp-files';
import indexRouter from './routes/index';
import {
  DB_ADDRESS,
  ORIGIN_ALLOW,
  PORT,
} from './config';

const cron = require('node-cron');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: ORIGIN_ALLOW,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(`${DB_ADDRESS}`);
app.use(requestLogger);
app.use('/', indexRouter);
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});

// Временные файлы очищаются каждый день в 23:59
cron.schedule('59 23 * * *', clearTempFiles);
