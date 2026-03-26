import { Router } from "express";
import BillController from "../controllers/bill.js";


const router = Router();

router.post('/bill', BillController.bill)
router.get('/getBills', BillController.getBills)
router.get('/getBill/:billId', BillController.getBill)


export default router