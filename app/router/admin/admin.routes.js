const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiChapterRouter } = require("./chapter");
const { AdminApiCourseRouter } = require("./course");
const { AdminApiEpisodeRouter } = require("./episode");
const { AdminApiPermissionRouter } = require("./permission");
const { AdminApiProductRouter } = require("./product");
const { AdminApiRoleRouter } = require("./role");
const { AdminApiUserRouter } = require("./user");
const router =require("express").Router();

router.use("/category", AdminApiCategoryRouter)
router.use("/blogs",AdminApiBlogRouter)
router.use("/products",AdminApiProductRouter)
router.use("/courses",AdminApiCourseRouter)
router.use("/chapters",AdminApiChapterRouter)
router.use("/episodes",AdminApiEpisodeRouter)
router.use("/users",AdminApiUserRouter)
router.use("/permission",AdminApiPermissionRouter)
router.use("/role",AdminApiRoleRouter)

module.exports = {
    AdminRoutes : router
}