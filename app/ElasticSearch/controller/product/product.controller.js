const {StatusCodes : HttpStatus} = require("http-status-codes");
const { elasticClient } = require("../../config/elastic.config");
const indexProduct = "product"
class ElasticProductController {
    async searchByTitle (req, res, next) {
        try {
            const {title} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    match: {
                        title
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchBySupplier (req, res, next) {
        try {
            const {supplier} = req?.params;
            const product = await elasticClient.search({
                index: indexProduct,
                body: { 
                    query: {
                        bool: {
                            should: [
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.First_Name": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Last_Name": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.UserName": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Mobile": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Email": supplier }}
                                            ]
                                          }
                                        }
                                    }
                                }
                            ],
                            minimum_should_match: 1,
                        }
                } }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByText (req, res, next) {
        try {
            const {text} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    match: {
                        text
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByTags (req, res, next) {
        try {
            const {tags} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    match: {
                        tags
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTitleByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    regexp: {
                        title: `.*${search}.*`
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTextByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    regexp: {
                        text: `.*${search}.*`
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchSupplierByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                body: {
                    query: {
                        bool: {
                            should: [
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.First_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Last_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.UserName': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Mobile': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Email': `.*${search}.*`}
                                        }
                                    }
                                },
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByMultiField (req, res, next) {
        try {
            const {search} = req.params;
            const product = await elasticClient.search({
                index: indexProduct,
                query: {
                    multi_match: {
                        query: search,
                        fields: ["title", "text", "short_text", "tags"]
                    }
                }
            });
            const productResult = product.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(productResult)
        } catch (error) {
            next(error)
        }
    }
}
async function createNewProductInElasticSearch(product) {
    const createResults = await elasticClient.index({
        index: indexProduct,
        body: {...product} 
    })
    return createResults
}
async function getAllProductsFromElasticSearch() {
    const products = await elasticClient.search({
        index : indexProduct, 
        body: {
            query : {
                "match_all" : {}
            }
        }
    });
    const ProductsResult = products.hits.hits.map(item => item._source)
    return ProductsResult
}
async function removeProductFromElasticSearch(title) {
    const results = await elasticClient.search({
        index : indexProduct,
        q: title
    });
    const ProductID = results.hits.hits[0]._id;
    const deletedResult = await elasticClient.deleteByQuery({
        index : indexProduct,
        query : {
            match : {
                _id : ProductID
            }
        }
    });
    return deletedResult
}
async function updateProductInElasticSearch(product, data) {
    Object.keys(data).forEach(key => {
        if(!data[key]) delete data[key]
    });
    const results = await elasticClient.search({
        index : indexProduct,
        q: product?.title || product?.text || product?.short_text || product?.tags || product?.images
    });
    const productID = results.hits.hits[0]._id;
    const updateResult = await elasticClient.update({
        index: indexProduct,
        id : productID,
        doc: data
    })
    return updateResult
}
module.exports = {
    ElasticProductController: new ElasticProductController(),
    createNewProductInElasticSearch,
    getAllProductsFromElasticSearch,
    removeProductFromElasticSearch,
    updateProductInElasticSearch
}