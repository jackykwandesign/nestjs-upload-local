import {
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { Response, Request } from "express"
import { diskStorage } from "multer"
import { join } from "path"
import { AppService } from "./app.service"
import { ImageFilter, RenameFile, VideoFilter } from "./filters"
import * as fs from "fs"
import { UploadSingleOutputDto, UploadSingleVideoOutputDto } from "./dto/uploadsingle-output.dto"
import { ExceptionInterceptor } from "./exception.interceptor"
import { getStoragePath } from "./utils/initStoragePath"
import { APIKeyAuthGuard } from "./auth/guards/apiKey.guard"


@UseGuards(APIKeyAuthGuard)
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post("uploadSingle")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: ImageFilter,
			storage: diskStorage({
				destination: getStoragePath(),
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
				destination: getStoragePath(),
				filename: RenameFile,
			}),
		}),
	)
	@UseInterceptors(ExceptionInterceptor)
	uploadSingleVideo(@UploadedFile() file: Express.Multer.File) {
		const res: UploadSingleVideoOutputDto = {
			originalname: file.originalname,
			mimetype: file.mimetype,
			filename: file.filename,
			url: `${process.env.SERVER_URL}/video/${file.filename}`,
			playerURL:`${process.env.SERVER_URL}/videoPlayer/${file.filename}`,
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
		const range = req.headers.range
		if (!range) {
			return res.status(400).send("Requires Range header")
		}
		if (fs.existsSync(path)) {
			const stat = fs.statSync(path)
			const videoSize = stat.size

			const CHUNK_SIZE = 2 * 10 ** 6 // 1MB
			const start = Number(range.replace(/\D/g, ""))
			const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

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

	@Get("videoPlayer/:fileName")
	async getVideoFileHTMLPlayer(
		@Req() req: Request,
		@Res() res: Response,
		@Param("fileName") fileName: string,
	) {
		let html =
			"<html>" +
			"<body>" +
			'<video width="320" height="240" controls autoplay>' +
			`<source src="http://localhost:4000/video/${fileName}" type="video/mp4">` +
			"Your browser does not support the video tag." +
			"</video>" +
			"</body>" +
			'</html>"'
		return res.send(html)
	}
}
