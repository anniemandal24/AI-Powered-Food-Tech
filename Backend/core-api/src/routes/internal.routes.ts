import {Router} from "express";
import{
    getItemByStatus,getItemByStatusAndCategory,getToBeExpiredItems
} from "../controllers/internal.controller.js"
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";
const router=Router()

router.get("/to-be-expire",getToBeExpiredItems)

router.get("/inventory/:status",getItemByStatus)

router.get("/inventory/:status/:category",getItemByStatusAndCategory)

export default router