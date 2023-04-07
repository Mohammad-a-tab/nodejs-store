const { ElasticProductController } = require("../../controller/product/product.controller");
const router = require("express").Router();

router.get("/search-MultiField/:search", ElasticProductController.searchByMultiField)
router.get("/search-title/:title", ElasticProductController.searchByTitle)
router.get("/search-title-regexp/:search", ElasticProductController.searchTitleByRegexp)
router.get("/search-text/:text", ElasticProductController.searchByText)
router.get("/search-text-regexp/:search", ElasticProductController.searchTextByRegexp)
router.get("/search-supplier/:supplier", ElasticProductController.searchBySupplier)
router.get("/search-supplier-regexp/:search", ElasticProductController.searchSupplierByRegexp)
router.get("/search-tags/:tags", ElasticProductController.searchByTags)


module.exports = {
    ProductRouter: router 
}

