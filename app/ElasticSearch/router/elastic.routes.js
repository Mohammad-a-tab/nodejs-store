const { IndicesRoutes } = require("./indices.routes");
const router = require("express").Router();

router.use("/index", IndicesRoutes)

module.exports = {
    ElasticRouter : router
}