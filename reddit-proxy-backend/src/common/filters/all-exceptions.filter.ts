import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // ── Full error logging ──────────────────────────────────────
    if (exception instanceof Error) {
      this.logger.error(`[AllExceptionsFilter] ${request.method} ${request.url} → ${status}: "${message}"`);
      this.logger.error(`Stack: ${exception.stack}`);
      // Log tất cả properties của error object
      this.logger.error(`Full error: ${JSON.stringify(exception, Object.getOwnPropertyNames(exception))}`);
    } else {
      this.logger.error(`[AllExceptionsFilter] ${request.method} ${request.url} → ${status}: "${message}"`);
      this.logger.error(`Non-Error exception: ${JSON.stringify(exception)}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}