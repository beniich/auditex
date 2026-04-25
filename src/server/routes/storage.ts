import { Router } from 'express';
import { StorageController } from '../controllers/StorageController';
import multer from 'multer';

const router = Router();

// Configure Multer for local storage (mimicking S3)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Storage Routes
router.post('/storage/upload', upload.single('file'), StorageController.upload);
router.get('/storage/url/:key', StorageController.getUrl);

export default router;
