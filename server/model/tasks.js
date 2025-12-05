import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                // Due date should be in the future when creating
                return !value || value >= new Date();
            },
            message: 'Due date must be in the future'
        }
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [20, 'Tag cannot exceed 20 characters']
    }],
    subtasks: [{
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Subtask title cannot exceed 100 characters']
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    archived: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Index for better query performance
tasksSchema.index({ user: 1, completed: 1, priority: 1, dueDate: 1 });
tasksSchema.index({ tags: 1 });

// Virtual for overdue status
tasksSchema.virtual('isOverdue').get(function() {
    return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Method to calculate completion percentage
tasksSchema.methods.getCompletionPercentage = function() {
    if (this.subtasks.length === 0) return this.completed ? 100 : 0;
    const completedSubtasks = this.subtasks.filter(st => st.completed).length;
    return Math.round((completedSubtasks / this.subtasks.length) * 100);
};

const Task = mongoose.model('Task', tasksSchema);

export default Task;