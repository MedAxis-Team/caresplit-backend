import { Router } from "express";
import AuthController from "../controllers/auth";

const router = Router();

router.post('/signup', AuthController.signUp)