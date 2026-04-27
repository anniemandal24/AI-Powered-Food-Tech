import { Router } from "express"
import{
    getAnalyticsReport,
    saveAnalyticsReport,
    deleteAnalyticsReport,
    editAnalyticsReport
} from "../controllers/analytics.controller.js"
import {jwtAuthMiddleware} from "../middlewares/jwt.middleware.js"

export const analyticsRouter = Router()
analyticsRouter.use(jwtAuthMiddleware)

analyticsRouter.get("/get-analytics/:user_id",getAnalyticsReport)
analyticsRouter.post("/save-analytics/:user_id",saveAnalyticsReport)
analyticsRouter.delete("/delete-analytics/:analytics_id",deleteAnalyticsReport)
analyticsRouter.put("/edit-analytics/:analytics_id",editAnalyticsReport)