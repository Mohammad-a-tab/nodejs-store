const { IndicesController } = require("../controller/indices.controller");
const router = require("express").Router();

router.post("/create", IndicesController.createNewIndex)
router.get("/list", IndicesController.getIndices)
router.delete("/remove", IndicesController.removeIndex)

module.exports = {
    IndicesRoutes: router 
}

