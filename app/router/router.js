const { VerifyAccessToken, checkRole } = require("../http/middlewares/verifyAccessToken");
const { AdminRoutes } = require("./admin/admin.routes");
const { HomeRoutes } = require("./api");
const { DeveloperRoutes } = require("./developer.routes");
const { blogApiPrisma } = require("./prisma-api/blog.api");
const { CategoryApiPrisma } = require("./prisma-api/category.api");
const { UserAuthRoutes } = require("./user/auth");
const router = require("express").Router();

router.use("/user", UserAuthRoutes);
router.use("/admin", VerifyAccessToken,AdminRoutes);
router.use("/developer", DeveloperRoutes);
router.use("/blogs", blogApiPrisma)
router.use("/category", CategoryApiPrisma)
router.use("/", HomeRoutes);

module.exports = {
    AllRoutes : router
}