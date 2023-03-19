const { UserController } = require("../controllers/user.controller");
const router = require('express').Router();

router.get("/list", UserController.getListOfUser)
router.put("/update", UserController.UpdateUser)
module.exports = {
    UserRouter : router
}