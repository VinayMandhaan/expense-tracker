// common/exceptions/http-exception.filter.ts
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const res = ctx.getResponse<Response>()
        const req = ctx.getRequest<Request>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let messages: string[] = ['Internal server error']

        if (exception instanceof QueryFailedError) {
            const driverError: any = (exception as any).driverError ?? {}
            const code: string | undefined = driverError.code
            switch (code) {
                case '23505': // Duplicate
                    status = HttpStatus.CONFLICT
                    messages = ['Duplicate Value']
                    break
                case '23503': // Foreign Key
                    status = HttpStatus.BAD_REQUEST
                    messages = ['Invalid reference']
                    break
                case '23514': // Bad Request
                    status = HttpStatus.BAD_REQUEST
                    messages = ['Bad Request']
                    break
                case '22P02': // Invalid ID
                    status = HttpStatus.BAD_REQUEST
                    messages = ['Invalid UUID']
                    break
                default:
                    status = HttpStatus.INTERNAL_SERVER_ERROR
                    messages = ['Database error']
            }
        }
        else if (exception instanceof HttpException) {
            status = exception.getStatus()
            const resp = exception.getResponse()
            messages =
                typeof resp === 'string'
                    ? [resp]
                    : Array.isArray((resp as any)?.message)
                        ? (resp as any).message
                        : [(resp as any)?.message || (resp as any)?.error || 'Error']
        }

        res.status(status).json({
            success: false,
            statusCode: status,
            error: messages.filter(Boolean),
            path: req.url,
            timestamp: new Date().toISOString(),
        })
    }
}
