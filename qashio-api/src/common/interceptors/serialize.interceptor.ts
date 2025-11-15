import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassConstructor<T> = new (...args: any[]) => T

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<any>) { }

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => this.transformResponse(data)))
  }

  private transformResponse(data: unknown): unknown {
    if (!this.dto || data === undefined || data === null) {
      return data
    }
    return plainToInstance(this.dto, data as object, {
      excludeExtraneousValues: true,
    })
  }
}
