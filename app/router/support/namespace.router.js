const { NameSpaceController } = require("../../http/controllers/support/namespace.controller");
const router = require("express").Router();

router.post("/add", NameSpaceController.addNameSpace)
router.get("/list", NameSpaceController.getListOfNameSpaces)

module.exports = {
    ApiNameSpaceRouter : router
}