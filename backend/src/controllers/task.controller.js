import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Task } from '../models/task.model.js';
import mongoose from 'mongoose';

// ADMIN CONTROLLERS

const createTask = asyncHandler(async(req, res) => {
    const {title, description, priority, dueDate, assignedTo, tags} = req.body;
    const adminId = req.user?._id;
    const role = req.user?.role;

    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can create tasks");
    }

    if(!title || !title.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    const task = await Task.create({
        title,
        description,
        priority,
        dueDate: dueDate && dueDate.trim() ? new Date(dueDate) : undefined,
        assignedTo,
        createdBy: adminId,
        tags
    });

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedTask,
                "Task created successfully"
            )
        )
});

const getAllTasks = asyncHandler(async(req, res) => {
    const role = req.user?.role;

    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can view all tasks");
    }

    const tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "All tasks fetched successfully"
            )
        )
});

const updateTask = asyncHandler(async(req, res) => {
    const {taskId} = req.params;
    const {title, description, priority, dueDate, assignedTo, tags} = req.body;
    const adminId = req.user?._id;
    const role = req.user?.role;

    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can update tasks");
    }

    if(!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);

    if(!task) {
        throw new ApiError(404, "Task not found");
    }

    if(task.createdBy.toString() !== adminId.toString()) {
        throw new ApiError(403, "You can only update tasks you created");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                ...(title && {title}),
                ...(description !== undefined && {description}),
                ...(priority && {priority}),
                ...(dueDate && {dueDate}),
                ...(assignedTo && {assignedTo}),
                ...(tags && {tags})
            }
        },
        {returnDocument: 'after'}
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTask,
                "Task updated successfully"
            )
        )
});

const deleteTask = asyncHandler(async(req, res) => {
    const {taskId} = req.params;
    const adminId = req.user?._id;
    const role = req.user?.role;

    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can delete tasks");
    }

    if(!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);

    if(!task) {
        throw new ApiError(404, "Task not found");
    }

    if(task.createdBy.toString() !== adminId.toString()) {
        throw new ApiError(403, "You can only delete tasks you created");
    }

    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Task deleted successfully"
            )
        )
});

// USER & ADMIN CONTROLLERS

const getTaskById = asyncHandler(async(req, res) => {
    const {taskId} = req.params;
    const userId = req.user?._id;
    const role = req.user?.role;

    if(!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid Task ID");
    }

    const task = await Task.findById(taskId)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    if(!task) {
        throw new ApiError(404, "Task not found");
    }

    // User can only see tasks assigned to them
    if(role === 'user' && task.assignedTo?.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only view tasks assigned to you");
    }

    // Admin can see all tasks
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task fetched successfully"
            )
        )
});

const updateTaskStatus = asyncHandler(async(req, res) => {
    const {taskId} = req.params;
    const {status} = req.body;
    const userId = req.user?._id;
    const role = req.user?.role;

    if(!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    if(!status || !['pending', 'in-progress', 'completed', 'on-hold'].includes(status)) {
        throw new ApiError(400, "Valid status is required");
    }

    const task = await Task.findById(taskId);

    if(!task) {
        throw new ApiError(404, "Task not found");
    }

    // User can only update status of tasks assigned to them
    if(role === 'user' && task.assignedTo?.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update status of tasks assigned to you");
    }

    // Admin can update status of their created tasks
    if(role === 'admin' && task.createdBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update status of tasks you created");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {status}
        },
        {returnDocument: 'after'}
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTask,
                "Task status updated successfully"
            )
        )
});

export {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTaskById,
    updateTaskStatus
};