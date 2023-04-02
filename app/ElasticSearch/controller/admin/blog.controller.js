const {StatusCodes : HttpStatus} = require("http-status-codes");
const { elasticClient } = require("../../config/elastic.config");
const indexBlog = "blog"

async function createNewBlogAtElasticSearch (blog) {
    const createResults = await elasticClient.index({
        index: indexBlog,
        document: {...blog} 
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
module.exports = {
    createNewBlogAtElasticSearch,
    getAllBlogsFromElasticSearch,
    removeBlogFromElasticSearch
}