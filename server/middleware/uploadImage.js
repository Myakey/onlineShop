const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Make the directory if the directory doesn't exits
//Utilizing the mkdir function from the fs package
const uploadDirectory = "uploads/products";
if(!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) =>{
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    //Just image files 
    if (file.mimetype.startsWith("image/")){
        cb(null, true);
    }else {
        cb(new Error("Only image type files are allowed!"), false);
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
})

module.exports = upload;