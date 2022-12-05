const { verifyAccessToken } = require("../../http/middlewares/verifyAccessToken");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiCourseRouter } = require("./course");
const { AdminApiProductRouter } = require("./product");

const router =require("express").Router();
/**
 * @swagger
 *   tags:
 *      -   name: Admin-Panel
 *          description: action of admin (add, edit, remove and any do)
 *      -   name: Course(Admin-Panel)
 *          description: management course section like manage chapter,episode and courses
 *      -   name: Product(Admin-Panel)
 *          description: managements Product routes
 *      -   name: Category(Admin-Panel)
 *          description: all method and routes Category section
 *      -   name: Prisma(Api)
 *          description: create some api's with prisma and postgresSQL
 *      -   name: Blog(Admin-Panel)
 *          description: make blog management admin panel
 *          
 */

router.use("/category", AdminApiCategoryRouter)
router.use("/blogs",AdminApiBlogRouter)
router.use("/products",AdminApiProductRouter)
router.use("/courses",AdminApiCourseRouter)

module.exports = {
    AdminRoutes : router
}