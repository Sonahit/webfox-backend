import { Response } from "common/responses/Response";

export interface TokenResponse extends Partial<Response> {
  data: {
    type: "Bearer";
    token: string;
  };
}
