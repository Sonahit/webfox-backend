import { HttpStatus } from "common/HttpStatus";
import { HttpException } from "./HttpException";

export class UnAuthorizedRequestException extends HttpException {
  constructor(
    message: string = UnAuthorizedRequestException.name,
    statusCode: HttpStatus = HttpStatus.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
