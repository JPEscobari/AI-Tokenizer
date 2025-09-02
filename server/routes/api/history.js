
import express from 'express';
import { getHistory, addHistoryEntry } from '../../controllers/api/history.js';

const router = express.Router();

router.get('/', getHistory);
router.post('/', addHistoryEntry);

export default router;
