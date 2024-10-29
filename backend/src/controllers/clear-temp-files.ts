import path from 'path';
import fs from 'fs/promises';

const clearTempFiles = async () => {
  const items = await fs.readdir(path.join(__dirname, '../public/temp/'));
  for await (const item of items){
    fs.unlink(path.join(__dirname, `../public/temp/${item}`));
  }
  console.log('Все временные файлы удалены из папки temp');
}

export default clearTempFiles;