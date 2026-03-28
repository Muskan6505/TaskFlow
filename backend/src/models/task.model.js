import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'on-hold'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            }
        ],
    },
    {
        timestamps: true,
    }
);

export const Task =  mongoose.model('Task', taskSchema);