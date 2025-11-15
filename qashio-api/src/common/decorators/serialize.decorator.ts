import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

type ClassConstructor<T> = new (...args: any[]) => T;

export const Serialize = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeInterceptor(dto))
}
