import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'images';
const UPLOAD_PATH_TEMP = process.env.UPLOAD_PATH_TEMP || 'temp';
const ORIGIN_ALLOW = process.env.ORIGIN_ALLOW || 'http://localhost:5173';
const AUTH_REFRESH_TOKEN_EXPIRY = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
const AUTH_REFRESH_TOKEN_SECRET = process.env.AUTH_REFRESH_TOKEN_SECRET || '';
const AUTH_ACCESS_TOKEN_EXPIRY = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '';
const AUTH_ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET || '10m';

export {
  PORT,
  DB_ADDRESS,
  UPLOAD_PATH,
  UPLOAD_PATH_TEMP,
  ORIGIN_ALLOW,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_SECRET,
};
