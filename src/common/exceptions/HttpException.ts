import { HttpStatus } from "common/HttpStatus";

export class HttpException extends Error {
  constructor(public message: string, public statusCode: HttpStatus) {
    super(message);
  }
}
