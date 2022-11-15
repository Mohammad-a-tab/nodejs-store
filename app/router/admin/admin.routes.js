const { CategoryRoutes } = require("./category");

const router =require("express").Router();
/**
 * @swagger
 *   tags:
 *      -   name: Admin-Panel
 *          description: action of admin (add, edit, remove and any do)
 *      -   name: Category(Admin-Panel)
 *          description: all method and routes
 *          
 */

router.use("/category",CategoryRoutes)

module.exports = {
    AdminRoutes : router
}