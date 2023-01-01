const { PermissionModel } = require("../../../../models/permission");
const Controller = require("../../controller");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { addPermissionSchema } = require("../../../validators/admin/RBAC.schema");
const createHttpError = require("http-errors");
const { MessageSpecial } = require("../../../../utils/constants");

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
    async findPermissionWithName (name) {
        const permission = await PermissionModel.findOne({name})
        if(permission) throw createHttpError.BadRequest("Access has already been registered")
    }
}
module.exports = {
    AdminPermissionController : new PermissionController()
}