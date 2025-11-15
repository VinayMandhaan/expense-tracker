import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expectedKey = process.env.API_KEY
    if (!expectedKey) {
      return true
    }
    const request = context.switchToHttp().getRequest<Request>()
    const providedKey = request.header('x-api-key')
    if (!providedKey || providedKey !== expectedKey) {
      throw new ForbiddenException('Invalid API key')
    }
    return true
  }
}
