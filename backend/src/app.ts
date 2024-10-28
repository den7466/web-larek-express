import 'dotenv/config';
import express  from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/product';
import ordersRouter from './routes/order';
import authRouter from './routes/auth';
import path from 'path';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_ADDRESS, ORIGIN_ALLOW } = process.env;

const app = express();
app.use(cors({origin: ORIGIN_ALLOW, credentials: true, allowedHeaders: ['Authorization', 'Content-Type'],}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(`${DB_ADDRESS}`);
app.use(requestLogger);
app.use('/product', productsRouter);
app.use('/order', ordersRouter);
app.use('/auth', authRouter);
app.use(errorLogger);
app.use(errorHandler);
app.listen(PORT, () => {console.log(`Сервер запущен на ${PORT} порту`)});