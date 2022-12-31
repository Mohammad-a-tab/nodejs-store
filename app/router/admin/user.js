const { AdminUserController } = require("../../http/controllers/admin/user/user.controller")

const router = require("express").Router()
// router.post()
router.patch("/update-profile" , AdminUserController.updateUserProfile)
// router.delete()
router.get("/list" , AdminUserController.getAllUsers)
module.exports = {
    AdminApiUserRouter : router
}