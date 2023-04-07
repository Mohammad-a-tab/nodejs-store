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
    async searchByAuthor (req, res, next) {
        try {
            const {author} = req?.params;
            const product = await elasticClient.search({
                index: indexProduct,
                body: { 
                    query: {
                        bool: {
                            should: [
                                {
                                    nested: {
                                        path: "author",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "author.First_Name": author }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "author",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "author.Last_Name": author }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "author",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "author.UserName": author }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "author",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "author.Mobile": author }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "author",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "author.Email": author }}
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
    async searchAuthorByRegexp (req, res, next) {
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
                                        path: "author",
                                        query: {
                                            regexp: {'author.First_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "author",
                                        query: {
                                            regexp: {'author.Last_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "author",
                                        query: {
                                            regexp: {'author.UserName': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "author",
                                        query: {
                                            regexp: {'author.Mobile': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "author",
                                        query: {
                                            regexp: {'author.Email': `.*${search}.*`}
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
        q: product?.title || product?.text || product?.short_text || product?.tags || product?.image
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