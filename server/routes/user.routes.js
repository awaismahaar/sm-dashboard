import express from "express"
import { allUsers, createUser, deleteUser, getProfile, login, logout, updateUser } from "../controllers/user.controller.js"
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/create-user" , createUser)
router.post("/login" , login)
router.get("/logout" , logout)
router.get("/profile" , authMiddleware, getProfile)
router.get("/all-users" , authMiddleware, checkRole, allUsers)
router.put("/update-user" , authMiddleware, updateUser)
router.delete("/delete-user/:id" , authMiddleware, checkRole, deleteUser)

export default router;