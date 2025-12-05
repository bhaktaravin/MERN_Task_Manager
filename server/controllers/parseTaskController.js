import {
    getParseTasksService,
    createParseTaskService,
    updateParseTaskService,
    deleteParseTaskService,
    getParseTaskStatsService
} from '../services/parseTaskService.js';

// Get all tasks from Back4App
export const getParseTasks = async (req, res) => {
    try {
        const filters = {
            completed: req.query.completed,
            priority: req.query.priority,
            archived: req.query.archived || false,
            sortBy: req.query.sortBy || 'createdAt',
            order: req.query.order || 'desc',
            page: req.query.page || 1,
            limit: req.query.limit || 50
        };

        const tasks = await getParseTasksService(filters);

        res.status(200).json({
            success: true,
            data: tasks,
            source: 'Back4App Parse Server'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks from Back4App',
            error: error.message
        });
    }
};

// Create task in Back4App
export const createParseTask = async (req, res) => {
    try {
        const task = await createParseTaskService(req.body);

        res.status(201).json({
            success: true,
            message: 'Task created in Back4App successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating task in Back4App',
            error: error.message
        });
    }
};

// Update task in Back4App
export const updateParseTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await updateParseTaskService(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Task updated in Back4App successfully',
            data: task
        });
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json({
                success: false,
                message: 'Task not found in Back4App'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating task in Back4App',
            error: error.message
        });
    }
};

// Delete task from Back4App
export const deleteParseTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await deleteParseTaskService(id);

        res.status(200).json({
            success: true,
            message: 'Task deleted from Back4App successfully',
            data: task
        });
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json({
                success: false,
                message: 'Task not found in Back4App'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting task from Back4App',
            error: error.message
        });
    }
};

// Get statistics from Back4App
export const getParseTaskStats = async (req, res) => {
    try {
        const stats = await getParseTaskStatsService();

        res.status(200).json({
            success: true,
            data: stats,
            source: 'Back4App Parse Server'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics from Back4App',
            error: error.message
        });
    }
};
