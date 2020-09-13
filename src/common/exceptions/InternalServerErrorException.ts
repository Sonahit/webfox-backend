import { HttpStatus } from "common/HttpStatus";
import { HttpException } from "./HttpException";

export class InternalServerErrorException extends HttpException {
  constructor(
    message: string = InternalServerErrorException.name,
    statusCode: HttpStatus = HttpStatus.INTERNAL_ERROR
  ) {
    super(message, statusCode);
  }
}
