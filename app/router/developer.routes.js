const router =require("express").Router();
const bcrypt =require("bcrypt");
const { RandomNumberGenerator } = require("../utils/function");
/**
 * @swagger
 * tags:
 *      name: Developer-Routes
 *      description: developer Utils
 */
/**
 * @swagger
 * /developer/password-hash/{password}:
 *      get:
 *          tags: [Developer-Routes]
 *          summary: hash data with bcrypt
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: password
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */                 
router.get("/password-hash/:password" , (req,res,next) => {
    const salt = bcrypt.genSaltSync(10);
    const {password} =req.params;
    return res.send(bcrypt.hashSync(password,salt));
});
/**
 * @swagger
 * /developer/random-number:
 *      get:
 *          tags: [Developer-Routes]
 *          summary: get random number
 *          responses:
 *              200:
 *                  description: success
 */                 
 router.get("/random-number" , (req,res,next) => {
    return res.send(RandomNumberGenerator().toString());
})


module.exports = {
    DeveloperRoutes : router
}