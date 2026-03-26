import { Router } from "express";

import  AuthController from "../controllers/auth.js";

const router = Router();

router.post('/signup', AuthController.signUp)
router.post('/login', AuthController.login)



export default router