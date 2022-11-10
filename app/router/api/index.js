const homeController = require("../../http/controllers/api/home.controller");
const router = require("express").Router();
/**
 * @swagger
 * tags:
 *  name: IndexPage
 *  description: index page route and data
 */
/**
 * @swagger
 * /:
 *  get:
 *      summary : index of routes
 *      tags: [IndexPage]
 *      description : get all data for index page
 *      responses:
 *          200:
 *              description: success
 *          404:
 *              description : notfound 
 */

router.get("/" , homeController.indexPage);
module.exports = {
    HomeRoutes : router
}