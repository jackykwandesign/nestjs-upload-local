import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AppS3Controller } from "./apps3.controller"
@Module({
	imports: [],
	controllers: [AppController, AppS3Controller],
	providers: [AppService],
})
export class AppModule {}
