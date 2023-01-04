const { AdminPermissionController } = require("../../http/controllers/admin/RBAC/permission.controller");

const router = require("express").Router();

router.post("/add" 
    , AdminPermissionController.createNewPermission)
router.get("/list" 
    , AdminPermissionController.getAllPermissions)
router.patch("/update/:id" 
    , AdminPermissionController.updatePermission)
router.delete("/remove/:id" 
    , AdminPermissionController.removePermission)
module.exports = {
    AdminApiPermissionRouter : router
}