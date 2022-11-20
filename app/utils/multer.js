const multer = require("multer");
const fs = require("fs");
const path = require("path");
function createRoute() {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "blogs" , Year , Month , Day);
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
       const filePath = createRoute();
       cb(null , filePath)
    },
    filename : (req,file,cb) => {
       const ext = path.extname(file.originalname);
       const fileName = String(new Date().getTime() + ext);
       cb(null, fileName)
    }
});
const uploadFile = multer({storage});
module.exports = {
    uploadFile
}