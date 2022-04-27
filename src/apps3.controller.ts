import {
	Controller,
	Get,
	Param,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { AppService } from "./app.service"
import { ImageFilter } from "./filters"
import { UploadSingleOutputDto } from "./dto/uploadsingle-output.dto"
import { ExceptionInterceptor } from "./exception.interceptor"
import { s3, S3MulterFile, s3Storage } from "./config/s3"

import { S3 } from "aws-sdk"
require("dotenv").config()

@Controller()
export class AppS3Controller {
	constructor(private readonly appService: AppService) {}

	@Post("uploadSingleS3")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: ImageFilter,
			storage: s3Storage,
		}),
	)
	@UseInterceptors(ExceptionInterceptor)
	uploadSingleFile(@UploadedFile() file:S3MulterFile) {
		const res: UploadSingleOutputDto = {
			originalname: file.originalname,
			mimetype: file.mimetype,
			filename: file.key,
			url: `${process.env.SERVER_URL}/imageS3/${file.key}`,
			size: file.size,
		}
		return res
	}

	@Get("imageS3/:fileName")
	async getImageS3(
		@Res()res:Response,
		@Param("fileName") fileName:string
	){
		// return "hello s3333 fileName"
		const param :S3.Types.GetObjectRequest = {
			Bucket:process.env.AWS_S3_BUCKET,
			Key:fileName
		}
		s3.getObject(param, (err, data) =>{
			if(err){
				return res.sendStatus(404)
			}
			res.writeHead(200, {'Content-Type': 'image/jpeg'});
			res.write(data.Body, 'binary');
			res.end(null, 'binary');
		})
	}

}
