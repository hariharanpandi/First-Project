import express from "express";

/**
 * Middleware functions
 */
import { headerVerification } from "../middleware/headerVerification";

import UserController from "../controllers/userController";

const userController = new UserController();

const ROUTER = express.Router();

/**
 * Register user
 */
ROUTER.post("/create/user", headerVerification, userController.registerUser);

/**
 * Email verification
 */
ROUTER.patch("/email/verify/:user_id", headerVerification, userController.verifyEmail);

/**
 * Login user
 */
ROUTER.post("/login", headerVerification, userController.login);

export default ROUTER;