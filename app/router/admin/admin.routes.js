const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiChapterRouter } = require("./chapter");
const { AdminApiCourseRouter } = require("./course");
const { AdminApiEpisodeRouter } = require("./episode");
const { AdminApiProductRouter } = require("./product");
const router =require("express").Router();

router.use("/category", AdminApiCategoryRouter)
router.use("/blogs",AdminApiBlogRouter)
router.use("/products",AdminApiProductRouter)
router.use("/courses",AdminApiCourseRouter)
router.use("/chapters",AdminApiChapterRouter)
router.use("/episodes",AdminApiEpisodeRouter)

module.exports = {
    AdminRoutes : router
}