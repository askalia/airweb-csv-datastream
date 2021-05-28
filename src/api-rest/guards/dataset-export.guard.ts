import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { BearerTokenService } from '../../common/auth/bearer-token/bearer-token.service';

@Injectable()
export class DatasetExportGuard implements CanActivate {
  constructor(private readonly bearerTokenService: BearerTokenService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpRequest = context.switchToHttp().getRequest();
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(httpRequest);

    try {
      return this.bearerTokenService.verifyBearerToken(bearerToken);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
