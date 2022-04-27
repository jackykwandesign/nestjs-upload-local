import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import multer from "multer";
import { IDGenerator } from "src/utils/IDGenerator";

export const ImageFilter:MulterOptions["fileFilter"] = (req, file, callback) =>{
    if(file.originalname.split(".").length !== 2){
        return callback(new Error("Invalid file name."), false) 
    }
    if(!file.mimetype.includes('image')){
        return callback(new Error("Invalid file type. Only Image Accepted."), false) 
    }
    // if(!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)){
    //     return callback(new Error("Invalid file type. Only Image Accepted."), false) 
    // }
    callback(null, true)
}

export const RenameFile:multer.DiskStorageOptions["filename"] = (req, file, callback) =>{
    const extension = file.originalname.split(".")[1]
    const newName = `${IDGenerator()}.${extension}`
    callback(null, newName)
}