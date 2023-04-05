const {StatusCodes : HttpStatus} = require("http-status-codes");
const { elasticClient } = require("../../config/elastic.config");
const indexBlog = "blog"
class ElasticBlogController {
    async searchByTitle (req, res, next) {
        try {
            const {title} = req.params;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    match: {
                        title
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByAuthor (req, res, next) {
        try {
            const {author} = req?.params;
            const blog = await elasticClient.search({
                index: indexBlog,
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
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByText (req, res, next) {
        try {
            const {text} = req.params;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    match: {
                        text
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByTags (req, res, next) {
        try {
            const {tags} = req.params;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    match: {
                        tags
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTitleByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    regexp: {
                        title: `.*${search}.*`
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTextByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    regexp: {
                        text: `.*${search}.*`
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchAuthorByRegexp (req, res, next) {
        try {
            const {search} = req.body;
            const blog = await elasticClient.search({
                index: indexBlog,
                query: {
                    regexp: {
                        title: `.*${search}.*`
                    }
                }
            });
            const blogResult = blog.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(blogResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByMultiField (req, res, next) {
        try {
            const {search} = req.body;
            const result = await elasticClient.search({
                index: indexBlog,
                query: {
                    multi_match: {
                        query: search,
                        fields: ["title", "text", "short_text", "author"]
                    }
                }
            });
            return res.status(HttpStatus.OK).json(result.hits.hits)
        } catch (error) {
            next(error)
        }
    }
}
async function createNewBlogAtElasticSearch (blog) {
    const createResults = await elasticClient.index({
        index: indexBlog,
        body: {...blog} 
    })
    return createResults
}
async function getAllBlogsFromElasticSearch () {
    const blogs = await elasticClient.search({
        index : indexBlog, 
        query : {
            "match_all" : {}
        }
    });
    return blogs.hits.hits
}
async function removeBlogFromElasticSearch (title) {
    const results = await elasticClient.search({
        index : indexBlog,
        q: title
    });
    const blogID = results.hits.hits[0]._id;
    const deletedResult = await elasticClient.deleteByQuery({
        index : indexBlog,
        query : {
            match : {
                _id : blogID
            }
        }
    });
    return deletedResult
}
async function updateBlogAtElasticSearch (blog, data) {
    Object.keys(data).forEach(key => {
        if(!data[key]) delete data[key]
    });
    const results = await elasticClient.search({
        index : indexBlog,
        q: blog?.title || blog?.text || blog?.short_text || blog?.tags || blog?.image
    });
    const blogID = results.hits.hits[0]._id;
    const updateResult = await elasticClient.update({
        index: indexBlog,
        id : blogID,
        doc: data
    })
    return updateResult
}
module.exports = {
    ElasticBlogController: new ElasticBlogController(),
    createNewBlogAtElasticSearch,
    getAllBlogsFromElasticSearch,
    removeBlogFromElasticSearch,
    updateBlogAtElasticSearch
}