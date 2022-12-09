module.exports = {
    MongoIDPattern : /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, 
    ROLES : {
        USER : "USER",
        ADMIN : "ADMIN",
        WRITER : "WRITER",
        TEACHER : "TEACHER",
        SUPPLIER : "SUPPLIER"
    },
    ACCESS_TOKEN_SECRET_KEY : "CD3B35AB88A13C9D7B4DDA84B40D399CCD51B9E9A5D8B8EF3C18F71251F753B6",
    REFRESH_TOKEN_SECRET_KEY : "BC5AB452A780C757B9A119C5D2459CC320B2BD6B0BF4E73AF53CC2BC0CCCF7E8",
    MessageSpecial : {
        INTERNAL_SERVER_ERROR : "خطای داخلی رخ داده است",
        SUCCESSFUL_UPDATED_MESSAGE : "بروزرسانی با موفقیت انجام شد",
        SUCCESSFUL_UPDATED_BLOG_MESSAGE : "بروزرسانی بلاگ با موفقیت انجام شد",
        SUCCESSFUL_REMOVE_PRODUCT_MESSAGE : "حذف محصول با موفقیت انجام شد",
        SUCCESSFUL_CREATED_PRODUCT_MESSAGE : "ثبت محصول با موفقیت انجام شد",
        SUCCESSFUL_CREATED_BLOG_MESSAGE : "ثبت بلاگ با موفقیت انجام شد",
        SUCCESSFUL_CREATED_COURSE_MESSAGE : "ثبت دوره با موفقیت انجام شد",
        SUCCESSFUL_REMOVE_CATEGORY_MESSAGE : "دسته بندی با زیر مجموعه های آن حذف شد",
        SUCCESSFUL_CREATED_CATEGORY_MESSAGE : "دسته بندی با موفقیت افزوده شد",
        SUCCESSFUL_REMOVE_BLOG_MESSAGE : "حذف بلاگ با موفقیت انجام شد",
        UNSUCCESSFUL_UPDATED_MESSAGE : "بروزرسانی انجام نشد",
        UNSUCCESSFUL_REMOVE_PRODUCT_MESSAGE : "حذف محصول انجام نشد",
        UNSUCCESSFUL_CREATED_COURSE_MESSAGE : " دوره ثبت نشد",
        UNSUCCESSFUL_REMOVE_CATEGORY_MESSAGE : "حذف دسته بندی انجام نشد"
        
    },
 
}



