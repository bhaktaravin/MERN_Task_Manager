import express from 'express';
import { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask,
    getTaskStats
} from '../controllers/taskController.js';
import { 
    validateCreateTask, 
    validateUpdateTask, 
    validateTaskId 
} from '../middleware/validation.js';

const router = express.Router();

// Define routes with validation
router.get('/tasks', getTasks);
router.get('/tasks/stats', getTaskStats);
router.post('/tasks', validateCreateTask, createTask);
router.put('/tasks/:id', validateTaskId, validateUpdateTask, updateTask);
router.delete('/tasks/:id', validateTaskId, deleteTask);

export default router;