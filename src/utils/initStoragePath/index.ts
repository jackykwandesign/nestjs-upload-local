import * as fs from "fs"
import * as dotenv from "dotenv"
dotenv.config()

const getStoragePath = () =>{
    const path = process.env.STORAGE_PATH
    if(path && path !== null){
        return path
    }else{
        return "./upload"
    }
}

const initStoragePath = () =>{
    const path = getStoragePath()
    // check if exist
    if(!fs.existsSync(path)){
        fs.mkdirSync(path)
    }
}

export {
    getStoragePath,
    initStoragePath
}