import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthApiService } from 'src/modules/common/auth/auth-api.service';

@Injectable()
export class DatasetExportGuard implements CanActivate {
  constructor(private readonly authApi: AuthApiService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpRequest = context.switchToHttp().getRequest();
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(httpRequest);

    try {
      return this.authApi.verifyBearerToken(bearerToken);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
