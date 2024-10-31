import { UPLOAD_PATH_TEMP } from '../config';
import multer from 'multer';
import path from 'path';

const fileFilter = (req: any, file: any, cb: any) => {
  if(file.mimetype === "image/png" || file.mimetype === "image/jpg"|| file.mimetype === "image/jpeg" || file.mimetype === "image/gif"){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const uploadFile = multer({
  dest: path.join(__dirname, `../public/${UPLOAD_PATH_TEMP}/`),
  limits: { fileSize: 10*1024*1024 },
  fileFilter: fileFilter})
  .single('file');

export default uploadFile;