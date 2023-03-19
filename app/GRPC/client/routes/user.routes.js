const { UserController } = require('../controllers/user.controller');
const router = require('express').Router();

router.get("/list", UserController)
module.exports = {
    UserRouter : router
}