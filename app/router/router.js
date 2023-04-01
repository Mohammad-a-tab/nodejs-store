const { VerifyAccessToken, checkRole } = require("../http/middlewares/verifyAccessToken");
const { IndicesRoutes } = require("../ElasticSearch/router/indices.routes");
const { SupportSectionRouter } = require("./support/support.router");
const { CategoryApiPrisma } = require("./prisma-api/category.api");
const { graphqlConfig } = require("../utils/graphql.config");
const { blogApiPrisma } = require("./prisma-api/blog.api");
const { DeveloperRoutes } = require("./developer.routes");
const { AdminRoutes } = require("./admin/admin.routes");
const { graphqlHTTP } = require("express-graphql");
const { UserAuthRoutes } = require("./user/auth");
const { ApiPayment } = require("./api/payment");
const router = require("express").Router();
const { HomeRoutes } = require("./api");

router.use("/user", UserAuthRoutes);
router.use("/admin", VerifyAccessToken,AdminRoutes);
router.use("/developer", DeveloperRoutes);
router.use("/blogs", blogApiPrisma)
router.use("/category", CategoryApiPrisma)
router.use("/graphql", graphqlHTTP(graphqlConfig))
router.use("/", HomeRoutes);
router.use("/elastic/index", IndicesRoutes);
router.use("/support", SupportSectionRouter);
router.use("/", ApiPayment);

module.exports = {
    AllRoutes : router
}