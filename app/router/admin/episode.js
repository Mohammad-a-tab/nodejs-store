const { AdminEpisodeController } = require("../../http/controllers/admin/course/episode.controller")

const router = require("express").Router()

router.put("/add" , AdminEpisodeController.addNewEpisode)
// router.get("/get" , AdminEpisodeController.getOneChapter)
// router.get()
// router.patch()
// router.delete()

module.exports = {
    AdminApiEpisodeRouter : router
}