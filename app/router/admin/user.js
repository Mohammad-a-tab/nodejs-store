const { AdminUserController } = require("../../http/controllers/admin/user/user.controller");
const router = require("express").Router();

router.patch("/update-profile" 
    , AdminUserController.updateUserProfile)
router.get("/list" 
    , AdminUserController.getAllUsers)
router.get("/profile" 
    , AdminUserController.userProfile)
module.exports = {
    AdminApiUserRouter : router
}