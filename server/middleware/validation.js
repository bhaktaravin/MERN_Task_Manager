import { body, param, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Task validation rules
export const validateCreateTask = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priority must be low, medium, high, or urgent'),
    
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Due date must be a valid date')
        .custom((value) => {
            if (value && new Date(value) < new Date()) {
                throw new Error('Due date must be in the future');
            }
            return true;
        }),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.some(tag => tag.length > 20)) {
                throw new Error('Each tag must not exceed 20 characters');
            }
            return true;
        }),
    
    body('subtasks')
        .optional()
        .isArray().withMessage('Subtasks must be an array'),
    
    body('subtasks.*.title')
        .if(body('subtasks').exists())
        .trim()
        .notEmpty().withMessage('Subtask title is required')
        .isLength({ max: 100 }).withMessage('Subtask title cannot exceed 100 characters'),
    
    handleValidationErrors
];

export const validateUpdateTask = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
    body('completed')
        .optional()
        .isBoolean().withMessage('Completed must be a boolean'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priority must be low, medium, high, or urgent'),
    
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Due date must be a valid date'),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.some(tag => tag.length > 20)) {
                throw new Error('Each tag must not exceed 20 characters');
            }
            return true;
        }),
    
    body('subtasks')
        .optional()
        .isArray().withMessage('Subtasks must be an array'),
    
    body('archived')
        .optional()
        .isBoolean().withMessage('Archived must be a boolean'),
    
    handleValidationErrors
];

export const validateTaskId = [
    param('id')
        .isMongoId().withMessage('Invalid task ID format'),
    
    handleValidationErrors
];
