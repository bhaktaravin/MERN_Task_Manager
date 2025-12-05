import express from 'express';
import {
    getParseTasks,
    createParseTask,
    updateParseTask,
    deleteParseTask,
    getParseTaskStats
} from '../controllers/parseTaskController.js';
import {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId
} from '../middleware/validation.js';

const router = express.Router();

// Back4App Parse routes
router.get('/parse/tasks', getParseTasks);
router.get('/parse/tasks/stats', getParseTaskStats);
router.post('/parse/tasks', validateCreateTask, createParseTask);
router.put('/parse/tasks/:id', validateUpdateTask, updateParseTask);
router.delete('/parse/tasks/:id', deleteParseTask);

export default router;
