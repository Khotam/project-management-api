import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EntityPropertyNotFoundError, TypeORMError } from 'typeorm';
import { PostgresErrorCodes } from './constants';

@Catch(TypeORMError)
export class DbExceptionsFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    console.log('exception :>> ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = (exception as any).code;
    console.log('code :>> ', code);
    let message = (exception as any).detail || exception.message;
    console.log('message :>> ', message);
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let details = null;
    let key, value;

    switch (true) {
      case code === PostgresErrorCodes.INVALID_INPUT_SYNTAX:
      case exception instanceof EntityPropertyNotFoundError:
        statusCode = HttpStatus.BAD_REQUEST;
        message = message.split('.')[0].replace('Property', 'Field').replace(/"/g, '');
        break;
      case code === PostgresErrorCodes.FOREIGN_KEY:
        if (/INSERT|UPDATE/i.test((exception as any).query)) {
          statusCode = HttpStatus.BAD_REQUEST;
          [key, value] = this.getKeyValue(message);
          message = `Field ${key} with value '${value}' does not exist`;
        }
        if (/DELETE/i.test((exception as any).query)) {
          statusCode = HttpStatus.CONFLICT;
          message = `Unable to delete: the item being deleted is still referenced from the ${
            message.match(/table "(.+)"/)[1]
          }`;
        }
        break;
      case code === PostgresErrorCodes.DUPLICATE_KEY:
        [key, value] = this.getKeyValue(message);
        message = `Field ${key} with value '${value}' already exists`;
        details = [
          {
            name: key,
            message: [message],
          },
        ];
        statusCode = HttpStatus.CONFLICT;
        break;
      default:
        statusCode = HttpStatus.BAD_REQUEST;
        message = `DB error: ${message}`;
    }

    const json = {
      statusCode,
      message,
      code,
      type: exception.constructor.name,
      ...(details && { details }),
    };

    response.status(statusCode).json(json);
  }

  private getKeyValue(message: string) {
    return message.match(/\((.*?)\)/g).map((match) => match.replace(/[()]/g, ''));
  }
}
