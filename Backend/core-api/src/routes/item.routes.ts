import {Router} from "express"
import{
    addItem,
    getAllItem,
    getItembyStatus,
    getItemById,
    editItem,
    updateItemStatus,
    deleteItem,
    getExpiredItems,
    uploadFile,
    deleteFile
} from "../controllers/item.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js"

const router=Router()

router.post("/upload",upload.single("file"),uploadFile)
router.delete("/upload/:public_id",deleteFile)

router.post("/add-item",jwtAuthMiddleware,addItem)
router.get("/all",jwtAuthMiddleware,getAllItem)
router.get("/expired",jwtAuthMiddleware,getExpiredItems)
router.get("/get-item/:status",jwtAuthMiddleware,getItembyStatus)
router.get("/:id",jwtAuthMiddleware,getItemById)
router.put("/edit-item/:id",jwtAuthMiddleware,editItem)
router.put("/status/:id",jwtAuthMiddleware,updateItemStatus)
router.delete("/delete-item/:id",jwtAuthMiddleware,deleteItem)

export default router