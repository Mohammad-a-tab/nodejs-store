const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/function");
const { addRoleSchema } = require("../../../validators/admin/RBAC.schema");
const { MessageSpecial } = require("../../../../utils/constants");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { RoleModel } = require("../../../../models/role");
const { default: mongoose } = require("mongoose");
const Controller = require("../../controller");
const createHttpError = require("http-errors");
class RoleController extends Controller {
    async getAllRoles (req,res,next) {
        try {
            const roles = await RoleModel.find({})
            .populate([{path : "permissions" , select : {'name' : 1 , "description" : 1}}])
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    roles
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async createNewRole(req,res,next) {
        try {
            const {title , description , permissions} = await addRoleSchema.validateAsync(req.body);
            await this.findRoleWithTitle(title)
            const role = await RoleModel.create({title, description , permissions})
            if(!role) throw createHttpError.InternalServerError("Role not created")
            return res.status(HttpStatus.CREATED).json({
                StatusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_ROLE_MESSAGE
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async removeRole (req,res,next) {
        try {
            const {field} = req.params;
            const role = await this.findRoleWithTitleOrID(field)
            const deleteRoleResults = await RoleModel.deleteOne({_id : role._id})
            if(!deleteRoleResults.deletedCount) throw createHttpError.InternalServerError("The Role was not deleted")
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_ROLE_MESSAGE
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateRole (req,res,next) {
        try {
            const {id} = req.params;
            const role = await this.findRoleWithTitleOrID(id)
            const data = copyObject(req.body)
            deleteInvalidPropertyInObject(data , [])
            const updateRoleResults = await RoleModel.updateOne({_id : role._id} , {$set : data})
            if(updateRoleResults.modifiedCount == 0) throw createHttpError.InternalServerError("The Role was not edited")
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_ROLE_MESSAGE
                }
            })
            

        } catch (error) {
            next(error)
        }
    }
    async findRoleWithTitle(title) {
        const role = await RoleModel.findOne({title});
        if(role) throw createHttpError.BadRequest("The role has already been registered")
       
    }
    async findRoleWithTitleOrID(field) {
        let findQuery = mongoose.isValidObjectId(field)? {_id: field} : {title: field}
        const role = await RoleModel.findOne(findQuery)
        if(!role) throw createHttpError.NotFound("The desired role was not found")
        return role
    }

}
module.exports = {
    AdminRoleController : new RoleController()
}