import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { API_KEY, API_KEY_STRATEGY } from './enum';
import { ApiKeyStrategy } from './strategy/apiKey.strategy';

@Module({
    imports: [    PassportModule.register({
        defaultStrategy: API_KEY_STRATEGY,
        property: API_KEY,
      }),],
    providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
