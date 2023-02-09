const { AdminChapterController } = require("../../http/controllers/admin/course/chapter.controller");
const router = require("express").Router();

router.put("/add"
    , AdminChapterController.addChapter) //create new chapter
router.get("/list/:courseID"
    , AdminChapterController.chaptersOfCourse) //get list of chapter related course
router.patch("/remove/:chapterID"
    , AdminChapterController.removeChapterById) //remove chapter
router.patch("/update/:chapterID"
    , AdminChapterController.updateChapterById) //update chapter

module.exports = {
    AdminApiChapterRouter : router
}