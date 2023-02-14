const { SupportController } = require("../../http/controllers/support/support.controller");
const { checkLogin } = require("../../http/middlewares/auth");
const { ApiNameSpaceRouter } = require("./namespace.router");
const { ApiRoomRouter } = require("./room.router");
const router = require("express").Router();

router.use("/namespace", ApiNameSpaceRouter)
router.use("/room", ApiRoomRouter)
router.get("/login", SupportController.loginForm)
router.post("/login", SupportController.login)
router.get("/", checkLogin, SupportController.renderChatRoom)
module.exports = {
    SupportSectionRouter : router
}