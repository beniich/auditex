import { Router } from 'express';
import { RAGController } from '../controllers/RAGController';

const router = Router();

router.get('/rag/sources', RAGController.getSources);
router.get('/rag/query', RAGController.query);

export default router;
