const { checkPermission } = require("../../http/middlewares/permission.guard");
const { AdminApiPermissionRouter } = require("./permission");
const { PERMISSIONS } = require("../../utils/constants");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiProductRouter } = require("./product");
const { AdminApiEpisodeRouter } = require("./episode");
const { AdminApiChapterRouter } = require("./chapter");
const { AdminApiCourseRouter } = require("./course");
const { AdminApiRoleRouter } = require("./role");
const { AdminApiUserRouter } = require("./user");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiTransactionRouter } = require("./transactions");
const router =require("express").Router();

router.use("/category", checkPermission([PERMISSIONS.CONTENT_MANAGER]), 
    AdminApiCategoryRouter)
router.use("/blogs", checkPermission([PERMISSIONS.TEACHER]),
    AdminApiBlogRouter)
router.use("/products", checkPermission([PERMISSIONS.SUPPLIER,
        PERMISSIONS.CONTENT_MANAGER
    ]), AdminApiProductRouter)
router.use("/courses", checkPermission([PERMISSIONS.TEACHER]),
    AdminApiCourseRouter)
router.use("/chapters", checkPermission([PERMISSIONS.TEACHER]),
    AdminApiChapterRouter)
router.use("/episodes", checkPermission([PERMISSIONS.TEACHER]), 
    AdminApiEpisodeRouter)
router.use("/users", AdminApiUserRouter)
router.use("/permission", checkPermission([PERMISSIONS.ADMIN]),
    AdminApiPermissionRouter)
router.use("/role", checkPermission(PERMISSIONS.ADMIN),
    AdminApiRoleRouter)
router.use("/transactions", checkPermission(PERMISSIONS.ADMIN),
    AdminApiTransactionRouter)

module.exports = {
    AdminRoutes : router
}