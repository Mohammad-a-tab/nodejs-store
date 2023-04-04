const { BlogRouter } = require("./blog/blog.router");
const { IndicesRoutes } = require("./indices.routes");
const router = require("express").Router();

router.use("/index", IndicesRoutes)
router.use("/blogs", BlogRouter)

module.exports = {
    ElasticRouter : router
}