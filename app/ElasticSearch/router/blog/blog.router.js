const { ElasticBlogController } = require("../../controller/admin/blog.controller");
const router = require("express").Router();

router.get("/search-title/:title", ElasticBlogController.searchByTitle)
// router.get("/list", IndicesController.getIndices)
// router.delete("/remove", IndicesController.removeIndex)

module.exports = {
    BlogRouter: router 
}

