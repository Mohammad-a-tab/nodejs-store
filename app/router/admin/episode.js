const { AdminEpisodeController } = require("../../http/controllers/admin/course/episode.controller")
const { uploadVideoEpisode } = require("../../utils/multer")

const router = require("express").Router()

router.post("/add" , uploadVideoEpisode.single("video"), AdminEpisodeController.addNewEpisode)
// router.get("/get" , AdminEpisodeController.getOneChapter)
// router.get()
// router.patch()
// router.delete()

module.exports = {
    AdminApiEpisodeRouter : router
}