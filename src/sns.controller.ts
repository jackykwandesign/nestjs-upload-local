import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common"
import { SNS } from "aws-sdk"
import { Response } from "express"
import { APIKeyAuthGuard } from "./api-auth/guards/apiKey.guard"
import { smsSNS } from "./config/s3"



@Controller()
export class NotificationController {

	private readonly serverURL = process.env.SERVER_URL

	// @UseGuards(APIKeyAuthGuard)
	@Post("test")
	async test(){
		try {
			let input:SNS.PublishInput = {
				Message: "Your v-code is 123456",
				PhoneNumber:"85267695633",
				// TopicArn:"arn:aws:sns:ap-southeast-1:806170794480:TestSMS"
			}
			const result = await smsSNS.publish(input).promise()
			
			console.log("result", result)
		} catch (error) {
			console.log("error", error)
			throw new BadRequestException()
		}
		return 
	}

	@Get("image/:fileName")
	async getFile(@Res() res: Response, @Param("fileName") fileName: string) {
	}

}
