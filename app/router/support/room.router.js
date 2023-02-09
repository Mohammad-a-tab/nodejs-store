const { RoomController } = require("../../http/controllers/support/room.controller");
const { uploadFileSupport } = require("../../utils/multer");
const router = require("express").Router();

router.post("/add", uploadFileSupport.single("image"), RoomController.addRoom)
router.get("/list", RoomController.getListOfRoom)

module.exports = {
    ApiRoomRouter : router
}