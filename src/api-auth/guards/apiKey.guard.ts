import {
    ExecutionContext,
    Injectable,
    Optional,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport'

import { API_KEY_STRATEGY, API_KEY } from '../enum'

@Injectable()
export class APIKeyAuthGuard extends AuthGuard(API_KEY_STRATEGY) {
    constructor(@Optional() options: AuthModuleOptions) {
        super({
            ...options,
            property: API_KEY,
        })
    }
    getRequest(context: ExecutionContext) {
        //   return getDynamicContextRequest(context)
        return context.switchToHttp().getRequest()
    }

    handleRequest(err, apiKey, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !apiKey) {
            throw (
                err ||
                new UnauthorizedException(
                    `${API_KEY} Not Found in request header`
                )
            )
        }
        return apiKey
    }
}
