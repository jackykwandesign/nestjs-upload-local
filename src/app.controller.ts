import {
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { Response, Request } from "express"
import { diskStorage } from "multer"
import { join } from "path"
import { AppService } from "./app.service"
import { ImageFilter, RenameFile, VideoFilter } from "./filters"
import * as fs from "fs"
import { UploadSingleOutputDto } from "./dto/uploadsingle-output.dto"
import { ExceptionInterceptor } from "./exception.interceptor"
require("dotenv").config()

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

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
	@UseInterceptors(ExceptionInterceptor)
	uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
		const res: UploadSingleOutputDto = {
			originalname: file.originalname,
			mimetype: file.mimetype,
			filename: file.filename,
			url: `${process.env.SERVER_URL}/image/${file.filename}`,
			size: file.size,
		}
		return res
	}

	@Get("image/:fileName")
	async getFile(@Res() res: Response, @Param("fileName") fileName: string) {
		const path = join(__dirname, "..", "upload", fileName)
		if (fs.existsSync(path)) {
			return res.sendFile(path)
		}
		return res.sendStatus(404)
	}

	@Post("uploadSingleVideo")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: VideoFilter,
			storage: diskStorage({
				destination: "./upload",
				filename: RenameFile,
			}),
		}),
	)
	@UseInterceptors(ExceptionInterceptor)
	uploadSingleVideo(@UploadedFile() file: Express.Multer.File) {
		const res: UploadSingleOutputDto = {
			originalname: file.originalname,
			mimetype: file.mimetype,
			filename: file.filename,
			url: `${process.env.SERVER_URL}/video/${file.filename}`,
			size: file.size,
		}
		return res
	}

	@Get("video/:fileName")
	async getvideoFile(
		@Req() req: Request,
		@Res() res: Response,
		@Param("fileName") fileName: string,
	) {
		const path = join(__dirname, "..", "upload", fileName)
		const range = req.headers.range;
		if (!range) {
			return res.status(400).send("Requires Range header");
		}
		if (fs.existsSync(path)) {
			const stat = fs.statSync(path)
			const videoSize = stat.size

			const CHUNK_SIZE = 10 ** 6; // 1MB
			const start = Number(range.replace(/\D/g, ""));
			const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

			const head = {
				"Content-Range": `bytes ${start}-${end}/${videoSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": videoSize,
				"Content-Type": "video/mp4",
			}
			res.writeHead(206, head)
			const videoStream = fs.createReadStream(path, { start, end })
			return videoStream.pipe(res)
		}
		return res.sendStatus(404)
	}
}
