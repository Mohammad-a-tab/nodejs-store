const { UserController } = require("../controllers/user.controller");
const { stringToArray } = require("../../../http/middlewares/stringToArray")
const router = require('express').Router();


router.get("/list", UserController.getListOfUser)
router.put("/update", stringToArray("bills"), UserController.UpdateUser)
module.exports = {
    UserRouter : router
}