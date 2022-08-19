import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
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
