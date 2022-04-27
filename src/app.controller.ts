import {
	Controller,
	Get,
	Param,
	Post,
	Res,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { diskStorage } from "multer"
import { join } from "path"
import { AppService } from "./app.service"
import { ImageFilter, RenameFile } from "./filters"
import * as fs from "fs"
import { UploadSingleOutputDto } from "./dto/uploadsingle-output.dto"
require("dotenv").config()

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@Post("uploadSingle")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: ImageFilter,
			storage: diskStorage({
				destination: "./upload",
				filename: RenameFile,
			}),
		}),
	)
	uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    const res:UploadSingleOutputDto = {
      originalname:file.originalname,
      mimetype: file.mimetype,
      filename: file.filename,
      url: `${process.env.SERVER_URL}/image/${file.filename}`,
      size:file.size
    }
    return res
	}

  @Get("image/:fileName")
  async getFile(
    @Res()res:Response,
    @Param("fileName") fileName:string
  ){
    const path = join(__dirname, "..", "upload", fileName)
    if(fs.existsSync(path)){
      return res.sendFile(path)
    }
    return res.sendStatus(404)
  }
}
