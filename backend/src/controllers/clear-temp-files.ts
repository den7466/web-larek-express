import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_PATH_TEMP } from '../config';

const clearTempFiles = async () => {
  const items = await fs.readdir(path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/`));
  items.forEach((item) => {
    fs.unlink(path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/${item}`));
  });
};

export default clearTempFiles;
