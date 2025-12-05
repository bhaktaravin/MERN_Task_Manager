// Generate Controller
import Task from '../model/tasks.js';

// Get all tasks with filtering, sorting, and pagination (user's own tasks)
export const getTasks = async (req, res) => {
    try {
        const { 
            completed, 
            priority, 
            archived = false, 
            tags,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 50
        } = req.query;

        // Build filter object - only get tasks for authenticated user
        const filter = { 
            user: req.user._id,
            archived 
        };
        if (completed !== undefined) filter.completed = completed === 'true';
        if (priority) filter.priority = priority;
        if (tags) filter.tags = { $in: tags.split(',') };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const tasks = await Task.find(filter)
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Task.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tasks',
            error: error.message 
        });
    }
};

// Create a new task
export const createTask = async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            user: req.user._id
        });
        await newTask.save();
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        });
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error creating task',
            error: error.message 
        });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find task and verify ownership
        const task = await Task.findOne({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: 'Task not found or you do not have permission to update it' 
            });
        }
        
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error updating task',
            error: error.message 
        });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find task and verify ownership
        const task = await Task.findOne({ _id: id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: 'Task not found or you do not have permission to delete it' 
            });
        }
        
        const deletedTask = await Task.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true,
            message: 'Task deleted successfully',
            data: deletedTask
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error deleting task',
            error: error.message 
        });
    }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const total = await Task.countDocuments({ user: userId, archived: false });
        const completed = await Task.countDocuments({ user: userId, completed: true, archived: false });
        const overdue = await Task.countDocuments({ 
            user: userId,
            dueDate: { $lt: new Date() },
            completed: false,
            archived: false
        });
        
        const byPriority = await Task.aggregate([
            { $match: { user: userId, archived: false } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                completed,
                pending: total - completed,
                overdue,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
                byPriority: byPriority.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching statistics',
            error: error.message 
        });
    }
};
