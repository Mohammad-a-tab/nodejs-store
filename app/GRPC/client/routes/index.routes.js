const { UserRouter } = require("./user.routes");
const router = require("express").Router();
router.use("/user", UserRouter)
module.exports = {
    AllRoutes : router
}