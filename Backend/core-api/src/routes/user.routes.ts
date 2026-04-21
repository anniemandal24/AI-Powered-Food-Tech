import {Router } from "express"
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js"
import {
    getUserProfile,
    updateProfile,
    addFamilyMembers,
    editFamilyMember,
    removeFamilyMember
} from "../controllers/user.controller.js"

const router=Router()

router.get("/get-profile",jwtAuthMiddleware,getUserProfile)
router.put("/update-profile",jwtAuthMiddleware,updateProfile)
router.put("/add-family-member/:id",jwtAuthMiddleware,addFamilyMembers)
router.put("/edit-family-member/:memberIndex",jwtAuthMiddleware,editFamilyMember)
router.delete("/remove-family-member/:memberIndex",jwtAuthMiddleware,removeFamilyMember)

export default router