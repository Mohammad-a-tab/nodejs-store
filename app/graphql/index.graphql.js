const {  getUserBookmarkedBlogs, getUserBookmarkedCourses, getUserBookmarkedProducts, getUserBasket} = require("./queries/user-profile.resolver");
const { CreateCommentForBlog, CreateCommentForCourse, CreateCommentForProduct} = require("./mutations/comment.resolver");
const { BookmarkBlog, BookmarkCourse, BookmarkProduct } = require("./mutations/bookmarks.resolver");
const { DisLikeBlog, DisLikeCourse, DisLikeProduct } = require("./mutations/dislikes.resolver");
const { CategoriesResolver, CategoryChildResolver } = require("./queries/category.resolver");
const { AddCourseToBasket, AddProductToBasket, RemoveCourseFromBasket, RemoveProductFromBasket } = require("./mutations/basket.resolver");
const { LikeBlog, LikeCourse, LikeProduct } = require("./mutations/likes.resolver");
const { ProductResolver } = require("./queries/product.resolver");
const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { CourseResolver } = require("./queries/course.resolver");
const { BlogResolver } = require("./queries/blog.resolver");

const RootQuery = new GraphQLObjectType({
    name : "RootQuery",
    fields : {
        blogs : BlogResolver,
        products: ProductResolver,
        categories : CategoriesResolver,
        childOfCategory : CategoryChildResolver,
        courses : CourseResolver,
        getUserBookmarkedBlogs,
        getUserBookmarkedCourses,
        getUserBookmarkedProducts,
        getUserBasket
    }
})
const RootMutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        CreateCommentForBlog,
        CreateCommentForProduct,
        CreateCommentForCourse,
        RemoveCourseFromBasket,
        RemoveProductFromBasket,
        AddProductToBasket,
        AddCourseToBasket,
        BookmarkProduct,
        BookmarkCourse,
        BookmarkBlog,
        DisLikeProduct,
        LikeProduct,
        DisLikeCourse,
        LikeCourse,
        DisLikeBlog,
        LikeBlog,
    }
})
const graphQLSchema = new GraphQLSchema({
    query : RootQuery,
    mutation : RootMutation
})
module.exports = {
    graphQLSchema
}