import { Strategy } from "passport-custom"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { AuthService } from "../auth.service"
import { API_KEY, API_KEY_STRATEGY } from "../enum"

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
	Strategy,
	API_KEY_STRATEGY,
) {
	constructor(private authService: AuthService) {
		super()
	}
	private readonly prefix: string = ""
    private readonly header:string = API_KEY.toLowerCase()
	async validate(request: Request): Promise<any> {
		let apiKey = request.headers[this.header] as string
		if (this.prefix !== "") {
			const datas = apiKey.split(" ")
			if (datas.length !== 2 && datas[0] !== this.prefix) {
				return false
			}
			apiKey = datas[1]
		}
		const checkKey = await this.authService.validateAPIKey(apiKey)
		if (checkKey) {
			return apiKey
		}

		return false
	}
}
