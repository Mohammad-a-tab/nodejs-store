const { StatusCodes: HttpStatus } = require("http-status-codes");
const { elasticClient } = require("../config/elastic.config");
const createHttpError = require("http-errors");

const indexMappingBlog = {
    mappings: {
      properties: {
        title: { type: 'text' },
        short_text: { type: 'text' },
        text: { type: 'text' },
        image: { type: 'text' },
        tags: { type: ['text'] },
        author: {
          type: 'object',
          properties: {
            id: { type: 'text' },
            first_name: { type: 'text' },
            last_name: { type: 'text' },
            username: { type: 'text' },
            mobile: { type: 'text' },
            email: { type: 'text' }
          }
        },
        category: {
          type: 'object',
          properties: {
            id: { type: 'text' },
            title: { type: 'text' }
          }
        }
      }
    }
  };
class IndicesController {
    async createNewIndex (req, res, next) {
        try {
            const {indexName} = req.body;
            if(!indexName) throw createHttpError.BadRequest("Invalid value of index name");
            const results = await elasticClient.indices.create({index : indexName});
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    results
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removeIndex (req, res, next) {
        try {
            const {indexName} = req.body;
            if(!indexName) throw createHttpError.BadRequest("Invalid value of index name");
            await elasticClient.indices.delete({index : indexName});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : "remove index is Successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getIndices (req, res, next) {
        try {
            const indices = await elasticClient.indices.getAlias()
            return res.status(HttpStatus.OK).json({
                indices : Object.keys(indices)
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    IndicesController : new IndicesController()
}
