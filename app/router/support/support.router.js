const { SupportController } = require("../../http/controllers/support/support.controller");
const { checkLogin, checkAccessLogin } = require("../../http/middlewares/auth");
const { ApiNameSpaceRouter } = require("./namespace.router");
const { ApiRoomRouter } = require("./room.router");
const router = require("express").Router();

router.use("/namespace", ApiNameSpaceRouter)
router.use("/room", ApiRoomRouter)
router.get("/login", checkAccessLogin, SupportController.loginForm)
router.post("/login", checkAccessLogin, SupportController.login)
router.get("/", checkLogin, SupportController.renderChatRoom)
module.exports = {
    SupportSectionRouter : router
}