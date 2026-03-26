import { Router } from "express";
import authRoutes from "./auth.js"
import billRoutes from "./bill.js"


const rootRouter = Router()

rootRouter.use('/auth', authRoutes )
rootRouter.use('/bill', billRoutes )


export default rootRouter

