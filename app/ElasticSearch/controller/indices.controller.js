const { StatusCodes: HttpStatus } = require("http-status-codes");
const { elasticClient } = require("../config/elastic.config");
const createHttpError = require("http-errors");

const indexMappingBlog = {
    mappings: {
      properties: {
        Title: { type: 'text' },
        Short_Text: { type: 'text' },
        Text: { type: 'text' },
        Image: { type: 'text' },
        Tags: { type: 'text'},
        author: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            First_Name: { type: 'text' },
            Last_Name: { type: 'text' },
            UserName: { type: 'text' },
            Mobile: { type: 'text' },
            Email: { type: 'text' }
          }
        },
        category: {
          type: 'object',
          properties: {
            id: { type: 'text' },
            Title: { type: 'text' }
          }
        }
      }
    }
};
const indexMappingProduct = {
    mappings: {
      properties: {
        Title: { type: 'text' },
        Short_Text: { type: 'text' },
        Text: { type: 'text' },
        Image: { type: 'text' },
        Tags: { type: 'text'},
        author: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            First_Name: { type: 'text' },
            Last_Name: { type: 'text' },
            UserName: { type: 'text' },
            Mobile: { type: 'text' },
            Email: { type: 'text' }
          }
        },
        category: {
          type: 'object',
          properties: {
            id: { type: 'text' },
            Title: { type: 'text' }
          }
        }
      }
    }
};
class IndicesController {
    async createNewIndex (req, res, next) {
        try {
            const {indexName} = req.body;
            let indexMapping = {}
            if(!indexName) throw createHttpError.BadRequest("Invalid value of index name");
            if(indexName === "blog"){
                indexMapping = indexMappingBlog
            }
            else if(indexName === 'product'){}
            else if(indexName === 'category'){}
            const results = await elasticClient.indices.create({
                index: indexName,
                body: indexMapping
            });
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
