const { AdminPermissionController } = require("../../http/controllers/admin/RBAC/permission.controller");

const router = require("express").Router();

router.post("/add" , AdminPermissionController.createNewPermission)
router.get("/list" , AdminPermissionController.getAllPermissions)
module.exports = {
    AdminApiPermissionRouter : router
}