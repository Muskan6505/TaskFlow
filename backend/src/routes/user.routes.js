import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    getUserTasks,
    getAdminTasks,
    getAllUsers
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT, getCurrentUser);
router.route("/update").put(verifyJWT, updateAccountDetails);
router.route("/tasks").get(verifyJWT, getUserTasks);
router.route("/admin/tasks").get(verifyJWT, getAdminTasks);
router.route("/all").get(verifyJWT, getAllUsers);

export default router;