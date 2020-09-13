import { Response } from "common/responses/Response";

export interface MessageResponse extends Partial<Response> {
  message: string;
}
