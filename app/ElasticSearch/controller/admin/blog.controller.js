const {StatusCodes : HttpStatus} = require("http-status-codes");
const { elasticClient } = require("../../config/elastic.config");
const indexBlog = "blog"

async function createNewBlog (blog) {
    const createResults = await elasticClient.index({
        index: indexBlog,
        document: {...data} 
    })
    return res.status(HttpStatus.CREATED).json({
        StatusCode: HttpStatus.CREATED,
        data : {
            createResults
        }
    })
}
module.exports = {
    createNewBlog
}