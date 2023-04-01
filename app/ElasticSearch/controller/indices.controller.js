import createHttpError from "http-errors"
import {StatusCodes as HttpStatus} from "http-status-codes"
import { elasticClient } from "../config/elastic.config"
export class IndicesController {
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
export default IndicesController = new IndicesController()