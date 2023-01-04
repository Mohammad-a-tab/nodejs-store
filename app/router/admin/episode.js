const { AdminEpisodeController } = require("../../http/controllers/admin/course/episode.controller")
const { uploadVideoEpisode } = require("../../utils/multer")
const router = require("express").Router()

router.post("/add" 
    , uploadVideoEpisode.single("video")
    , AdminEpisodeController.addNewEpisode)
router.get("/get/:episodeID" 
    , AdminEpisodeController.getOneEpisode)
router.delete("/remove/:episodeID" 
    , AdminEpisodeController.deleteOneEpisode)
router.patch("/update/:episodeID" 
    , uploadVideoEpisode.single("video")
    , AdminEpisodeController.updateOneEpisode)

module.exports = {
    AdminApiEpisodeRouter : router
}