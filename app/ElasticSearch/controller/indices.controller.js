const { StatusCodes: HttpStatus } = require("http-status-codes");
const { elasticClient } = require("../config/elastic.config");
const createHttpError = require("http-errors");

const indexMappingBlog = {
    mappings: {
      properties: {
        Title: { type: 'text' },
        Short_Text: { type: 'text' },
        Text: { type: 'text' },
        image: { type: 'text' },
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
        title: { type: 'text' },
        short_Text: { type: 'text' },
        text: { type: 'text' },
        images: { type: 'text' },
        tags: { type: 'text'},
        type: { type: 'text'},
        price: { type: 'integer'},
        count: { type: 'integer'},
        discount: { type: 'integer'},
        supplier: {
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
        features: {
          type: 'object',
          properties: {
            length: { type: 'text' },
            height: { type: 'text' },
            width: { type: 'text' },
            weight: { type: 'text' },
            colors: { type: 'text' },
            model: { type: 'text' },
            Madin: { type: 'text' }
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
const indexMappingCourse = {
    mappings: {
      properties: {
        title: { type: 'text' },
        short_Text: { type: 'text' },
        text: { type: 'text' },
        image: { type: 'text' },
        tags: { type: 'text'},
        status: { type: 'text'},
        price: { type: 'integer'},
        time: { type: 'text'},
        type: { type: 'text'},
        discount: { type: 'integer'},
        teacher: {
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
        likes: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            First_Name: { type: 'text' },
            Last_Name: { type: 'text' },
            Mobile: { type: 'text' }
          }
        },
        dislikes: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            First_Name: { type: 'text' },
            Last_Name: { type: 'text' },
            Mobile: { type: 'text' }
          }
        },
        bookmarks: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            First_Name: { type: 'text' },
            Last_Name: { type: 'text' },
            Mobile: { type: 'text' }
          }
        },
        chapters: {
          type: 'nested',
          properties: {
            title: { type: 'text' },
            text: { type: 'text' },
            episodes: { 
              type: 'nested',
              properties: {
                title: { type: 'text' },
                text: { type: 'text' },
                type: { type: 'text' },
                time: { type: 'text' },
                videoAddress: { type: 'text' },
              } 
            },
          }
        },
        comments: {
          type: 'nested',
          properties: {
            comment: { type: 'text' },
            show: { type: 'boolean' },
            openToComment: { type: 'boolean' },
            user: { 
              type: 'nested',
              properties: {
                id: { type: 'text' },
                First_Name: { type: 'text' },
                Last_Name: { type: 'text' },
                Mobile: { type: 'text' }
              }
            },
            answers: { 
              type: 'nested',
              properties: {
                comment: { type: 'text' },
                show: { type: 'boolean' },
                openToComment: { type: 'boolean' },
                user: {
                  type: 'nested',
                  properties: {
                    id: { type: 'text' },
                    First_Name: { type: 'text' },
                    Last_Name: { type: 'text' },
                    Mobile: { type: 'text' }
                  }
                }

              }
            }
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
            if(indexName === "blog") {
                indexMapping = indexMappingBlog
            }
            else if(indexName === 'product') {
                indexMapping = indexMappingProduct
            }
            else if(indexName === 'course') {
                indexMapping = indexMappingCourse
            }
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
