import { Router } from "express";
import authorizationMiddleware from "../middleware/authorization.js";
import InterswitchController from "../controllers/interswitch.js";

const router = Router()

router.post('/pay/:billId',
     authorizationMiddleware.Authorization,
     InterswitchController.initiatePayment)

router.get('/verify/:paymentId', InterswitchController.verifyPayment)


export default router