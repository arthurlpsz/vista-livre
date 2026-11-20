import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB por imagem

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new AppError('Formato de arquivo inválido. Envie apenas imagens JPG, PNG ou WebP.', 400),
      false
    );
  }
  cb(null, true);
}

export const uploadFotosMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 15,
  },
}).array('fotos', 15);