const {StatusCodes : HttpStatus} = require("http-status-codes");
const { elasticClient } = require("../../config/elastic.config");
const indexBlog = "blog"

async function createNewBlog (blog) {
    const createResults = await elasticClient.index({
        index: indexBlog,
        document: {...blog} 
    })
    return console.log(createResults);
}
async function getAllBlogs(value = "") {
    const blogs = await elasticClient.search({
        index : indexBlog,
        query : {
            "match_all" : {}
        }
    });
    return blogs.hits.hits
}
module.exports = {
    createNewBlog,
    getAllBlogs
}