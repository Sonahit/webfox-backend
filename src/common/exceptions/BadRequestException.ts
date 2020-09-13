import { HttpStatus } from "common/HttpStatus";
import { HttpException } from "./HttpException";

export class BadRequestException extends HttpException {
  constructor(
    message: string = BadRequestException.name,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}
