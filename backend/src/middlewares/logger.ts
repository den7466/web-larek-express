import path from 'path';

const winston = require('winston');
const expressWinston = require('express-winston');

export const requestLogger = expressWinston.logger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'request.log'),
    }),
  ],
  format: winston.format.json(),
});

// логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  level: 'error',
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'error.log'),
    }),
  ],
  format: winston.format.json(),
});
