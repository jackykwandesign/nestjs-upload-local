import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class APIAuthService {
    constructor(
        private readonly configService:ConfigService
    ){}

    async validateAPIKey(apiKey:string):Promise<boolean>{
        const apiKeys = this.configService.get<string[]>("API_KEYS") ?? []
        if(apiKeys.includes(apiKey)){
            return true
        }
        return false
    }
}
