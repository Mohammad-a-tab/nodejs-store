const { verifyAccessToken } = require("../../http/middlewares/verifyAccessToken");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiProductRouter } = require("./product");

const router =require("express").Router();
/**
 * @swagger
 *   tags:
 *      -   name: Admin-Panel
 *          description: action of admin (add, edit, remove and any do)
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

module.exports = {
    AdminRoutes : router
}