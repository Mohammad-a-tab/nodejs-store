module.exports = {
    MongoIDPattern : /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i ,
    ROLES : Object.freeze({
        USER : "USER",
        ADMIN : "ADMIN",
        WRITER : "WRITER",
        TEACHER : "TEACHER",
        SUPPLIER : "SUPPLIER"
    }),
    PERMISSIONS : Object.freeze({
        USER : ["profile"],
        ADMIN : ["all"],
        SUPERADMIN : ["all"],
        CONTENT_MANAGER :[ "course", "blog", "category", "product" , "episode" , "chapter"],
        TEACHER :[ "course", "blog" , "episode" , "chapter"],
        SUPPLIER : ["product"],
        ALL : "all"
    }),
    ACCESS_TOKEN_SECRET_KEY : "CD3B35AB88A13C9D7B4DDA84B40D399CCD51B9E9A5D8B8EF3C18F71251F753B6",
    REFRESH_TOKEN_SECRET_KEY : "BC5AB452A780C757B9A119C5D2459CC320B2BD6B0BF4E73AF53CC2BC0CCCF7E8",
    MessageSpecial : {
        INTERNAL_SERVER_ERROR : "An internal error has occurred",
        SUCCESSFUL_UPDATED_MESSAGE : "The update was completed successfully",
        SUCCESSFUL_UPDATED_BLOG_MESSAGE : "The blog has been successfully updated",
        SUCCESSFUL_UPDATED_EPISODE_MESSAGE : "The Episode has been successfully updated",
        SUCCESSFUL_UPDATED_USER_PROFILE_MESSAGE : "Profile updated successfully",
        SUCCESSFUL_UPDATED_COURSE_MESSAGE : "The course has been updated successfully",
        SUCCESSFUL_UPDATED_CHAPTER_MESSAGE : "The chapter has been updated successfully",
        SUCCESSFUL_UPDATED_ROLE_MESSAGE : "The role has been updated successfully",
        SUCCESSFUL_UPDATED_PERMISSION_MESSAGE : "The permission has been updated successfully",
        SUCCESSFUL_REMOVE_PRODUCT_MESSAGE : "The product has been removed successfully",
        SUCCESSFUL_REMOVE_CHAPTER_MESSAGE : "The chapter has been removed successfully",
        SUCCESSFUL_REMOVE_EPISODE_MESSAGE : "The Episode has been removed successfully",
        SUCCESSFUL_REMOVE_COURSE_MESSAGE : "The Course has been removed successfully",
        SUCCESSFUL_REMOVE_ROLE_MESSAGE : "The role has been removed successfully",
        SUCCESSFUL_REMOVE_PERMISSION_MESSAGE : "The permission has been removed successfully",
        SUCCESSFUL_REMOVE_CATEGORY_MESSAGE : "The category with its subsets was removed",
        SUCCESSFUL_REMOVE_BLOG_MESSAGE : "The blog has been removed successfully",
        SUCCESSFUL_CREATED_PRODUCT_MESSAGE : "Product registration was successful",
        SUCCESSFUL_CREATED_ROLE_MESSAGE : "Role registration was successful",
        SUCCESSFUL_CREATED_PERMISSION_MESSAGE : "Permission registration was successful",
        SUCCESSFUL_CREATED_CHAPTER_MESSAGE : "The operation to add a chapter was completed successfully",
        SUCCESSFUL_CREATED_BLOG_MESSAGE : "Blog registration was successfully",
        SUCCESSFUL_CREATED_EPISODE_MESSAGE : "The operation to add a episode was completed successfully",
        SUCCESSFUL_CREATED_COURSE_MESSAGE : "Course registration was successful",
        SUCCESSFUL_CREATED_CATEGORY_MESSAGE : "Category registration was successful",
        UNSUCCESSFUL_UPDATED_MESSAGE : "Update failed",
        UNSUCCESSFUL_REMOVE_PRODUCT_MESSAGE : "The product was not deleted",
        UNSUCCESSFUL_REMOVE_CATEGORY_MESSAGE : "The category was not deleted",
        UNSUCCESSFUL_REMOVE_CHAPTER_MESSAGE : "There was a problem deleting the chapter",
        UNSUCCESSFUL_CREATED_COURSE_MESSAGE : "The product was not created",
        UNSUCCESSFUL_CREATED_EPISODE_MESSAGE : "There was a problem creating the episode"
        
    },
 
}



