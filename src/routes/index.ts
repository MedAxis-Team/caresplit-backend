import { Router } from "express";
import authRoutes from "./auth.js"
import billRoutes from "./bill.js"
import interswitch from "./interswitch.js"




const rootRouter = Router()

rootRouter.use('/auth', authRoutes )
rootRouter.use('/bill', billRoutes )
rootRouter.use('/pay', interswitch)



export default rootRouter

