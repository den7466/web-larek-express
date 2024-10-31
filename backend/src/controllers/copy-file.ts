import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_PATH_TEMP } from '../config';

interface IFile {
  fileName: string;
  originalName: string;
}

const copyFile = async (file: IFile) => {
  await fs.copyFile(
    path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/`, file.originalName),
    path.join(__dirname, '../public', file.fileName)
  );
}

export default copyFile;