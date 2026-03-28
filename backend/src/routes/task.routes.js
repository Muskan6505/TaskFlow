import { Router } from "express";
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTaskById,
    updateTaskStatus
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createTask);
router.route("/all").get(verifyJWT, getAllTasks);
router.route("/:taskId").get(verifyJWT, getTaskById);
router.route("/:taskId").put(verifyJWT, updateTask);
router.route("/:taskId").delete(verifyJWT, deleteTask);
router.route("/:taskId/status").patch(verifyJWT, updateTaskStatus);

export default router;
