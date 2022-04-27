import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AppS3Controller } from "./apps3.controller"
@Module({
	imports: [],
	controllers: [AppController, AppS3Controller],
	providers: [AppService],
})
export class AppModule {}
