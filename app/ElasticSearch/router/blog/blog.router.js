const { ElasticBlogController } = require("../../controller/admin/blog.controller");
const router = require("express").Router();

router.get("/search-title/:title", ElasticBlogController.searchByTitle)
router.get("/search-text/:text", ElasticBlogController.searchByText)
router.get("/search-author/:info", ElasticBlogController.searchByAuthor)
router.get("/search-tags/:tags", ElasticBlogController.searchByTags)


module.exports = {
    BlogRouter: router 
}

