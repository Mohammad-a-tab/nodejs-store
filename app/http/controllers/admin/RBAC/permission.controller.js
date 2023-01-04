const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/function");
const { addPermissionSchema } = require("../../../validators/admin/RBAC.schema");
const { PermissionModel } = require("../../../../models/permission");
const { MessageSpecial } = require("../../../../utils/constants");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");
const Controller = require("../../controller");
class PermissionController extends Controller {
    async getAllPermissions (req,res,next) {
        try {
            const permissions = await PermissionModel.find({});
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    permissions
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async createNewPermission (req,res,next) {
        try {
            const {name , description} = await addPermissionSchema.validateAsync(req.body);
            await this.findPermissionWithName(name);
            const permission = await PermissionModel.create({name , description})
            if(!permission) throw createHttpError.InternalServerError("Access was not registered")
            return res.status(HttpStatus.CREATED).json({
                StatusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_PERMISSION_MESSAGE
                }
            })
        } catch (error) {
            next(error)
        }

    }
    async removePermission(req,res,next) {
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            const deletePermissionResults = await PermissionModel.deleteOne({_id : id})
            if(!deletePermissionResults.deletedCount) throw createHttpError.InternalServerError("The permission was not deleted")
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_PERMISSION_MESSAGE
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updatePermission(req,res,next){
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            const data = copyObject(req.body)
            deleteInvalidPropertyInObject(data , [])
            const updatePermissionResults = await PermissionModel.updateOne({_id : id} , {$set : data})
            if(updatePermissionResults.modifiedCount == 0) throw createHttpError.InternalServerError("The Permission was not edited")
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_PERMISSION_MESSAGE
                }
            })
            

        } catch (error) {
            next(error)
        }
    }
    async findPermissionWithName (name) {
        const permission = await PermissionModel.findOne({name})
        if(permission) throw createHttpError.BadRequest("Access has already been registered")
    }
    async findPermissionWithID (id) {
        const permission = await PermissionModel.findById(id)
        if(!permission) throw createHttpError.NotFound("The desired permission was not found")
        
    }
}
module.exports = {
    AdminPermissionController : new PermissionController()
}