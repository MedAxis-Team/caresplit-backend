import { Router } from "express";
import BillController from "../controllers/bill.js";
import authorizationMiddleware from "../middleware/authorization.js";


const router = Router();

router.post('/bill', authorizationMiddleware.Authorization, BillController.bill);
router.get('/getBills', BillController.getBills);
router.get('/getBill/:billId', BillController.getBill);


export default router