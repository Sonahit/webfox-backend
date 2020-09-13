import { HttpStatus } from "common/HttpStatus";
import { HttpException } from "./HttpException";

export class ForbiddenRequestException extends HttpException {
  constructor(
    message: string = ForbiddenRequestException.name,
    statusCode: HttpStatus = HttpStatus.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
