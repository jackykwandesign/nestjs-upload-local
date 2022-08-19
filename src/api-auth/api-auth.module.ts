import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { APIAuthService } from "./api-auth.service"
import { API_KEY, API_KEY_STRATEGY } from "./enum"
import { ApiKeyStrategy } from "./strategy/apiKey.strategy"

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: API_KEY_STRATEGY,
			property: API_KEY,
		}),
	],
	providers: [APIAuthService, ApiKeyStrategy],
})
export class APIAuthModule {}
