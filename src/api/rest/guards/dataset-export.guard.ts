import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { BearerTokenService } from 'src/common/auth/bearer-token/bearer-token.service';

@Injectable()
export class DatasetExportGuard implements CanActivate {
  constructor(private readonly bearerTokenService: BearerTokenService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpRequest = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(httpRequest);

    try {
      return this.bearerTokenService.verifyToken(token);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
