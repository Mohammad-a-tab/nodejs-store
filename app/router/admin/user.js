const { AdminUserController } = require("../../http/controllers/admin/user/user.controller")

const router = require("express").Router()
// router.post()
// router.patch()
// router.delete()
router.get("/list" , AdminUserController.getAllUsers)
module.exports = {
    AdminApiUserRouter : router
}