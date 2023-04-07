const { BlogRouter } = require("./blog/blog.router");
const { IndicesRoutes } = require("./indices.routes");
const { ProductRouter } = require("./product/product.router");
const router = require("express").Router();

router.use("/index", IndicesRoutes)
router.use("/products", ProductRouter)
router.use("/blogs", BlogRouter)

module.exports = {
    ElasticRouter : router
}