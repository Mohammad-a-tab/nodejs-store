const { PermissionModel } = require("../../models/permission");
const { PERMISSIONS } = require("../../utils/constants");
const { RoleModel } = require("../../models/role");
const createHttpError = require("http-errors");

function checkPermission(requiredPermissions = []) {
    return async function (req, res, next) {
      try {
        const allPermissions = requiredPermissions.flat(2)
        const user = req.user;
        const role = await RoleModel.findOne({title : user.Role})
        const permissions = await PermissionModel.find({_id: {$in : role.permissions}})
        const userPermissions = permissions.map(item => item.name)
        const hasPermission = allPermissions.every(permission => {
            return userPermissions.includes(permission)
        })
        if(userPermissions.includes(PERMISSIONS.ALL)) return next()
        if(allPermissions.length == 0 || hasPermission) return next();
        throw createHttpError.Forbidden("You do not have access to this section");
      } catch (error) {
        next(error);
      }
    };
  }
  module.exports = {
    checkPermission
  }

