import path from 'path';
import fs, { constants } from 'fs/promises';
import { UPLOAD_PATH_TEMP } from '../config';

interface IFile {
  fileName: string;
  originalName: string;
}

const copyFile = async (file: IFile) => {
  fs.access(path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/${file.originalName}`), constants.F_OK).then(() => {
    fs.copyFile(
      path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/`, file.originalName),
      path.join(__dirname, '../public', file.fileName),
    );
  }).catch(() => {});
};

export default copyFile;
