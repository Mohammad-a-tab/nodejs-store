const { ElasticBlogController } = require("../../controller/admin/blog.controller");
const router = require("express").Router();

router.get("/search-title/:title", ElasticBlogController.searchByTitle)
router.get("/search-title-regexp/:search", ElasticBlogController.searchTitleByRegexp)
router.get("/search-text/:text", ElasticBlogController.searchByText)
router.get("/search-text-regexp/:text", ElasticBlogController.searchTextByRegexp)
router.get("/search-author/:author", ElasticBlogController.searchByAuthor)
router.get("/search-author-regexp/:author", ElasticBlogController.searchAuthorByRegexp)
router.get("/search-tags/:tags", ElasticBlogController.searchByTags)


module.exports = {
    BlogRouter: router 
}

