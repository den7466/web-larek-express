import multer from 'multer';

const uploadFile = multer({dest: 'src/public/temp/'}).single('file');

export default uploadFile;