const { AdminRoleController } = require("../../http/controllers/admin/RBAC/role.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const router = require("express").Router();

router.post("/add" 
    , stringToArray("permissions") 
    , AdminRoleController.createNewRole)
router.get("/list" 
    , AdminRoleController.getAllRoles)
router.patch("/update/:id" 
    , stringToArray("permissions")
    , AdminRoleController.updateRole)
router.delete("/remove/:field" 
    , AdminRoleController.removeRole)

module.exports = {
    AdminApiRoleRouter : router
}