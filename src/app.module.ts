import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AppS3Controller } from "./apps3.controller"
import { ConfigModule } from "@nestjs/config"
import configuration from "./config/configuration"
import { validateMultiple } from "./config/validate-multiple"
import { validateSystemConfig } from "./config/env.validation"
import { validateDBConfig } from "./config/db.validation"
import { typeOrmMongoDBConfig } from "./config/typeorm.config"
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env',`.env.${process.env.NODE_ENV}`],
			load: [configuration],
			validate: validateMultiple([
				validateSystemConfig,
				validateDBConfig,
			]),
		}),
		TypeOrmModule.forRoot({
			...typeOrmMongoDBConfig,
			// logging:true,
		}),
	],
	controllers: [AppController, AppS3Controller],
	providers: [AppService],
})
export class AppModule {}
