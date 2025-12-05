import Parse from '../config/parse.js';

// Parse Task Model
const Task = Parse.Object.extend('Task');

// Get all tasks from Parse
export const getParseTasksService = async (filters = {}) => {
    const query = new Parse.Query(Task);
    
    // Apply filters
    if (filters.completed !== undefined) {
        query.equalTo('completed', filters.completed);
    }
    if (filters.priority) {
        query.equalTo('priority', filters.priority);
    }
    if (filters.archived !== undefined) {
        query.equalTo('archived', filters.archived);
    }
    
    // Sorting
    if (filters.sortBy) {
        filters.order === 'asc' 
            ? query.ascending(filters.sortBy) 
            : query.descending(filters.sortBy);
    }
    
    // Pagination
    if (filters.limit) {
        query.limit(parseInt(filters.limit));
    }
    if (filters.page) {
        const skip = (parseInt(filters.page) - 1) * (parseInt(filters.limit) || 50);
        query.skip(skip);
    }
    
    const results = await query.find({ useMasterKey: true });
    return results.map(task => ({
        id: task.id,
        ...task.toJSON()
    }));
};

// Create task in Parse
export const createParseTaskService = async (taskData) => {
    const task = new Task();
    
    task.set('title', taskData.title);
    if (taskData.description) task.set('description', taskData.description);
    task.set('completed', taskData.completed || false);
    task.set('priority', taskData.priority || 'medium');
    if (taskData.dueDate) task.set('dueDate', new Date(taskData.dueDate));
    if (taskData.tags) task.set('tags', taskData.tags);
    if (taskData.subtasks) task.set('subtasks', taskData.subtasks);
    task.set('archived', taskData.archived || false);
    
    await task.save(null, { useMasterKey: true });
    return {
        id: task.id,
        ...task.toJSON()
    };
};

// Update task in Parse
export const updateParseTaskService = async (taskId, updateData) => {
    const query = new Parse.Query(Task);
    const task = await query.get(taskId, { useMasterKey: true });
    
    if (!task) {
        throw new Error('Task not found');
    }
    
    // Update fields
    Object.keys(updateData).forEach(key => {
        if (key === 'dueDate' && updateData[key]) {
            task.set(key, new Date(updateData[key]));
        } else {
            task.set(key, updateData[key]);
        }
    });
    
    await task.save(null, { useMasterKey: true });
    return {
        id: task.id,
        ...task.toJSON()
    };
};

// Delete task from Parse
export const deleteParseTaskService = async (taskId) => {
    const query = new Parse.Query(Task);
    const task = await query.get(taskId, { useMasterKey: true });
    
    if (!task) {
        throw new Error('Task not found');
    }
    
    await task.destroy({ useMasterKey: true });
    return {
        id: task.id,
        ...task.toJSON()
    };
};

// Get task statistics from Parse
export const getParseTaskStatsService = async () => {
    const totalQuery = new Parse.Query(Task);
    totalQuery.equalTo('archived', false);
    const total = await totalQuery.count({ useMasterKey: true });
    
    const completedQuery = new Parse.Query(Task);
    completedQuery.equalTo('completed', true);
    completedQuery.equalTo('archived', false);
    const completed = await completedQuery.count({ useMasterKey: true });
    
    const overdueQuery = new Parse.Query(Task);
    overdueQuery.lessThan('dueDate', new Date());
    overdueQuery.equalTo('completed', false);
    overdueQuery.equalTo('archived', false);
    const overdue = await overdueQuery.count({ useMasterKey: true });
    
    return {
        total,
        completed,
        pending: total - completed,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
};
