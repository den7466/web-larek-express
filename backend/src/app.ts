import 'dotenv/config';
import express  from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/product';
import ordersRouter from './routes/order';
import path from 'path';
import errorHandler from './middlewares/error-handler';
const cors = require('cors');

const { PORT = 3000, DB_ADDRESS } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(`${DB_ADDRESS}`);

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use(errorHandler);

app.listen(PORT, () => {console.log(`Сервер запущен на ${PORT} порту`)});