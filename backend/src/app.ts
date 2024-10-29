import 'dotenv/config';
import express  from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/product';
import ordersRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import path from 'path';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import clearTempFiles from './controllers/clear-temp-files';
const cron = require('node-cron');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_ADDRESS, ORIGIN_ALLOW } = process.env;

const app = express();
app.use(cors({
  origin: ORIGIN_ALLOW,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(`${DB_ADDRESS}`);
app.use(requestLogger);
app.use('/upload', uploadRouter);
app.use('/product', productsRouter);
app.use('/order', ordersRouter);
app.use('/auth', authRouter);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {console.log(`Сервер запущен на ${PORT} порту`)});

// cron.schedule('55 * * * *', clearTempFiles);