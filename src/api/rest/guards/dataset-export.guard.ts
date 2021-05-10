import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class DatasetExportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpRequest = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(httpRequest);
    return this._validateToken(token);
  }

  _validateToken(token: string) {
    return token !== null && token !== undefined && token?.trim() !== '';
  }
}
